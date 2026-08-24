CREATE OR ALTER VIEW dbo.vw_BGW720ReflashTestSummary
AS
WITH RawData AS
(
    SELECT
        SN AS SerialNumber,
        CreatedDate AS EndDate,
        UPPER(TestResult) AS TestStatus,
        ROW_NUMBER() OVER (
            PARTITION BY SN
            ORDER BY CreatedDate ASC, ID ASC
        ) AS rn_asc,
        ROW_NUMBER() OVER (
            PARTITION BY SN
            ORDER BY CreatedDate DESC, ID DESC
        ) AS rn_desc
    FROM dbo.TblBGW720Reflash
    WHERE SN IS NOT NULL
),
Metrics AS
(
    SELECT
        SerialNumber,
        MAX(CASE WHEN rn_asc = 1 THEN EndDate END) AS FirstTestDate,
        MAX(CASE WHEN rn_asc = 1 THEN TestStatus END) AS FirstStatus,
        MAX(CASE WHEN rn_desc = 1 THEN EndDate END) AS LastTestDate,
        MAX(CASE WHEN rn_desc = 1 THEN TestStatus END) AS LastStatus
    FROM RawData
    WHERE rn_asc = 1 OR rn_desc = 1
    GROUP BY SerialNumber
)
SELECT
    CAST(FirstTestDate AS DATE) AS TestDate,
    COUNT(*) AS Total,
    SUM(CASE WHEN FirstStatus = 'PASS' THEN 1 ELSE 0 END) AS FT_Pass,
    SUM(CASE WHEN FirstStatus = 'FAIL' THEN 1 ELSE 0 END) AS FT_Fail,
    CAST(
        100.0 * SUM(CASE WHEN FirstStatus = 'PASS' THEN 1 ELSE 0 END)
        / NULLIF(SUM(CASE WHEN FirstStatus IN ('PASS', 'FAIL') THEN 1 ELSE 0 END), 0)
        AS DECIMAL(10, 2)
    ) AS FT_Yield,
    SUM(CASE WHEN LastStatus = 'PASS' THEN 1 ELSE 0 END) AS LT_Pass,
    SUM(CASE WHEN LastStatus = 'FAIL' THEN 1 ELSE 0 END) AS LT_Fail,
    CAST(
        100.0 * SUM(CASE WHEN LastStatus = 'PASS' THEN 1 ELSE 0 END)
        / NULLIF(SUM(CASE WHEN LastStatus IN ('PASS', 'FAIL') THEN 1 ELSE 0 END), 0)
        AS DECIMAL(10, 2)
    ) AS LT_Yield
FROM Metrics
GROUP BY CAST(FirstTestDate AS DATE);
GO
