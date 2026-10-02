# Guía de Contribución a SisInv (Sistema de Investigación)

¡Gracias por tu interés en contribuir a **SisInv**! Este es un proyecto de código abierto bajo licencia Apache 2.0 enfocado en proporcionar una solución integral, robusta y soberana para la gestión y seguimiento de investigación académica con integración profunda a Google Workspace (Classroom y Drive).

---

## 1. Principios de Diseño y Arquitectura

SisInv sigue estándares arquitectónicos estrictos:

- **Arquitectura Hexagonal (Ports & Adapters)**:
  - **Dominio (`sisinv/dominio`)**: Entidades puras y reglas de negocio, libres de dependencias externas.
  - **Aplicación (`sisinv/aplicacion`)**: Casos de uso implementados como *Comandos* (patrón Command de Apache Superset) y puertos de entrada/salida (`Protocol` de typing).
  - **Infraestructura (`sisinv/infraestructura`)**: Adaptadores para SQLAlchemy 2.0 ORM, seguridad criptográfica, APIs de Google y FastAPI.
- **Principios SOLID**:
  - Responsabilidad única por comando y servicio.
  - Inversión de dependencias mediante interfaces explícitas.
  - Tipado estricto con Python moderno (Type Hints, Mapped Columns, Pydantic v2).
- **Convención de Idioma**:
  - Todo el código de negocio, entidades, comandos, modelos, variables y documentación está en **español**.

---

## 2. Configuración del Entorno de Desarrollo

### Requisitos Previos

- Python 3.12+ (o 3.14)
- Node.js 22+ y npm
- PostgreSQL 16+ (o Docker)

### Paso a Paso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/iamrodrigodev/sisinv.git
   cd sisinv
   ```

2. **Levantar la base de datos PostgreSQL**:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. **Configurar el Backend (desde la raíz)**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   pip install -e .
   ```

4. **Inicializar la Base de Datos**:
   ```bash
   sisinv init
   ```

5. **Crear Administrador de Desarrollo**:
   ```bash
   sisinv create-admin --email admin@ejemplo.com
   ```

6. **Configurar el Frontend (sisinv-frontend)**:
   ```bash
   cd sisinv-frontend
   npm ci
   npm run dev
   ```

---

## 3. Estándares de Calidad y Pruebas

Toda contribución debe mantener el 100% de las pruebas pasando.

- **Pruebas del Backend (Pytest)**:
   ```bash
   # Desde la raíz del repositorio
   pytest -v
   ```

- **Pruebas del Frontend (Vitest)**:
   ```bash
   cd sisinv-frontend
   npm test
   ```

- **Compilación de Producción del Frontend**:
  ```bash
  npm run build
  ```

---

## 4. Flujo de Trabajo con Git

1. Crea una rama descriptiva para tu cambio:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # o
   git checkout -b fix/correccion-de-error
   ```
2. Realiza commits atómicos y claros en español.
3. Envía un Pull Request describiendo el problema que resuelve y las pruebas añadidas.
