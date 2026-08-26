# Backend — BGW720 Reflash Analytics

API de solo lectura construida con Fastify, TypeScript y SQL Server. No contiene autenticación ni integración de ChatGPT/IA.

## Configuración

1. Copia `.env.example` como `.env`.
2. Completa la conexión de SQL Server y el origen CORS.
3. Ejecuta `npm install` y `npm run dev`.

El API queda disponible en `http://localhost:3000`.

## Endpoints

- `GET /health`
- `GET /health/db`
- `GET /api/dashboard/summary?startDate=2026-08-01&endDate=2026-08-24`
- `GET /api/dashboard/failures-by-station?startDate=2026-08-01&endDate=2026-08-24`
- `GET /api/dashboard/failure-reasons?startDate=2026-08-01&endDate=2026-08-24`
- `GET /api/dashboard/trend?startDate=2026-08-01&endDate=2026-08-24`

Todos consultan SQL Server cuando reciben la solicitud. No existe refresh programado ni caché de datos.

## Origen de cada endpoint

| Endpoint | Fuente aprobada |
| --- | --- |
| `/summary` | `dbo.sp_BGW720GetTestSummary` |
| `/failures-by-station` | `dbo.sp_BGW720GetFailuresByStation` |
| `/failure-reasons` | Consulta parametrizada sobre `dbo.vw_BGW720ReflashTestResults` |
| `/trend` | `dbo.sp_BGW720GetTestSummary` |

No subas el archivo `.env` ni credenciales a Git.
