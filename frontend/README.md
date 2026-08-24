# BGW720 Reflash Analytics

Responsive operations dashboard for the BGW720 reflash process.

## Included

- First-test and last-test yield KPIs
- Total output and final failures
- Yield trend chart
- Failures by station
- Top failure reasons
- Daily results table
- Custom date range and 7/30/90-day shortcuts
- Loading, empty, API error and demo-data states

## Connect the live backend

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

The dashboard calls:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/failures-by-station`
- `GET /api/dashboard/failure-reasons`

Each request sends `startDate` and `endDate` in `YYYY-MM-DD` format. If the API
cannot be reached, the interface clearly switches to representative demo data.

For a deployed frontend, set `NEXT_PUBLIC_API_BASE_URL` to the HTTPS address of
the deployed backend and allow that frontend origin in the backend CORS policy.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The production validation command is:

```bash
npm run build
```
