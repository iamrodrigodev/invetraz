# Integración de Google Classroom API (OAuth 2.0)

Guía de configuración y referencia técnica para la integración de Google Classroom API en Spring Boot mediante credenciales de usuario y `refresh_token`.

---

## 1. Configuración en Google Cloud Console

1. **Habilitar API:**
   - Ir a **APIs y Servicios** > **Biblioteca**.
   - Buscar y habilitar **Google Classroom API**.

2. **Pantalla de Consentimiento de OAuth:**
   - Tipo de usuario: **Interno** (*organización @ulasalle.edu.pe*).
   - Nombre de la aplicación: *Sistema de Investigacion*.
   - Correo electrónico de soporte: Tu correo institucional.

3. **Crear Credenciales:**
   - Tipo: **ID de cliente de OAuth 2.0** > **Aplicación web**.
   - Nombre: *Backend Investigacion*.
   - URI de redireccionamiento autorizados:
     ```text
     https://developers.google.com/oauthplayground
     ```
   - Guardar el **Client ID** y **Client Secret**.

---

## 2. Generación del Refresh Token (OAuth 2.0 Playground)

1. Ingresar a [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Abrir la configuración (icono de engranaje superior derecho) y marcar:
   - **Use your own OAuth credentials**.
   - Ingresar tu **OAuth Client ID** y **OAuth Client Secret**.
3. En **Step 1 (Select & authorize APIs)**, en el campo *Input your own scopes*, ingresar los siguientes alcances:
   ```text
   https://www.googleapis.com/auth/classroom.courses
   https://www.googleapis.com/auth/classroom.coursework.students
   https://www.googleapis.com/auth/classroom.coursework.me
   ```
   > **Nota sobre los scopes:**
   > - `classroom.courses`: Permite leer y gestionar cursos.
   > - `classroom.coursework.students`: Permite consultar tareas donde eres **profesor/docente**.
   > - `classroom.coursework.me`: Permite consultar tareas donde estás inscrito como **alumno/estudiante**.

4. Hacer clic en **Authorize APIs**, iniciar sesión con la cuenta institucional y aceptar los permisos solicitados.
5. En **Step 2 (Exchange authorization code for tokens)**, hacer clic en **Exchange authorization code for tokens**.
6. Copiar el valor generado en **Refresh token** (`1//...`).

---

## 3. Configuración en Spring Boot

En el archivo `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: sistema-de-investigacion
  threads:
    virtual:
      enabled: true
  jackson:
    time-zone: America/Lima

server:
  port: 8080

app:
  google:
    client-id: "TU_CLIENT_ID"
    client-secret: "TU_CLIENT_SECRET"
    refresh-token: "TU_REFRESH_TOKEN"
```

---

## 4. Endpoints Disponibles

Todos los endpoints retornan una estructura estándar `ApiRespuesta<T>`.

### Cursos

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/clases` | Crear una nueva clase en Classroom |
| `PATCH` | `/api/v1/clases/{id}/archivar` | Archivar una clase existente |
| `GET` | `/api/v1/clases` | Listar clases activas y provisionadas |

### Tareas (CourseWork)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/clases/{idClase}/tareas` | Listar las tareas de una clase específica |

#### Respuesta de ejemplo (`GET /api/v1/clases/{idClase}/tareas`)
```json
{
  "mensaje": "Operacion realizada exitosamente",
  "datos": [
    {
      "idTarea": "884450189879",
      "idClase": "819520036866",
      "titulo": "Tarea 090902",
      "descripcion": "Tarea de prueba",
      "estado": "PUBLISHED",
      "enlaceTarea": "https://classroom.google.com/c/ODE5NTIwMDM2ODY2/a/ODg0NDUwMTg5ODc5/details",
      "fechaLimite": "2026-09-20T23:59:59",
      "puntajeMaximo": 20.0
    }
  ]
}
```

#### Atributos devueltos por cada tarea
- `idTarea`: Identificador único asignado por Classroom.
- `idClase`: Identificador del curso al que pertenece la tarea.
- `titulo`: Título de la tarea.
- `descripcion`: Instrucciones o contenido de la tarea.
- `estado`: Estado en Classroom (`PUBLISHED`, `DRAFT`, `DELETED`).
- `enlaceTarea`: Enlace web directo a la tarea en Classroom.
- `fechaLimite`: Fecha y hora límite en formato ISO (`LocalDateTime`), combinando `dueDate` y `dueTime` de Google Classroom. Devuelve `null` si no tiene fecha límite.
- `puntajeMaximo`: Calificación máxima asignada a la tarea.

---

## 5. Consideraciones Técnicas

- **Persistencia de sesión:** El `refresh_token` no caduca en entornos con usuarios internos y renueva automáticamente el `access_token` (de 1 hora) de forma transparente mediante `UserCredentials`.
- **Optimización de red (Windows):** En `SistemaDeInvestigacion.java`, se establece `java.net.preferIPv4Stack=true` para evitar latencias o timeouts por resolución IPv6 en Windows.
- **Respuestas parciales:** Las consultas a Classroom utilizan `.setFields(...)` (`courses(...)` y `courseWork(...)`) para solicitar únicamente los campos necesarios y acelerar la respuesta de la API.
- **Diferenciación de roles:** Para poder listar tareas tanto de cursos donde el usuario es docente como donde es alumno, las credenciales deben tener autorizados ambos scopes (`coursework.students` y `coursework.me`).
