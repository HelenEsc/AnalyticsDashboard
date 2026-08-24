import { getDbPool, sql } from "../config/database.js";

export type DateRange = {
  startDate: string;
  endDate: string;
};

export async function getTestSummary(range: DateRange) {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("StartDate", sql.Date, range.startDate)
    .input("EndDate", sql.Date, range.endDate)
    .execute("dbo.sp_BGW720GetTestSummary");

  return result.recordset;
}

export async function getFailuresByStation(range: DateRange) {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("StartDate", sql.Date, range.startDate)
    .input("EndDate", sql.Date, range.endDate)
    .execute("dbo.sp_BGW720GetFailuresByStation");

  return result.recordset;
}

export async function getFailureReasons(range: DateRange) {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("StartDate", sql.Date, range.startDate)
    .input("EndDate", sql.Date, range.endDate)
    .query(`
      WITH RankedTests AS
      (
        SELECT
          DTVFAILCODE,
          DTVFAILDESC,
          TestResult,
          ROW_NUMBER() OVER (
            PARTITION BY SN
            ORDER BY CreatedDate DESC, ID DESC
          ) AS rn
        FROM dbo.vw_BGW720ReflashTestResults
        WHERE SN IS NOT NULL
          AND CreatedDate >= @StartDate
          AND CreatedDate < DATEADD(DAY, 1, @EndDate)
      ),
      Failures AS
      (
        SELECT
          COALESCE(
            NULLIF(LTRIM(RTRIM(DTVFAILDESC)), ''),
            NULLIF(LTRIM(RTRIM(DTVFAILCODE)), ''),
            'Unknown'
          ) AS FailureReason
        FROM RankedTests
        WHERE rn = 1
          AND UPPER(TestResult) = 'FAIL'
      )
      SELECT
        FailureReason,
        COUNT(*) AS Failures
      FROM Failures
      GROUP BY FailureReason
      ORDER BY Failures DESC, FailureReason ASC;
    `);

  return result.recordset;
}

export async function getTestTrend(range: DateRange) {
  // The summary procedure already returns one row per TestDate, so the same
  // approved procedure is the live trend source as well.
  return getTestSummary(range);
}
