type LineChartProps = {
  primary: number[];
  secondary?: number[];
  labels?: string[];
  ariaLabel: string;
};

const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function chartPoints(values: number[], maximum: number) {
  return values
    .map((value, index) => {
      const x = 48 + index * (604 / Math.max(values.length - 1, 1));
      const y = 190 - (value / maximum) * 145;
      return `${x},${y}`;
    })
    .join(" ");
}

export function LineChart({
  primary,
  secondary = [],
  labels = defaultLabels,
  ariaLabel,
}: LineChartProps) {
  const maximum = Math.max(...primary, ...secondary, 1) * 1.12;
  const primaryPoints = chartPoints(primary, maximum);
  const secondaryPoints = secondary.length
    ? chartPoints(secondary, maximum)
    : undefined;

  return (
    <svg
      className="analytics-line-chart"
      viewBox="0 0 700 225"
      role="img"
      aria-label={ariaLabel}
    >
      {[45, 93, 141, 189].map((y) => (
        <line key={y} x1="48" x2="652" y1={y} y2={y} />
      ))}
      {secondaryPoints && (
        <polyline className="analytics-line-secondary" points={secondaryPoints} />
      )}
      <polyline className="analytics-line-primary" points={primaryPoints} />
      {primaryPoints.split(" ").map((point) => {
        const [cx, cy] = point.split(",");
        return <circle key={point} cx={cx} cy={cy} r="3.5" />;
      })}
      {labels.map((label, index) => (
        <text
          key={`${label}-${index}`}
          x={48 + index * (604 / Math.max(labels.length - 1, 1))}
          y="216"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

type DonutSegment = {
  label: string;
  value: number;
  detail: string;
  tone: "accent" | "gold" | "muted" | "line";
};

export function DonutChart({
  segments,
  total,
  label,
}: {
  segments: DonutSegment[];
  total: string;
  label: string;
}) {
  const circumference = 2 * Math.PI * 42;
  let cumulative = 0;

  return (
    <div className="analytics-donut-layout">
      <div className="analytics-donut">
        <svg viewBox="0 0 110 110" role="img" aria-label={label}>
          <circle className="analytics-donut-track" cx="55" cy="55" r="42" />
          {segments.map((segment) => {
            const length = (segment.value / 100) * circumference;
            const offset = (cumulative / 100) * circumference;
            cumulative += segment.value;
            return (
              <circle
                key={segment.label}
                className={`analytics-donut-segment ${segment.tone}`}
                cx="55"
                cy="55"
                r="42"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div>
          <strong>{total}</strong>
          <span>Total</span>
        </div>
      </div>
      <ul className="analytics-donut-legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <i className={segment.tone} aria-hidden="true" />
            <span>{segment.label}</span>
            <small>{segment.value}%</small>
            <strong>{segment.detail}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Heatmap({ title = "Busiest times of the day" }: { title?: string }) {
  const levels = Array.from({ length: 7 * 18 }, (_, index) => {
    const day = Math.floor(index / 18);
    const hour = index % 18;
    const lunch = Math.max(0, 4 - Math.abs(hour - 8));
    const dinner = Math.max(0, 4 - Math.abs(hour - 14));
    const weekendLift = day > 4 ? 1 : 0;
    return Math.min(4, Math.max(lunch, dinner) + weekendLift);
  });

  return (
    <div className="analytics-heatmap" role="img" aria-label={title}>
      <div className="analytics-heatmap-days">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="analytics-heatmap-grid">
        {levels.map((level, index) => (
          <i key={index} className={`level-${level}`} />
        ))}
      </div>
      <div className="analytics-heatmap-times">
        {["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"].map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({
  items,
}: {
  items: Array<{ label: string; value: number; detail: string }>;
}) {
  const maximum = Math.max(...items.map((item) => item.value), 1);
  return (
    <ol className="analytics-horizontal-bars">
      {items.map((item, index) => (
        <li key={item.label}>
          <span>{index + 1}</span>
          <strong>{item.label}</strong>
          <i><b style={{ width: `${(item.value / maximum) * 100}%` }} /></i>
          <small>{item.detail}</small>
        </li>
      ))}
    </ol>
  );
}

export function VerticalBars({
  values,
  labels = defaultLabels,
  ariaLabel,
}: {
  values: number[];
  labels?: string[];
  ariaLabel: string;
}) {
  const maximum = Math.max(...values, 1);
  return (
    <div className="analytics-vertical-bars" role="img" aria-label={ariaLabel}>
      {values.map((value, index) => (
        <div key={labels[index]}>
          <i><b style={{ height: `${(value / maximum) * 100}%` }} /></i>
          <span>{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
