export type SummaryRow = {
  TestDate: string;
  Total: number;
  FT_Pass: number;
  FT_Fail: number;
  FT_Yield: number | string | null;
  LT_Pass: number;
  LT_Fail: number;
  LT_Yield: number | string | null;
};

export type StationRow = {
  Station: string;
  Failures: number;
};

export type ReasonRow = {
  FailureReason: string;
  Failures: number;
};

export type DashboardData = {
  summary: SummaryRow[];
  stations: StationRow[];
  reasons: ReasonRow[];
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type ConnectionStatus = "connecting" | "live" | "offline";
