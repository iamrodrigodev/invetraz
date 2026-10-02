# Inveli — Sistema de Investigación

[![Licencia](https://img.shields.io/badge/licencia-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![Tests](https://img.shields.io/badge/tests-515%20passing-brightgreen.svg)](#pruebas-y-calidad)

**Inveli (Sistema de Investigación)** es una plataforma de código abierto de grado institucional diseñada para la gestión, seguimiento y supervisión de actividades de investigación formativa y académica, con sincronización e integración nativa a **Google Classroom** y **Google Drive**.

Inspirada en el modelo de distribución y arquitectura de **Apache Superset**, Inveli empaqueta su Frontend (React 19 SPA) y Backend (Python FastAPI) en una **imagen única unificada de Docker**, ofreciendo máxima facilidad de despliegue, seguridad criptográfica y una potente herramienta de línea de comandos (`inveli` CLI).

---

## 🏛️ Arquitectura del Sistema

El backend está construido bajo los principios de **Arquitectura Hexagonal (Ports & Adapters)** y **SOLID**, manteniendo el dominio de negocio totalmente desacoplado de los detalles tecnológicos y librerías externas. Además, todo el código, variables, entidades y comandos están rigurosamente desarrollados en **idioma español**.

```mermaid
flowchart TD
    subgraph Cliente["Navegador Web / Cliente"]
        SPA["Frontend SPA (React 19 + Vite)"]
    end

    subgraph ContenedorInveli["Contenedor Inveli (Imagen Unificada)"]
        subgraph ServidorHTTP["Servidor Web (FastAPI / Uvicorn)"]
            StaticServer["Manejador Estáticos & Fallback SPA"]
            APIEnrutador["Rutas REST /api/v1"]
        end

        subgraph CapaAplicacion["Capa de Aplicación (Hexagonal)"]
            Comandos["Comandos de Negocio (Patrón Command)\n• ComandoLogin\n• ComandoGuardarConfiguracion\n• ComandoSincronizarActividades\n• ComandoListarClasesDocente"]
            Puertos["Puertos / Interfaces (typing.Protocol)\n• PuertoRepositorioUsuarios\n• PuertoGoogleClassroom\n• PuertoGoogleDrive\n• PuertoCriptografia"]
        end

        subgraph CapaInfraestructura["Capa de Infraestructura (Adaptadores)"]
            SQLAlchemy["Adaptador SQLAlchemy 2.0 ORM\n(PostgreSQL + psycopg)"]
            CriptoAES["Adaptador Criptografía AES-256-GCM\n(Tokens Google cifrados)"]
            AdaptadorGoogle["Clientes Google Classroom v1 & Drive v3\n(Caché TTL en memoria)"]
            SeguridadJWT["Adaptador JWT HS256 + BCrypt"]
        end
    end

    subgraph ServiciosExternos["Servicios Externos"]
        PG[(PostgreSQL 16\nEsquemas: auth, configuracion, seguimiento)]
        GClassroom["Google Classroom API"]
        GDrive["Google Drive API"]
    end

    SPA -->|Rutas de Navegación| StaticServer
    SPA -->|Peticiones JSON /api/v1| APIEnrutador
    APIEnrutador --> Comandos
    Comandos --> Puertos
    Puertos -.-> SQLAlchemy
    Puertos -.-> CriptoAES
    Puertos -.-> AdaptadorGoogle
    Puertos -.-> SeguridadJWT
    SQLAlchemy --> PG
    AdaptadorGoogle --> GClassroom
    AdaptadorGoogle --> GDrive
```

---

## ✨ Características Principales

- **Distribución All-in-One (Estilo Apache Superset)**: Un solo contenedor sirve tanto los archivos estáticos optimizados de la SPA como los endpoints REST de FastAPI bajo el mismo origen.
- **Arquitectura Hexagonal & SOLID**: Separación nítida entre Dominio, Aplicación (Comandos) e Infraestructura (Adaptadores).
- **ORM Avanzado SQLAlchemy 2.0 & Migraciones Alembic**: Mapeo declarativo moderno con anotaciones `Mapped[...]`, soporte multi-esquema nativo (`auth`, `configuracion`, `seguimiento`) y migraciones automáticas.
- **Criptografía de Grado Militar (AES-256-GCM)**: Cifrado autenticado de credenciales y tokens OAuth2 de Google, 100% interoperable a nivel binario con sistemas legados Java/Spring (`12-byte IV + ciphertext + 16-byte GCM tag`).
- **Autenticación Híbrida Segura**: Soporte para cookies `HttpOnly; SameSite=Lax` y cabeceras estándar `Authorization: Bearer <token>`. Hashing de contraseñas con **BCrypt** compatible con Spring Security.
- **Herramienta CLI Inveli**: Administración centralizada desde la terminal (`inveli run`, `inveli init`, `inveli db upgrade`, `inveli create-admin`).
- **Frontend de Alto Rendimiento**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons y Zustand.

---

## 📁 Estructura del Monorepo (Idéntica a Apache Superset)

```
gccinv/
├── inveli/                      # Backend Python (paquete núcleo en la raíz, como superset/)
│   ├── dominio/                 # Entidades y excepciones puras
│   ├── aplicacion/              # Casos de uso (Comandos) y Puertos
│   ├── infraestructura/         # Adaptadores (SQLAlchemy, Google APIs, Cripto, API REST)
│   ├── fabrica_aplicacion.py    # Fábrica FastAPI create_app()
│   ├── cli.py                   # Herramienta CLI de administración
│   └── config.py                # Configuración Pydantic Settings
├── inveli-frontend/             # Frontend SPA React 19 (como superset-frontend/)
│   ├── src/                     # Código fuente React + TypeScript
│   ├── package.json             # Dependencias del cliente Vite
│   └── vite.config.ts           # Configuración del bundler
├── docker/                      # Scripts y configuraciones Docker (como en Superset)
│   ├── docker-entrypoint.sh     # Script de entrada para el contenedor
│   └── docker-init.sh           # Script de inicialización de BD y admin
├── requirements/                # Dependencias segmentadas (como en Superset)
│   ├── base.txt                 # Dependencias base de producción
│   ├── testing.txt              # Dependencias para pruebas
│   └── local.txt                # Dependencias para desarrollo local
├── tests/                       # Pruebas automatizadas de Python (Pytest) en la raíz
├── sql/                         # Scripts DDL para esquemas PostgreSQL
│   ├── 00_esquemas.sql
│   ├── 01_estructura.sql
│   ├── 02_agregar_carpeta_drive.sql
│   ├── 03_agregar_estados_configuracion.sql
│   └── 04_crear_actividades_seguimiento.sql
├── alembic/                     # Migraciones de base de datos
├── alembic.ini                  # Configuración de migraciones
├── pyproject.toml               # Manifiesto y punto de entrada CLI (inveli)
├── requirements.txt             # Dependencias consolidadas
├── Dockerfile                   # Construcción multi-stage all-in-one
├── docker-compose.yml           # Despliegue de producción con PostgreSQL
├── docker-compose.dev.yml       # Base de datos aislada para desarrollo
├── .env.example                 # Variables de entorno documentadas
├── CONTRIBUTING.md              # Guía de contribución
├── LICENSE                      # Licencia Apache 2.0
└── README.md                    # Documentación principal
```

---

## 🚀 Inicio Rápido con Docker

La forma más rápida de ejecutar Inveli es mediante **Docker Compose**:

### 1. Clonar el repositorio y configurar variables
```bash
git clone https://github.com/iamrodrigodev/inveli.git
cd inveli
cp .env.example .env
```

### 2. Iniciar los servicios
```bash
docker compose up -d --build
```

### 3. Crear el usuario Administrador inicial
Al igual que en Apache Superset, puedes invocar la CLI dentro del contenedor:
```bash
docker compose exec inveli inveli create-admin
```
El asistente te solicitará el correo electrónico y la contraseña del administrador.

### 4. Acceder al sistema
Abre tu navegador en:
👉 **http://localhost:8080**

---

## 🛠️ Herramienta de Línea de Comandos (`inveli` CLI)

El comando `inveli` proporciona utilidades directas para la administración del sistema:

| Comando | Descripción |
| :--- | :--- |
| `inveli run` | Inicia el servidor web Uvicorn (opciones `--host`, `--port`, `--workers`, `--reload`). |
| `inveli init` | Inicializa los esquemas PostgreSQL (`auth`, `configuracion`, `seguimiento`) y aplica migraciones. |
| `inveli db upgrade` | Ejecuta las migraciones pendientes de Alembic hasta la última versión (`head`). |
| `inveli db migrate -m "descripción"` | Autogenera una nueva migración de base de datos comparando modelos ORM. |
| `inveli create-admin` | Crea interactivamente un nuevo usuario con rol de Administrador. |

---

## 💻 Desarrollo Local

Si prefieres desarrollar localmente sin Docker para los servicios de aplicación:

### Requisitos
- **Python 3.12+**
- **Node.js 22+**
- **PostgreSQL 16+**

### Paso 1: Levantar la base de datos
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Paso 2: Configurar y ejecutar el Backend (desde la raíz)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .

# Inicializar base de datos y crear admin inicial
inveli init
inveli create-admin --email admin@ejemplo.com

# Ejecutar servidor FastAPI con recarga en caliente
inveli run --reload --port 8080
```

### Paso 3: Configurar y ejecutar el Frontend (inveli-frontend)
En otra terminal:
```bash
cd inveli-frontend
npm ci
npm run dev
```
El servidor de desarrollo de Vite estará disponible en `http://localhost:5173`, redirigiendo automáticamente las llamadas de API a `http://localhost:8080/api/v1`.

---

## 🧪 Pruebas y Calidad

El proyecto cuenta con una cobertura integral de pruebas automatizadas:

### Pruebas del Backend (Pytest)
```bash
# Desde la raíz del repositorio
pytest -v
```
- ✅ **17 pruebas unitarias y de integración** cubriendo criptografía AES-GCM, seguridad JWT/BCrypt, limitadores de tasa, comandos de aplicación y endpoints REST FastAPI.

### Pruebas del Frontend (Vitest)
```bash
cd inveli-frontend
npm test
```
- ✅ **498 pruebas unitarias y de interfaz** cubriendo stores Zustand, componentes React, validaciones Zod y flujos de autenticación.

---

## 🔒 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto HTTP donde escuchará el servidor. | `8080` |
| `HOST` | Interfaz de red para el servidor. | `0.0.0.0` |
| `DB_HOST` | Host del servidor PostgreSQL. | `localhost` (o `db` en docker) |
| `DB_PORT` | Puerto de conexión a PostgreSQL. | `5432` |
| `DB_NAME` | Nombre de la base de datos. | `sistema_investigacion` |
| `DB_USER` | Usuario de base de datos. | `investigacion` |
| `DB_PASSWORD` | Contraseña de base de datos. | `postgres` |
| `APP_JWT_SECRET` | Clave secreta para la firma y verificación de JWT (HS256). | *(generar en prod)* |
| `APP_MASTER_KEY` | Clave maestra AES-256 para el cifrado de tokens Google. | *(32+ caracteres)* |
| `COOKIE_SECURE` | Define el flag `Secure` en cookies de sesión (activar en HTTPS). | `false` |
| `APP_CORS_ORIGINS` | Lista de orígenes permitidos separados por comas. | `http://localhost:8080` |

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la **Apache License 2.0**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
