"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  /** Unit shown in the caption, e.g. "Meals", "items". */
  unit?: string;
  /** Optional override for the count caption. */
  label?: string;
  className?: string;
}

/**
 * Visual progress indicator used on every request, e.g. "20 / 50 Meals Pledged".
 * Bar color shifts from blue → green as the goal is reached.
 */
export default function ProgressBar({
  value,
  max,
  unit = "items",
  label,
  className = "",
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const pct = Math.min(100, Math.round((value / safeMax) * 100));
  const complete = value >= max;

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600">
        <span>{label ?? `${value} / ${max} ${unit} pledged`}</span>
        <span className={complete ? "text-green-600" : "text-blue-600"}>
          {pct}%
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `${value} of ${max} ${unit} pledged`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            complete ? "bg-green-500" : "bg-blue-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
