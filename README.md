# 🛠️ MotoFix Manager - Sistema de Control de Alistamientos y Reparaciones

MVP Full Stack desarrollado para la gestión integral de órdenes de trabajo, clientes, vehículos e ítems de servicio/repuestos en un taller de motocicletas.

---

## 📐 Arquitectura del Proyecto (Monorepo)

```text
taller-motos/
├── backend/          # REST API con Node.js, Express y Sequelize ORM
├── frontend/         # SPA con React, Vite y Axios
└── README.md         # Documentación general
```

🛠️ Stack Tecnológico
Backend: Node.js, Express.js, Sequelize ORM, MySQL, CORS, Dotenv.

Frontend: React, Vite, React Router DOM, Axios, CSS3 (Variables & Responsive Layout).

Base de Datos: MySQL Server.

📋 Requisitos Previos
Node.js (v18+ recomendado)

Servidor MySQL ejecutándose en local (Puerto por defecto: 3306)

Git

🚀 Instalación y Configuración

1. Clonar el Repositorio
   Bash

```
git clone <URL_DEL_REPOSITORIO>
cd taller-motos
```

2. Configuración del Backend
   Entrar a la carpeta backend e instalar dependencias:

Bash

```
cd backend
npm install
```

Crear la base de datos en MySQL (Workbench, DBeaver o CLI):

SQL

```
CREATE DATABASE taller_motos_db;

```

Configurar las variables de entorno:
Crea un archivo .env dentro de la carpeta backend/:

Fragmento de código

```
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña_mysql
DB_NAME=taller_motos_db
DB_PORT=3306
```

Iniciar el servidor backend en modo desarrollo:

Bash

```
npm run dev
```

El servidor quedará ejecutándose en http://localhost:4000

3. Configuración del Frontend
   Abrir una nueva terminal, entrar a la carpeta frontend e instalar dependencias:

Bash

```

cd frontend
npm install

```

Iniciar la aplicación cliente:

Bash

```

npm run dev
```

La aplicación estará disponible en http://localhost:5173

📌 Reglas de Negocio Implementadas
Máquina de Estados Estricta: Las órdenes de trabajo siguen un flujo controlado:
RECIBIDA → DIAGNOSTICO → EN_PROCESO → LISTA → ENTREGADA.

Cancelación de Órdenes: Permite la transición a CANCELADA desde cualquier estado previo a ENTREGADA.

Transacciones SQL Atómicas: Uso de Sequelize.transaction() al agregar o eliminar ítems (mano de obra/repuestos), garantizando la integridad de datos al calcular el costo total de la orden.

Validaciones UX/UI:

Búsqueda de vehículos por placa única.

Restricción de teléfono a exactamente 10 dígitos numéricos en tiempo real.

Validación de formato de correo electrónico (@ y dominio).

🧑‍💻 Credenciales de Prueba (RBAC)

El sistema cuenta con protección de rutas por roles (Fase 2). Utiliza estas credenciales generadas automáticamente para ingresar al sistema:

| Rol          | Correo Electrónico    | Contraseña    | Permisos                                                                   |
| :----------- | :-------------------- | :------------ | :------------------------------------------------------------------------- |
| **ADMIN**    | `admin@taller.com`    | `admin123`    | Control total. Transiciones a ENTREGADA/CANCELADA y borrado de ítems.      |
| **MECANICO** | `mecanico@taller.com` | `mecanico123` | Solo transiciones operativas. No puede cancelar, entregar ni borrar ítems. |
