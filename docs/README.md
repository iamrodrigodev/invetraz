# Configuración de Google Classroom API (OAuth 2.0)

Documentación para la integración de Google Classroom API en Spring Boot mediante credenciales de usuario con refresh_token.

## 1. Google Cloud Console

1. **Habilitar API:**
   - En *APIs y Servicios* > *Biblioteca*, buscar y habilitar **Google Classroom API**.

2. **Pantalla de Consentimiento (OAuth):**
   - Tipo de usuario: **Interno** (*organización @ulasalle.edu.pe*).
   - Nombre de aplicación: Sistema de Investigacion.
   - Correo de soporte: Tu correo institucional.

3. **Crear Credenciales:**
   - Tipo: **ID de cliente de OAuth 2.0** > **Aplicación web**.
   - Nombre: Backend Investigacion.
   - URI de redireccionamiento autorizado:
     `	ext
     https://developers.google.com/oauthplayground
     `
   - Guardar el Client ID y Client Secret.

## 2. Generación del Refresh Token (OAuth 2.0 Playground)

1. Ingresar a [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Abrir el panel de configuración (engranaje) y marcar:
   - Use your own OAuth credentials.
   - Ingresar el OAuth Client ID y OAuth Client Secret.
3. En **Step 1**, en *Input your own scopes*, ingresar:
   `	ext
   https://www.googleapis.com/auth/classroom.courses
   `
   Hacer clic en **Authorize APIs**.
4. Iniciar sesión con la cuenta institucional y conceder permisos.
5. En **Step 2**, hacer clic en **Exchange authorization code for tokens**.
6. Copiar el valor generado en **Refresh token** (1//...).

## 3. Configuración en Spring Boot

### application.yml
`yaml
app:
  google:
    client-id: "TU_CLIENT_ID"
    client-secret: "TU_CLIENT_SECRET"
    refresh-token: "TU_REFRESH_TOKEN"
`

## 4. Consideraciones Técnicas

- **Persistencia de sesión:** El refresh_token no expira automáticamente en entornos internos y renueva el access_token de 1 hora de manera transparente.
- **Optimización de red (Windows):** En SistemaDeInvestigacion.java, se establece java.net.preferIPv4Stack=true para evitar retardos por timeout de socket en IPv6.
- **Respuestas parciales:** El repositorio utiliza .setFields("courses(id,name,courseState,alternateLink)") para optimizar los tiempos de respuesta de Google.
