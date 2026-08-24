CREATE OR ALTER VIEW dbo.vw_BGW720ReflashTestResults
AS
SELECT
    ID,
    CreatedDate,
    SN,
    Model,
    TestResult,
    SlotID,
    StartDate,
    StartTime,
    EndDate,
    EndTime,
    TestTime,
    TimetoFail,
    OperatorWaitTime,
    OperatorID,
    ScriptID,
    ScriptVer,
    ServerDriveVer,
    DTVFAILCODE,
    DTVFAILDESC,
    ComputerID,
    WorkCenterID,
    SiteID,
    RouteID,
    LineID,
    Comment,
    Contract,
    InitialFW,
    TestEndTime,
    TestStartTime,
    FinalFW
FROM dbo.TblBGW720Reflash
WHERE SN IS NOT NULL;
GO
