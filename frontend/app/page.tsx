"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DailyResultsTable } from "@/components/DailyResultsTable";
import { DateFilters } from "@/components/DateFilters";
import { ReasonsPanel, StationsPanel } from "@/components/FailurePanels";
import { KpiCards } from "@/components/KpiCards";
import { Sidebar } from "@/components/Sidebar";
import { TrendPanel } from "@/components/TrendChart";
import { fetchDashboard } from "@/lib/dashboard-api";
import { asNumber, initialRange } from "@/lib/formatters";
import type { ConnectionStatus, DashboardData, DateRange } from "@/types/dashboard";

const emptyDashboard: DashboardData = { summary: [], stations: [], reasons: [] };

export default function Home() {
  const defaultRange = useMemo(() => initialRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState<DateRange>(defaultRange);
  const [data, setData] = useState<DashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [notice, setNotice] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      setLoading(true);
      setStatus("connecting");
      setNotice(null);

      try {
        const dashboard = await fetchDashboard(appliedRange, controller.signal);
        setData(dashboard);
        setStatus("live");
        setLastUpdated(new Date());
      } catch (error) {
        if (controller.signal.aborted) return;
        setData(emptyDashboard);
        setStatus("offline");
        setNotice(error instanceof Error
          ? `Live data could not be loaded: ${error.message}`
          : "Live data could not be loaded. Verify the backend connection.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadDashboard();
    return () => controller.abort();
  }, [appliedRange]);

  const metrics = useMemo(() => {
    const total = data.summary.reduce((sum, row) => sum + asNumber(row.Total), 0);
    const firstPass = data.summary.reduce((sum, row) => sum + asNumber(row.FT_Pass), 0);
    const firstFail = data.summary.reduce((sum, row) => sum + asNumber(row.FT_Fail), 0);
    const lastPass = data.summary.reduce((sum, row) => sum + asNumber(row.LT_Pass), 0);
    const lastFail = data.summary.reduce((sum, row) => sum + asNumber(row.LT_Fail), 0);

    return {
      total,
      firstYield: firstPass + firstFail ? firstPass / (firstPass + firstFail) * 100 : 0,
      lastYield: lastPass + lastFail ? lastPass / (lastPass + lastFail) * 100 : 0,
      failures: lastFail,
    };
  }, [data]);

  function applyPreset(days: number) {
    const range = initialRange(days);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setAppliedRange(range);
  }

  function applyFilters(event: React.FormEvent) {
    event.preventDefault();
    if (!startDate || !endDate || startDate > endDate) {
      setNotice("Choose a valid date range before applying the filter.");
      return;
    }
    setAppliedRange({ startDate, endDate });
  }

  return (
    <main className="dashboard-shell">
      <Sidebar status={status} />
      <section className="content" id="overview">
        <DashboardHeader status={status} lastUpdated={lastUpdated} />
        <DateFilters startDate={startDate} endDate={endDate}
          appliedRange={appliedRange} loading={loading}
          onStartDateChange={setStartDate} onEndDateChange={setEndDate}
          onApply={applyFilters} onPreset={applyPreset} />

        {notice && <div className="notice" role="status"><span>!</span>{notice}</div>}

        <KpiCards metrics={metrics} loading={loading} />
        <section className="main-grid">
          <TrendPanel rows={data.summary} />
          <StationsPanel rows={data.stations} />
        </section>
        <section className="bottom-grid">
          <ReasonsPanel rows={data.reasons} />
          <DailyResultsTable rows={data.summary} />
        </section>
        <footer>
          <span>BGW720 Reflash Analytics</span>
          <span>Source: SQL Server · Refreshes on demand</span>
        </footer>
      </section>
    </main>
  );
}
