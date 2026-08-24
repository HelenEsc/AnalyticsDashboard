CREATE OR ALTER PROCEDURE dbo.sp_BGW720GetFailuresByStation
    @StartDate DATE = NULL,
    @EndDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ActualStart DATETIME2 = ISNULL(@StartDate, '19000101');
    DECLARE @ActualEnd DATETIME2 = ISNULL(DATEADD(DAY, 1, @EndDate), '99991231');

    WITH RankedTests AS
    (
        SELECT
            ComputerID,
            SN,
            TestResult,
            ROW_NUMBER() OVER (
                PARTITION BY SN
                ORDER BY CreatedDate DESC, ID DESC
            ) AS rn
        FROM dbo.vw_BGW720ReflashTestResults
        WHERE SN IS NOT NULL
          AND CreatedDate >= @ActualStart
          AND CreatedDate < @ActualEnd
    )
    SELECT
        COALESCE(NULLIF(LTRIM(RTRIM(ComputerID)), ''), 'Unknown') AS Station,
        COUNT(*) AS Failures
    FROM RankedTests
    WHERE rn = 1
      AND UPPER(TestResult) = 'FAIL'
    GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(ComputerID)), ''), 'Unknown')
    ORDER BY Station ASC;
END;
GO
