# Informe de arquitectura y calidad del frontend

**Fecha:** 21 de septiembre de 2026
**Alcance:** `sistema-de-investigacion-front-end`, rama `master`, commit `6d714d6`.
**Método:** revisión estática del código fuente, configuración y pruebas existentes. No se modificó la aplicación ni se realizó una auditoría del backend. Los impactos descritos son consecuencias razonadas del código; donde falta una prueba de ejecución se indica.

## Resumen ejecutivo

La aplicación usa React, TypeScript, Vite, Zustand, React Hook Form, Zod y Tailwind. Tiene una separación inicial útil entre `features`, componentes compartidos, esquemas y utilidades. Los problemas principales están en la coordinación del estado: la sesión, la configuración y el módulo activo se representan en varios lugares y se sincronizan mediante efectos y `localStorage`. Esto hace posibles pantallas obsoletas, estados visuales incorrectos y errores difíciles de recuperar.

**Prioridad sugerida:** primero corregir los flujos de autenticación, configuración y navegación (P1); después reducir duplicación y mejorar accesibilidad, pruebas y organización (P2). Las observaciones SOLID son señales de acoplamiento y responsabilidad excesiva, no una exigencia de aplicar patrones por sí mismos.

## Arquitectura actual

| Capa | Ubicación | Responsabilidad observada |
| --- | --- | --- |
| Entrada y navegación | `src/AppRouter.tsx`, `src/App.tsx`, `src/layouts` | Rutas de acceso, selección del módulo, estructura del tablero |
| Funciones de negocio | `src/features/auth`, `setup`, `configuracion`, `plantillas`, `documentacion` | Pantallas, hooks y clientes HTTP de cada función |
| Estado compartido | `src/store/useAppStore.ts`, `src/features/configuracion/store/useConfiguracionStore.ts` | Sesión, setup y configuración de Google/Drive |
| Contratos y transporte | `src/schemas`, `src/utils/fetch.ts`, archivos `*.api.ts` | Validación parcial de respuestas y llamadas HTTP |
| Presentación compartida | `src/components/ui`, `src/components/navigation`, `src/components/drive` | Componentes visuales y estados de carga |

El flujo principal es: `AppRouter` consulta el estado global; `AuthGuard` protege el tablero; `App` selecciona el módulo desde `localStorage`; la configuración combina el store de Zustand con un formulario y dos hooks de verificación. Esta descripción se basa en [AppRouter](src/AppRouter.tsx), [App](src/App.tsx) y [ConfiguracionPage](src/features/configuracion/pages/ConfiguracionPage.tsx).

## Hallazgos P1: corregir primero

### F01. La URL no determina el módulo mostrado

