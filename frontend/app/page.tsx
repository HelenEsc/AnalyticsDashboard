"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SummaryRow = {
  TestDate: string;
  Total: number;
  FT_Pass: number;
  FT_Fail: number;
  FT_Yield: number | string | null;
  LT_Pass: number;
  LT_Fail: number;
  LT_Yield: number | string | null;
};

type StationRow = { Station: string; Failures: number };
type ReasonRow = { FailureReason: string; Failures: number };
type DashboardData = { summary: SummaryRow[]; stations: StationRow[]; reasons: ReasonRow[] };

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fullNumber = new Intl.NumberFormat("en-US");

function isoDate(date: Date) { return date.toISOString().slice(0, 10); }
function initialRange(days = 30) {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: isoDate(start), endDate: isoDate(end) };
}
function asNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
function displayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00Z`));
}

function makeDemoData(startDate: string, endDate: string): DashboardData {
  const start = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  const span = Math.max(1, Math.min(31, Math.floor((end.valueOf() - start.valueOf()) / 86400000) + 1));
  const summary = Array.from({ length: span }, (_, index) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (span - 1 - index));
    const total = 820 + ((index * 137) % 410);
    const firstYield = 88.4 + ((index * 17) % 76) / 10;
    const lastYield = Math.min(99.8, firstYield + 4.1 + (index % 3) * 0.5);
    const ftPass = Math.round((total * firstYield) / 100);
    const ltPass = Math.round((total * lastYield) / 100);
    return { TestDate: isoDate(date), Total: total, FT_Pass: ftPass, FT_Fail: total - ftPass, FT_Yield: Number(firstYield.toFixed(1)), LT_Pass: ltPass, LT_Fail: total - ltPass, LT_Yield: Number(lastYield.toFixed(1)) };
  });
  return {
    summary,
    stations: [
      { Station: "RFL-07", Failures: 128 }, { Station: "RFL-03", Failures: 104 },
      { Station: "RFL-11", Failures: 86 }, { Station: "RFL-02", Failures: 64 },
      { Station: "RFL-09", Failures: 43 },
    ],
    reasons: [
      { FailureReason: "Firmware download timeout", Failures: 116 },
      { FailureReason: "Device not detected", Failures: 89 },
      { FailureReason: "Version validation mismatch", Failures: 71 },
      { FailureReason: "Communication lost", Failures: 53 },
      { FailureReason: "Unknown", Failures: 31 },
    ],
  };
}

async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function Icon({ name }: { name: "grid" | "chart" | "alert" | "database" }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 4-5 3 3 5-7"/></>,
    alert: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function TrendChart({ rows }: { rows: SummaryRow[] }) {
  const points = rows.slice(-14);
  if (!points.length) return <div className="empty-state">No trend data for this range.</div>;
  const width = 760, height = 230;
  const padding = { top: 18, right: 18, bottom: 34, left: 44 };
  const minY = Math.max(0, Math.floor(Math.min(...points.flatMap(row => [asNumber(row.FT_Yield), asNumber(row.LT_Yield)])) / 5) * 5 - 5);
  const x = (index: number) => padding.left + (index / Math.max(1, points.length - 1)) * (width - padding.left - padding.right);
  const y = (value: number) => padding.top + ((100 - value) / Math.max(1, 100 - minY)) * (height - padding.top - padding.bottom);
  const line = (key: "FT_Yield" | "LT_Yield") => points.map((row, index) => `${x(index)},${y(asNumber(row[key]))}`).join(" ");
  const gridValues = [minY, Math.round((minY + 100) / 2), 100];
  return <div className="chart-wrap"><svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="First and last test yield trend">
    {gridValues.map(value => <g key={value}><line x1={padding.left} x2={width - padding.right} y1={y(value)} y2={y(value)} className="grid-line"/><text x={padding.left - 10} y={y(value) + 4} textAnchor="end" className="axis-label">{value}%</text></g>)}
    <polyline points={line("FT_Yield")} className="line first-line"/><polyline points={line("LT_Yield")} className="line last-line"/>
    {points.map((row, index) => <g key={row.TestDate}><circle cx={x(index)} cy={y(asNumber(row.FT_Yield))} r="3" className="point first-point"/><circle cx={x(index)} cy={y(asNumber(row.LT_Yield))} r="3" className="point last-point"/>{(index === 0 || index === points.length - 1 || index % 4 === 0) && <text x={x(index)} y={height - 9} textAnchor="middle" className="axis-label">{displayDate(row.TestDate)}</text>}</g>)}
  </svg></div>;
}

export default function Home() {
  const defaultRange = useMemo(() => initialRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [data, setData] = useState<DashboardData>(() => makeDemoData(defaultRange.startDate, defaultRange.endDate));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"live" | "demo">("demo");
  const [notice, setNotice] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboard = useCallback(async (range: { startDate: string; endDate: string }) => {
    const controller = new AbortController();
    setLoading(true); setNotice(null);
    const query = `?startDate=${range.startDate}&endDate=${range.endDate}`;
    try {
      const [summary, stations, reasons] = await Promise.all([
        fetchJson<SummaryRow[]>(`/api/dashboard/summary${query}`, controller.signal),
        fetchJson<StationRow[]>(`/api/dashboard/failures-by-station${query}`, controller.signal),
        fetchJson<ReasonRow[]>(`/api/dashboard/failure-reasons${query}`, controller.signal),
      ]);
      setData({ summary, stations, reasons }); setSource("live");
    } catch {
      setData(makeDemoData(range.startDate, range.endDate)); setSource("demo");
      setNotice("Live API is unavailable. Showing representative demo data until the backend connection is configured.");
    } finally { setLoading(false); setLastUpdated(new Date()); }
    return () => controller.abort();
  }, []);

  useEffect(() => { void loadDashboard(appliedRange); }, [appliedRange, loadDashboard]);

  const metrics = useMemo(() => {
    const total = data.summary.reduce((sum, row) => sum + asNumber(row.Total), 0);
    const firstPass = data.summary.reduce((sum, row) => sum + asNumber(row.FT_Pass), 0);
    const firstFail = data.summary.reduce((sum, row) => sum + asNumber(row.FT_Fail), 0);
    const lastPass = data.summary.reduce((sum, row) => sum + asNumber(row.LT_Pass), 0);
    const lastFail = data.summary.reduce((sum, row) => sum + asNumber(row.LT_Fail), 0);
    return { total, firstYield: firstPass + firstFail ? firstPass / (firstPass + firstFail) * 100 : 0, lastYield: lastPass + lastFail ? lastPass / (lastPass + lastFail) * 100 : 0, failures: lastFail };
  }, [data]);
  const maxStation = Math.max(1, ...data.stations.map(row => asNumber(row.Failures)));
  const totalReasons = Math.max(1, data.reasons.reduce((sum, row) => sum + asNumber(row.Failures), 0));

  function applyPreset(days: number) { const range = initialRange(days); setStartDate(range.startDate); setEndDate(range.endDate); setAppliedRange(range); }
  function applyFilters(event: React.FormEvent) {
    event.preventDefault();
    if (!startDate || !endDate || startDate > endDate) { setNotice("Choose a valid date range before applying the filter."); return; }
    setAppliedRange({ startDate, endDate });
  }

  return <main className="dashboard-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">v1</span><div><strong>Test Analytics</strong><span>Insigths</span></div></div>
      <nav aria-label="Dashboard navigation">
        <a className="nav-item active" href="#overview"><Icon name="grid"/><span>Overview</span></a>
        <a className="nav-item" href="#yield-trend"><Icon name="chart"/><span>Yield trend</span></a>
        <a className="nav-item" href="#failures"><Icon name="alert"/><span>Failures</span></a>
        <a className="nav-item" href="#daily-results"><Icon name="database"/><span>Daily results</span></a>
      </nav>
      <div className="sidebar-footer"><span className={`status-dot ${source}`}/><div><strong>{source === "live" ? "Live connection" : "Demo mode"}</strong><span>BGW720 · Reflash</span></div></div>
    </aside>

    <section className="content" id="overview">
      <header className="topbar"><div><p className="eyebrow">TEST LOGS ANALYTICS</p><h1>BGW720 Reflash Performance</h1><p className="subtitle">First test, recovery and station-level visibility in one live view.</p></div><div className="topbar-meta"><span className={`connection-pill ${source}`}><span className="status-dot"/>{source === "live" ? "Live data" : "Demo data"}</span><span className="updated">Updated {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</span></div></header>

      <form className="filter-bar" onSubmit={applyFilters}>
        <div className="date-control"><label htmlFor="start-date">From</label><input id="start-date" type="date" value={startDate} onChange={event => setStartDate(event.target.value)}/></div>
        <div className="date-control"><label htmlFor="end-date">To</label><input id="end-date" type="date" value={endDate} onChange={event => setEndDate(event.target.value)}/></div>
        <button className="apply-button" type="submit" disabled={loading}>{loading ? "Loading…" : "Apply filters"}</button>
        <div className="presets" aria-label="Quick date ranges"><span>Quick range</span>{[7, 30, 90].map(days => <button type="button" key={days} onClick={() => applyPreset(days)}>{days}D</button>)}</div>
        <div className="range-summary">{dateLabel(appliedRange.startDate)} — {dateLabel(appliedRange.endDate)}</div>
      </form>
      {notice && <div className="notice" role="status"><span>i</span>{notice}</div>}

      <section className={`kpi-grid ${loading ? "is-loading" : ""}`} aria-label="Key performance indicators">
        <article className="kpi-card accent-blue"><div className="kpi-head"><span>Total units</span><span className="kpi-icon"><Icon name="database"/></span></div><strong>{compactNumber.format(metrics.total)}</strong><p>{fullNumber.format(metrics.total)} serial numbers tested</p><div className="kpi-rule"/></article>
        <article className="kpi-card accent-cyan"><div className="kpi-head"><span>First test yield</span><span className="kpi-badge">FTY</span></div><strong>{metrics.firstYield.toFixed(1)}%</strong><p>Passed on the first attempt</p><div className="kpi-rule"><span style={{ width: `${metrics.firstYield}%` }}/></div></article>
        <article className="kpi-card accent-green"><div className="kpi-head"><span>Last test yield</span><span className="kpi-badge">LTY</span></div><strong>{metrics.lastYield.toFixed(1)}%</strong><p><b>+{Math.max(0, metrics.lastYield - metrics.firstYield).toFixed(1)} pts</b> after retest</p><div className="kpi-rule"><span style={{ width: `${metrics.lastYield}%` }}/></div></article>
        <article className="kpi-card accent-orange"><div className="kpi-head"><span>Final failures</span><span className="kpi-icon"><Icon name="alert"/></span></div><strong>{fullNumber.format(metrics.failures)}</strong><p>{metrics.total ? (metrics.failures / metrics.total * 100).toFixed(1) : "0.0"}% of total units</p><div className="kpi-rule"/></article>
      </section>

      <section className="main-grid">
        <article className="panel trend-panel" id="yield-trend"><div className="panel-heading"><div><p className="section-label">PERFORMANCE OVER TIME</p><h2>Yield trend</h2></div><div className="legend"><span><i className="legend-first"/>First test</span><span><i className="legend-last"/>Last test</span></div></div><TrendChart rows={data.summary}/></article>
        <article className="panel stations-panel" id="failures"><div className="panel-heading"><div><p className="section-label">TESTER HEALTH</p><h2>Failures by station</h2></div><span className="panel-total">{fullNumber.format(data.stations.reduce((sum, row) => sum + asNumber(row.Failures), 0))} total</span></div><div className="station-list">{data.stations.slice(0, 6).map((row, index) => <div className="station-row" key={row.Station}><div className="station-meta"><span><b>{String(index + 1).padStart(2, "0")}</b>{row.Station || "Unknown"}</span><strong>{fullNumber.format(row.Failures)}</strong></div><div className="bar-track"><span style={{ width: `${row.Failures / maxStation * 100}%` }}/></div></div>)}</div></article>
      </section>

      <section className="bottom-grid">
        <article className="panel reasons-panel"><div className="panel-heading"><div><p className="section-label">FAILURE ANALYSIS</p><h2>Top failure reasons</h2></div></div><div className="reason-list">{data.reasons.slice(0, 5).map((row, index) => <div className="reason-row" key={`${row.FailureReason}-${index}`}><span className="reason-rank">{index + 1}</span><div className="reason-name"><strong>{row.FailureReason || "Unknown"}</strong><div className="reason-track"><span style={{ width: `${row.Failures / totalReasons * 100}%` }}/></div></div><div className="reason-value"><strong>{row.Failures}</strong><span>{(row.Failures / totalReasons * 100).toFixed(1)}%</span></div></div>)}</div></article>
        <article className="panel table-panel" id="daily-results"><div className="panel-heading"><div><p className="section-label">LATEST OUTPUT</p><h2>Daily results</h2></div><span className="panel-total">Last {Math.min(6, data.summary.length)} days</span></div><div className="table-scroll"><table><thead><tr><th>Date</th><th>Units</th><th>FTY</th><th>LTY</th><th>Recovery</th></tr></thead><tbody>{data.summary.slice(-6).reverse().map(row => { const recovery = asNumber(row.LT_Yield) - asNumber(row.FT_Yield); return <tr key={row.TestDate}><td>{displayDate(row.TestDate)}</td><td>{fullNumber.format(row.Total)}</td><td>{asNumber(row.FT_Yield).toFixed(1)}%</td><td><span className="yield-chip">{asNumber(row.LT_Yield).toFixed(1)}%</span></td><td className="positive">+{recovery.toFixed(1)} pts</td></tr>; })}</tbody></table></div></article>
      </section>
      <footer><span>BGW720 Reflash Analytics</span><span>Source: SQL Server · Refreshes on demand</span></footer>
    </section>
  </main>;
}
