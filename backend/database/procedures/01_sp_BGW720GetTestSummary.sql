CREATE OR ALTER PROCEDURE dbo.sp_BGW720GetTestSummary
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TestDate,
        Total,
        FT_Pass,
        FT_Fail,
        FT_Yield,
        LT_Pass,
        LT_Fail,
        LT_Yield
    FROM dbo.vw_BGW720ReflashTestSummary
    WHERE TestDate >= @StartDate
      AND TestDate < DATEADD(DAY, 1, @EndDate)
    ORDER BY TestDate ASC;
END;
GO
