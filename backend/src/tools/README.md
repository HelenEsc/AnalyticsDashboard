# AI tools

This folder is intentionally prepared for the next phase.

Each tool should be a small, controlled function that calls an approved service/procedure.

Example:

getTestSummaryTool()
  -> dashboardService.getTestSummary()

Do not add a generic `executeSql(sqlText)` tool for the AI.
