import type {
  DashboardData,
  DateRange,
  ReasonRow,
  StationRow,
  SummaryRow,
} from "@/types/dashboard";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`The API returned HTTP ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function fetchDashboard(
  range: DateRange,
  signal: AbortSignal,
): Promise<DashboardData> {
  const query = new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const [summary, stations, reasons] = await Promise.all([
    fetchJson<SummaryRow[]>(`/api/dashboard/summary?${query}`, signal),
    fetchJson<StationRow[]>(
      `/api/dashboard/failures-by-station?${query}`,
      signal,
    ),
    fetchJson<ReasonRow[]>(
      `/api/dashboard/failure-reasons?${query}`,
      signal,
    ),
  ]);

  return { summary, stations, reasons };
}
