import type { ReasonRow, StationRow } from "@/types/dashboard";
import { asNumber, fullNumber } from "@/lib/formatters";

export function StationsPanel({ rows }: { rows: StationRow[] }) {
  const maxStation = Math.max(1, ...rows.map((row) => asNumber(row.Failures)));
  const total = rows.reduce((sum, row) => sum + asNumber(row.Failures), 0);

  return (
    <article className="panel stations-panel" id="failures">
      <div className="panel-heading">
        <div>
          <p className="section-label">TESTER HEALTH</p>
          <h2>Failures by station</h2>
        </div>
        <span className="panel-total">{fullNumber.format(total)} total</span>
      </div>
      {rows.length ? (
        <div className="station-list">
          {rows.slice(0, 6).map((row, index) => (
            <div className="station-row" key={row.Station || index}>
              <div className="station-meta">
                <span>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {row.Station || "Unknown"}
                </span>
                <strong>{fullNumber.format(row.Failures)}</strong>
              </div>
              <div className="bar-track">
                <span style={{ width: `${(row.Failures / maxStation) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state compact">No station failures found.</div>
      )}
    </article>
  );
}

export function ReasonsPanel({ rows }: { rows: ReasonRow[] }) {
  const total = Math.max(
    1,
    rows.reduce((sum, row) => sum + asNumber(row.Failures), 0),
  );

  return (
    <article className="panel reasons-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">FAILURE ANALYSIS</p>
          <h2>Top failure reasons</h2>
        </div>
      </div>
      {rows.length ? (
        <div className="reason-list">
          {rows.slice(0, 5).map((row, index) => (
            <div className="reason-row" key={`${row.FailureReason}-${index}`}>
              <span className="reason-rank">{index + 1}</span>
              <div className="reason-name">
                <strong>{row.FailureReason || "Unknown"}</strong>
                <div className="reason-track">
                  <span style={{ width: `${(row.Failures / total) * 100}%` }} />
                </div>
              </div>
              <div className="reason-value">
                <strong>{row.Failures}</strong>
                <span>{((row.Failures / total) * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state compact">No final failures found.</div>
      )}
    </article>
  );
}
