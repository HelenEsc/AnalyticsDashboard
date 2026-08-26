import type { SummaryRow } from "@/types/dashboard";
import { asNumber, displayDate, fullNumber } from "@/lib/formatters";

export function DailyResultsTable({ rows }: { rows: SummaryRow[] }) {
  return (
    <article className="panel table-panel" id="daily-results">
      <div className="panel-heading">
        <div>
          <p className="section-label">LATEST OUTPUT</p>
          <h2>Daily results</h2>
        </div>
        <span className="panel-total">
          Last {Math.min(6, rows.length)} days
        </span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Units</th>
              <th>FTY</th>
              <th>LTY</th>
              <th>Recovery</th>
            </tr>
          </thead>
          <tbody>
            {[...rows]
              .sort(
                (a, b) =>
                  new Date(b.TestDate).getTime() - new Date(a.TestDate).getTime(),
              )
              .slice(0, 6)
              .map((row) => {
                const recovery =
                  asNumber(row.LT_Yield) - asNumber(row.FT_Yield);

                return (
                  <tr key={row.TestDate}>
                    <td>{displayDate(row.TestDate)}</td>
                    <td>{fullNumber.format(row.Total)}</td>
                    <td>{asNumber(row.FT_Yield).toFixed(1)}%</td>
                    <td>
                      <span className="yield-chip">
                        {asNumber(row.LT_Yield).toFixed(1)}%
                      </span>
                    </td>
                    <td className="positive">
                      {recovery >= 0 ? "+" : ""}
                      {recovery.toFixed(1)} pts
                    </td>
                  </tr>
                );
              })}

            {!rows.length && (
              <tr>
                <td className="table-empty" colSpan={5}>
                  No daily results found for this range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
