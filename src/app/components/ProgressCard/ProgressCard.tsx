import "./ProgressCard.css";

interface ProgressCardProps {
  bought: number;
  total: number;
  message?: string;
}

export default function ProgressCard({
  bought,
  total,
  message = "A little closer to a stocked kitchen.",
}: ProgressCardProps) {
  const percent = total === 0 ? 0 : Math.round((bought / total) * 100);

  return (
    <div className="progress-card">
      <div className="progress-card-row">
        <span>
          {bought} of {total} bought
        </span>
        <span className="progress-card-percent">{percent}%</span>
      </div>
      <div
        className="progress-card-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Items bought"
      >
        <div className="progress-card-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-card-message">{message}</p>
    </div>
  );
}
