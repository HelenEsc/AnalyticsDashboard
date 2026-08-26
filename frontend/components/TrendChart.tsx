import type { SummaryRow } from "@/types/dashboard";
import { asNumber, displayDate } from "@/lib/formatters";

export function TrendChart({ rows }: { rows: SummaryRow[] }) {
  const points = [...rows]
  .sort(
    (a, b) =>
      new Date(a.TestDate).getTime() - new Date(b.TestDate).getTime(),
  )
  .slice(-14);
  if (!points.length) {
    return <div className="empty-state">No trend data for this range.</div>;
  }

  const width = 760;
  const height = 230;
  const padding = { top: 18, right: 18, bottom: 34, left: 44 };
  const minY = Math.max(
    0,
    Math.floor(
      Math.min(
        ...points.flatMap((row) => [
          asNumber(row.FT_Yield),
          asNumber(row.LT_Yield),
        ]),
      ) / 5,
    ) *
      5 -
      5,
  );
  const x = (index: number) =>
    padding.left +
    (index / Math.max(1, points.length - 1)) *
      (width - padding.left - padding.right);
  const y = (value: number) =>
    padding.top +
    ((100 - value) / Math.max(1, 100 - minY)) *
      (height - padding.top - padding.bottom);
  const line = (key: "FT_Yield" | "LT_Yield") =>
    points
      .map((row, index) => `${x(index)},${y(asNumber(row[key]))}`)
      .join(" ");
  const gridValues = [minY, Math.round((minY + 100) / 2), 100];

  return (
    <div className="chart-wrap">
      <svg
        className="trend-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="First and last test yield trend"
      >
        {gridValues.map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y(value)}
              y2={y(value)}
              className="grid-line"
            />
            <text
              x={padding.left - 10}
              y={y(value) + 4}
              textAnchor="end"
              className="axis-label"
            >
              {value}%
            </text>
          </g>
        ))}
        <polyline points={line("FT_Yield")} className="line first-line" />
        <polyline points={line("LT_Yield")} className="line last-line" />
        {points.map((row, index) => (
          <g key={row.TestDate}>
            <circle
              cx={x(index)}
              cy={y(asNumber(row.FT_Yield))}
              r="3"
              className="point first-point"
            />
            <circle
              cx={x(index)}
              cy={y(asNumber(row.LT_Yield))}
              r="3"
              className="point last-point"
            />
            {(index === 0 ||
              index === points.length - 1 ||
              index % 4 === 0) && (
              <text
                x={x(index)}
                y={height - 9}
                textAnchor="middle"
                className="axis-label"
              >
                {displayDate(row.TestDate)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function TrendPanel({ rows }: { rows: SummaryRow[] }) {
  return (
    <article className="panel trend-panel" id="yield-trend">
      <div className="panel-heading">
        <div>
          <p className="section-label">PERFORMANCE OVER TIME</p>
          <h2>Yield trend</h2>
        </div>
        <div className="legend">
          <span>
            <i className="legend-first" />First test
          </span>
          <span>
            <i className="legend-last" />Last test
          </span>
        </div>
      </div>
      <TrendChart rows={rows} />
    </article>
  );
}
