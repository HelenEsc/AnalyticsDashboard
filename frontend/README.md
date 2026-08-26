# Frontend — BGW720 Reflash Analytics

Aplicación Next.js/React sin autenticación. La estructura visual es JSX y los estilos son CSS normal.

## Archivos principales

- `app/page.tsx`: coordina estado, carga y filtros.
- `app/globals.css`: paleta, layout y responsive design.
- `components/KpiCards.tsx`: los cuatro cards principales.
- `components/TrendChart.tsx`: gráfica SVG y panel de tendencia.
- `components/FailurePanels.tsx`: estaciones y razones de fallo.
- `components/DailyResultsTable.tsx`: tabla diaria.
- `components/DateFilters.tsx`: filtros y rangos rápidos.
- `components/Sidebar.tsx`: menú y conexión.
- `lib/dashboard-api.ts`: llamadas HTTP al backend.
- `types/dashboard.ts`: estructuras de respuesta.

## Configuración

Opcionalmente crea `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Si no existe, se utiliza `http://localhost:3000`.

## Comandos

```powershell
npm install
npm run dev
npm run typecheck
npm run build
```