**Evidencia:** [App.tsx:7](src/App.tsx#L7) lee `moduloActivo` de `localStorage`; [AppRouter.tsx:73](src/AppRouter.tsx#L73) solo registra `/*` para el tablero; [PlantillasSeguimientoPage.tsx:169](src/features/plantillas/pages/PlantillasSeguimientoPage.tsx#L169) navega a `/configuracion`.

**Impacto:** al pulsar «Configurar carpeta ahora», cambia la URL, pero `App` puede seguir mostrando el módulo anterior. Los enlaces directos, marcadores y navegación atrás/adelante tampoco determinan la vista. **Recomendación:** definir una ruta por módulo y derivar el elemento activo de `useLocation`/`NavLink`; usar `localStorage` solo como preferencia opcional para la ruta inicial.

### F02. Un HTTP 403 expulsa al usuario como si la sesión hubiera expirado

**Evidencia:** [fetch.ts:19](src/utils/fetch.ts#L19) trata 401 y 403 igual; [fetch.ts:25](src/utils/fetch.ts#L25) limpia la sesión y redirige.

**Impacto:** un recurso prohibido por permisos puede cerrar una sesión todavía válida. **Recomendación:** reservar la expiración para 401 o para un código de error de sesión explícito; mostrar el 403 como denegación de acceso al recurso. Añadir pruebas para ambos estados.

### F03. El estado de setup usa una caché permanente y convierte errores en «configurado»

**Evidencia:** [setup.api.ts:13](src/features/setup/api/setup.api.ts#L13) devuelve `true` si existe `sistema_configurado`; [setup.api.ts:23](src/features/setup/api/setup.api.ts#L23) y [setup.api.ts:33](src/features/setup/api/setup.api.ts#L33) también devuelven `true` ante respuesta fallida o excepción. [useAppStore.ts:86](src/store/useAppStore.ts#L86) establece `configurado: true` cuando falla la comprobación global.

**Impacto:** la UI puede omitir setup o mostrar login por una respuesta de red fallida o un dato local obsoleto. **Recomendación:** representar `desconocido`, `configurado`, `no configurado` y `error` por separado; revalidar con el servidor y ofrecer reintento. No usar `true` como sustituto de «no se pudo consultar».

### F04. Una carga fallida de configuración puede dejar la pantalla en skeleton sin salida

**Evidencia:** [ConfiguracionPage.tsx:25](src/features/configuracion/pages/ConfiguracionPage.tsx#L25) atrapa el fallo y guarda un mensaje; [ConfiguracionPage.tsx:49](src/features/configuracion/pages/ConfiguracionPage.tsx#L49) retorna siempre `ConfiguracionSkeleton` mientras `cargado` siga en `false`. El mensaje y cualquier opción de reintento están después de ese retorno.

**Impacto:** si falla la petición, el usuario no ve el error. **Recomendación:** separar `cargando`, `error` y `cargado`; renderizar un estado de error con botón de reintento cuando corresponda.

### F05. El guardado de credenciales mezcla fallos distintos y puede dejar `cargando` activado

**Evidencia:** [useConfiguracionStore.ts:163](src/features/configuracion/store/useConfiguracionStore.ts#L163) inicia la operación; el `try` verifica y guarda; el `catch` de [línea 183](src/features/configuracion/store/useConfiguracionStore.ts#L183) vuelve a llamar `actualizarConfiguracion`, incluso si el fallo original ocurrió durante el propio guardado. Si esa segunda llamada falla, no se ejecuta el `set` que apaga `cargando` en [línea 195](src/features/configuracion/store/useConfiguracionStore.ts#L195).

**Impacto:** puede repetirse una escritura y quedar la UI en estado de carga indefinido. **Recomendación:** separar «verificación fallida» de «persistencia fallida», realizar una sola escritura según el resultado y limpiar el estado en `finally`.

### F06. El estado visual puede indicar «conectado» para valores editados que aún no se verificaron

**Evidencia:** [useVerificacionConexion.ts:139](src/features/configuracion/hooks/useVerificacionConexion.ts#L139) calcula el estado. Cuando hay un valor guardado verificado, [línea 149](src/features/configuracion/hooks/useVerificacionConexion.ts#L149) devuelve `conectado` sin comprobar si `valorActual` sigue siendo igual a `valorGuardado`. El hook recibe ambos valores y una función `sonIguales`.

**Impacto:** el indicador puede seguir verde mientras el usuario edita credenciales o carpeta. **Recomendación:** derivar el estado «conectado» de la igualdad entre el valor visible y el último valor verificado; mostrar «cambios sin verificar» en caso contrario.

### F07. Las credenciales sensibles regresan completas al navegador y permanecen en estado global

**Evidencia:** [ActualizarCredencialesPeticion.ts:39](src/features/configuracion/types/ActualizarCredencialesPeticion.ts#L39) espera `googleClientSecret` y `googleRefreshToken` en la respuesta; [useConfiguracionStore.ts:123](src/features/configuracion/store/useConfiguracionStore.ts#L123) los guarda en Zustand; [useCredencialesGoogleConfig.ts:39](src/features/configuracion/hooks/useCredencialesGoogleConfig.ts#L39) los carga en el formulario. Que el campo sea de tipo `password` en [CampoCredencial.tsx:34](src/features/configuracion/components/CampoCredencial.tsx#L34) solo oculta su presentación.

**Impacto:** cualquier script que ejecute en el origen puede leer los secretos ya entregados al navegador. **Recomendación:** diseñar un contrato que devuelva estado o valores enmascarados y permita reemplazar secretos sin reenviar los actuales. Este cambio requiere coordinación con el backend; no implica que exista una filtración confirmada.

## Hallazgos P2: diseño, duplicación y mantenimiento

### F08. La sesión tiene varias fuentes de verdad

**Evidencia:** [sesion.ts:22](src/utils/sesion.ts#L22) usa `localStorage` y `sessionStorage`; [useAppStore.ts:50](src/store/useAppStore.ts#L50) mantiene `autenticado` y `usuarioEmail`; [AppRouter.tsx:23](src/AppRouter.tsx#L23) decide el skeleton leyendo la sesión local; [fetch.ts:25](src/utils/fetch.ts#L25) limpia la sesión y redirige; [useAppStore.ts:37](src/store/useAppStore.ts#L37) tiene otra ruta de expiración y redirección.

**Impacto:** el orden de inicialización y la sincronización entre pestañas pueden producir vistas transitorias o inconsistentes. **SOLID:** SRP y DIP débiles: almacenamiento, temporizador, transporte, navegación y estado global se conocen entre sí. **Recomendación:** concentrar el ciclo de sesión en un servicio/store con estados explícitos y una sola acción de cierre; hacer que el transporte notifique el evento sin navegar por su cuenta.

### F09. La configuración mantiene estado redundante y reglas repetidas

**Evidencia:** [useConfiguracionStore.ts:68](src/features/configuracion/store/useConfiguracionStore.ts#L68) conserva credenciales, valores verificados/fallidos y estado de conexión; [useVerificacionConexion.ts:54](src/features/configuracion/hooks/useVerificacionConexion.ts#L54) mantiene nuevamente verificados, fallidos, carga y estado visual; [useCredencialesGoogleConfig.ts:92](src/features/configuracion/hooks/useCredencialesGoogleConfig.ts#L92) repite la comprobación de campos completos que ya existe en [useConfiguracionStore.ts:26](src/features/configuracion/store/useConfiguracionStore.ts#L26). `resolverEstadoConexion` del store no tiene consumidores localizados.

**Impacto:** diferentes indicadores pueden discrepar después de guardar, verificar o recargar. **Recomendación:** almacenar los datos confirmados por servidor y el borrador del formulario; derivar el estado visual con una única función pura y pruebas de transición.

### F10. La carpeta Drive no se sincroniza cuando los valores iniciales se vacían

**Evidencia:** [useCarpetaDriveConfig.ts:49](src/features/configuracion/hooks/useCarpetaDriveConfig.ts#L49) actualiza estado local solo si `carpetaIdInicial` o `carpetaNombreInicial` son truthy. Un valor posterior `null` o cadena vacía no limpia la carpeta anterior.

**Impacto:** la tarjeta puede mostrar una carpeta obsoleta después de limpiar o recargar configuración. **Recomendación:** sincronizar explícitamente valores nulos o, preferiblemente, eliminar la copia local del dato persistido cuando no se está editando.

### F11. El mismo algoritmo de copiado se repite en cuatro tarjetas

**Evidencia:** [TarjetaDocClassroom.tsx:39](src/features/documentacion/components/TarjetaDocClassroom.tsx#L39), [TarjetaDocDrive.tsx:17](src/features/documentacion/components/TarjetaDocDrive.tsx#L17), [TarjetaDocGoogleCloud.tsx:17](src/features/documentacion/components/TarjetaDocGoogleCloud.tsx#L17) y [TarjetaDocOAuthPlayground.tsx:22](src/features/documentacion/components/TarjetaDocOAuthPlayground.tsx#L22) repiten `navigator.clipboard`, fallback con `textarea` y temporizador de 2 segundos.

**Impacto:** cualquier corrección del fallback o del estado «Copiado» debe repetirse cuatro veces. **Recomendación:** extraer una utilidad de copiado y un hook pequeño para el estado temporal; limpiar el temporizador al desmontar.

### F12. Los clientes de API repiten transporte, comprobación y desempaquetado

**Evidencia:** [configuracion.api.ts:16](src/features/configuracion/api/configuracion.api.ts#L16), [plantillas.api.ts:14](src/features/plantillas/api/plantillas.api.ts#L14) y [auth.api.ts:15](src/features/auth/api/auth.api.ts#L15) repiten `fetchSeguro`, `res.ok`, `extraerMensajeError`, esquema de respuesta y `wrapper.datos`.

**Impacto:** políticas de errores o formato de respuesta pueden divergir. **SOLID:** OCP mejorable: añadir una política transversal exige editar cada llamada. **Recomendación:** introducir un cliente HTTP tipado pequeño que reciba el esquema y el mensaje por defecto; conservar los archivos `*.api.ts` como interfaz por función.

### F13. El fallback de entorno siempre usa la misma URL de producción

**Evidencia:** [entorno.ts:3](src/config/entorno.ts#L3) tiene tres ramas que devuelven `https://api-investigacion.iamrodrigo.dev/api/v1`.

**Impacto:** una ejecución local sin `VITE_API_BASE_URL` apunta al servicio de producción; además el condicional añade complejidad sin cambiar el resultado. **Recomendación:** usar un valor por entorno claramente distinto o exigir la variable en desarrollo, y validar la URL con `z.url()`.

### F14. Los modales carecen de gestión de foco y alteran el scroll global sin restaurar su valor previo

**Evidencia:** [Modal.tsx:29](src/components/ui/Modal.tsx#L29) escucha Escape y pone `document.body.style.overflow = "hidden"`; [línea 37](src/components/ui/Modal.tsx#L37) lo restablece a `"unset"`. No se observa traslado de foco al diálogo, trampa de foco ni devolución al disparador. Con dos modales abiertos, el cierre de uno puede habilitar el scroll del otro.

**Impacto:** navegación por teclado deficiente y efectos de scroll inesperados. **Recomendación:** usar un diálogo accesible probado o implementar gestión de foco y conteo de modales; restaurar el valor original de `overflow`.

### F15. Hay controles interactivos anidados en enlaces

**Evidencia:** [TarjetaDocDrive.tsx:89](src/features/documentacion/components/TarjetaDocDrive.tsx#L89), [TarjetaDocClassroom.tsx:115](src/features/documentacion/components/TarjetaDocClassroom.tsx#L115) y [TarjetaDocGoogleCloud.tsx:86](src/features/documentacion/components/TarjetaDocGoogleCloud.tsx#L86) renderizan `<a>` con un `<Button>` que renderiza `<button>`.

**Impacto:** HTML interactivo anidado puede causar comportamiento irregular de teclado y lectores de pantalla. **Recomendación:** estilizar el `<a>` como botón o permitir que `Button` renderice el enlace como elemento raíz.

### F16. Hay rutas de error silenciosas o demasiado generales

**Evidencia:** [auth.api.ts:37](src/features/auth/api/auth.api.ts#L37) convierte cualquier fallo de `/auth/me` en `autenticado: false`; [useAppStore.ts:116](src/store/useAppStore.ts#L116) ignora errores de logout; [PlantillasSeguimientoPage.tsx:59](src/features/plantillas/pages/PlantillasSeguimientoPage.tsx#L59) descarta el error de carga de configuración. [fetch.ts:40](src/utils/fetch.ts#L40) reemplaza distintos errores de `fetch` por un mensaje de conectividad.

**Impacto:** fallos de red, errores de contrato y errores de autorización se ven iguales o quedan invisibles. **Recomendación:** modelar errores por tipo, mostrar opciones de reintento y registrar diagnósticos sin incluir secretos.

### F17. `fetchSeguro` modifica el objeto `RequestInit` recibido

**Evidencia:** [fetch.ts:16](src/utils/fetch.ts#L16) asigna `options.credentials = "include"`.

**Impacto:** quien reutilice el objeto verá una mutación inesperada; también se ignora cualquier intención explícita del llamador. **Recomendación:** construir un nuevo objeto con `{ ...options, credentials: "include" }` y documentar la política de credenciales.

### F18. Faltan pruebas en los flujos de mayor riesgo

**Evidencia:** se encontraron tres archivos `*.test.*`, centrados en Drive y componentes. No se encontraron pruebas para `AppRouter`, sesión, `fetchSeguro`, el store global, guardado de configuración o navegación por módulos.

**Impacto:** los casos descritos en F01–F06 pueden regresar sin ser detectados. **Recomendación:** priorizar pruebas de transición de estado y de interacción: 401 frente a 403, error de setup, fallo de lectura/guardado, edición de credenciales verificadas y navegación por URL. Evitar pruebas que solo reproduzcan detalles de implementación.

## Lectura de SOLID

| Principio | Evaluación basada en el código | Acción útil |
| --- | --- | --- |
| **S — Responsabilidad única** | `useAppStore` coordina sesión, setup, caché, expiración, redirección y limpieza de otro store (F08). `useConfiguracionStore` combina transporte, persistencia y estado visual (F05, F09). | Separar estado confirmado, efectos de red y presentación. |
| **O — Abierto/cerrado** | Las políticas de transporte y errores se repiten en cada cliente de API (F12). | Centralizar esas políticas en una función tipada y extensible por esquema. |
| **L — Sustitución** | No se detectó una jerarquía de clases o interfaces con evidencia suficiente para señalar una infracción. | No introducir abstracciones solo para cumplir LSP. |
| **I — Segregación de interfaces** | `useVerificacionConexion` recibe muchas opciones y expone numerosos setters internos; sus consumidores quedan ligados a detalles de la máquina de estados ([useVerificacionConexion.ts:21](src/features/configuracion/hooks/useVerificacionConexion.ts#L21), [línea 242](src/features/configuracion/hooks/useVerificacionConexion.ts#L242)). | Exponer acciones y estado derivados mínimos; mantener las transiciones internas privadas. |
| **D — Inversión de dependencias** | La lógica de sesión depende directamente de `window`, `localStorage`, `fetch` y el store de configuración (F08). | Encapsular almacenamiento, transporte y navegación en adaptadores o funciones inyectables donde faciliten pruebas. |

## Plan de mejora sugerido

1. **Estabilizar comportamiento:** corregir F01–F06 con pruebas que reproduzcan cada caso; distinguir errores de autenticación, autorización y conectividad.
2. **Reducir exposición de credenciales:** revisar el contrato de configuración para que la lectura no entregue secretos completos (F07).
3. **Consolidar estado:** escoger una fuente de verdad para sesión y configuración; derivar los indicadores visuales; eliminar helpers sin uso (F08–F10).
4. **Extraer duplicación acotada:** unificar copiado y transporte HTTP sin convertirlos en un framework interno (F11–F12).
5. **Accesibilidad y mantenibilidad:** corregir modales y enlaces, configurar entornos y ampliar pruebas de los flujos críticos (F13–F18).

## Límites de la revisión

Este informe se basa en lectura estática del frontend. No valida respuestas reales del servidor, permisos de Google ni comportamiento en producción. Las afirmaciones de riesgo de seguridad describen exposición potencial en el navegador, no un incidente confirmado. No se ejecutó una suite completa de pruebas ni una prueba manual en navegador para esta auditoría.

## Seguimiento de correcciones

Tras la revisión se aplicaron cambios en este mismo repositorio para F01–F06 y F10–F17: rutas basadas en URL, tratamiento separado de 401/403, errores recuperables de setup y configuración, una sola escritura de credenciales, estado visual de edición, sincronización de carpeta, utilidad de portapapeles, cliente de lectura API, entorno local, foco y scroll de modales, enlaces accesibles, errores visibles y opciones HTTP sin mutación. F08 y F09 se redujeron al centralizar la expiración y eliminar estado sin consumidores. F18 se atendió con pruebas adicionales de transporte, setup y configuración.

**Pendiente fuera del frontend:** F07 requiere que el backend deje de devolver el Client Secret y el Refresh Token completos. El formulario actual depende de esa respuesta; cambiar solo su presentación no impediría que los secretos lleguen al navegador.

**Verificación posterior:** comprobación de tipos con el ejecutable local de TypeScript, 19 pruebas con el ejecutable local de Vitest y `git diff --check`. No se usó `npm` para estas verificaciones. La cobertura de pruebas sigue siendo parcial y no se hizo una prueba manual en navegador.
