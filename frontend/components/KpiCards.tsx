import { DashboardIcon } from "./DashboardIcon";
import { compactNumber, fullNumber } from "@/lib/formatters";

export type DashboardMetrics = {
  total: number;
  firstYield: number;
  lastYield: number;
  failures: number;
};

export function KpiCards({
  metrics,
  loading,
}: {
  metrics: DashboardMetrics;
  loading: boolean;
}) {
  return (
    <section
      className={`kpi-grid ${loading ? "is-loading" : ""}`}
      aria-label="Key performance indicators"
    >
      <article className="kpi-card accent-primary">
        <div className="kpi-head">
          <span>Total units</span>
          <span className="kpi-icon">
            <DashboardIcon name="database" />
          </span>
        </div>
        <strong>{fullNumber.format(metrics.total)}</strong>
        <p>Serial numbers tested</p>
        <div className="kpi-rule" />
      </article>

      <article className="kpi-card accent-secondary">
        <div className="kpi-head">
          <span>First test yield</span>
          <span className="kpi-badge">FTY</span>
        </div>
        <strong>{metrics.firstYield.toFixed(1)}%</strong>
        <p>Passed on the first attempt</p>
        <div className="kpi-rule">
          <span style={{ width: `${metrics.firstYield}%` }} />
        </div>
      </article>

      <article className="kpi-card accent-success">
        <div className="kpi-head">
          <span>Last test yield</span>
          <span className="kpi-badge">LTY</span>
        </div>
        <strong>{metrics.lastYield.toFixed(1)}%</strong>
        <p>
          <b>
            +{Math.max(0, metrics.lastYield - metrics.firstYield).toFixed(1)} pts
          </b>{" "}
          after retest
        </p>
        <div className="kpi-rule">
          <span style={{ width: `${metrics.lastYield}%` }} />
        </div>
      </article>

      <article className="kpi-card accent-warning">
        <div className="kpi-head">
          <span>Final failures</span>
          <span className="kpi-icon">
            <DashboardIcon name="alert" />
          </span>
        </div>
        <strong>{fullNumber.format(metrics.failures)}</strong>
        <p>
          {metrics.total
            ? ((metrics.failures / metrics.total) * 100).toFixed(1)
            : "0.0"}
          % of total units
        </p>
        <div className="kpi-rule" />
      </article>
    </section>
  );
}
