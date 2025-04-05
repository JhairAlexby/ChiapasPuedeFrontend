import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({ 
  value, 
  max, 
  label, 
  showPercentage = true 
}: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}  
        />
        {showPercentage && (
          <div className="progress-percentage">{percentage}%</div>
        )}
      </div>
    </div>
  );
};