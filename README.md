# BGW720 Reflash Analytics — V3

Proyecto completo con dashboard visual y backend conectado a SQL Server.

## Estructura

- `frontend/`: dashboard responsive con la paleta verde BGW720.
- `backend/`: API Node.js/TypeScript y scripts SQL.

## Preparación inicial

1. Instala Node.js 20.9 o superior.
2. En `backend/`, copia `.env.example` como `.env` y completa la conexión de SQL Server.
3. Desde la carpeta principal ejecuta:

```powershell
npm run setup
```

## Ejecutar todo el proyecto

```powershell
npm run dev
```

Abre `http://localhost:5173`. El frontend consulta el backend en `http://localhost:3000`.

Si la API o SQL Server no están disponibles, la interfaz muestra datos demostrativos y lo indica claramente. Cuando la conexión responde, cambia automáticamente a `Live data`.

## Validar producción

```powershell
npm run build
```

Los objetos de base de datos están en `backend/database/` y deben ejecutarse en el orden documentado en `backend/database/README.md`.
