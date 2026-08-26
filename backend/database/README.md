# Database layer

Run the scripts in this order on the target SQL Server database:

1. `views/01_vw_BGW720ReflashTestResults.sql`
2. `views/02_vw_BGW720ReflashTestSummary.sql`
3. `procedures/01_sp_BGW720GetTestSummary.sql`
4. `procedures/02_sp_BGW720GetFailuresByStation.sql`

The scripts use `CREATE OR ALTER`, so they can install or update the objects.

The API database user needs only:

- `EXECUTE` on both stored procedures.
- `SELECT` on `dbo.vw_BGW720ReflashTestResults` for the approved failure-reasons query.

No endpoint accepts SQL text from the browser.
