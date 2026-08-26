# BGW720 Reflash Analytics — V4

Proyecto único con frontend Next.js/React y backend Fastify/TypeScript conectado a SQL Server. No utiliza autenticación, APIs ni servicios de ChatGPT.

## Estructura

- `frontend/app/`: página y estilos globales.
- `frontend/components/`: cards, filtros, gráfica, sidebar y tablas editables.
- `frontend/lib/`: llamadas al API y funciones de formato.
- `frontend/types/`: contratos TypeScript de los datos.
- `backend/src/`: servidor, rutas, servicios y conexión SQL Server.
- `backend/database/`: vistas y procedimientos almacenados versionados.

## Primera instalación

1. Instala Node.js 20.9 o superior.
2. Copia `backend/.env.example` como `backend/.env` y completa SQL Server.
3. Si necesitas otra URL para el API, copia `frontend/.env.example` como `frontend/.env.local`.
4. Ejecuta los scripts de `backend/database/` en el orden de su README.
5. Desde la raíz ejecuta:

```powershell
npm run setup
npm run dev
```

Abre `http://localhost:5173`. El API se ejecuta en `http://localhost:3000`.

## Validación

```powershell
npm run typecheck
npm run build
```

Si el API o SQL Server no están disponibles, la interfaz muestra `API offline` y no sustituye datos reales por información demostrativa.
