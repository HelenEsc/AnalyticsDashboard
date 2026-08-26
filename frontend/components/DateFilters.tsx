import type { DateRange } from "@/types/dashboard";
import { dateLabel } from "@/lib/formatters";

type DateFiltersProps = {
  startDate: string;
  endDate: string;
  appliedRange: DateRange;
  loading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: (event: React.FormEvent) => void;
  onPreset: (days: number) => void;
};

export function DateFilters(props: DateFiltersProps) {
  return (
    <form className="filter-bar" onSubmit={props.onApply}>
      <div className="date-control">
        <label htmlFor="start-date">From</label>
        <input
          id="start-date"
          type="date"
          value={props.startDate}
          onChange={(event) => props.onStartDateChange(event.target.value)}
        />
      </div>

      <div className="date-control">
        <label htmlFor="end-date">To</label>
        <input
          id="end-date"
          type="date"
          value={props.endDate}
          onChange={(event) => props.onEndDateChange(event.target.value)}
        />
      </div>

      <button className="apply-button" type="submit" disabled={props.loading}>
        {props.loading ? "Loading…" : "Apply filters"}
      </button>

      <div className="presets" aria-label="Quick date ranges">
        <span>Quick range</span>
        {[7, 30, 90].map((days) => (
          <button type="button" key={days} onClick={() => props.onPreset(days)}>
            {days}D
          </button>
        ))}
      </div>

      <div className="range-summary">
        {dateLabel(props.appliedRange.startDate)} —{" "}
        {dateLabel(props.appliedRange.endDate)}
      </div>
    </form>
  );
}
