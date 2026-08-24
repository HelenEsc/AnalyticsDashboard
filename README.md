# BGW720 Reflash Analytics — V1

Complete project with a visual dashboard and backend connected to SQL Server.

## Estructura

- `frontend/`: responsive dashboard with the BGW720 green color palette.
- `backend/`: Node.js/TypeScript API and SQL scripts.


## Preparación inicial

1. Install Node.js 20.9 or higher.
2. In backend/, copy .env.example to .env and configure the SQL Server connection.
3. From the root directory, run:

```powershell
npm run setup
```

## Ejecutar todo el proyecto

```powershell
npm run dev
```

Open `http://localhost:5173`. The frontend communicates with the backend at http://localhost:3000.

If the API or SQL Server is unavailable, the interface displays demo data and clearly indicates it. Once the connection is available, it automatically switches to Live data.

## Validar producción

```powershell
npm run build
```

The database objects are located in backend/database/ and must be executed in the order documented in backend/database/README.md.
