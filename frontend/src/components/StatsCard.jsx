import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (!trend) return <Minus size={14} />;
    return trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  const getTrendClass = () => {
    if (!trend) return 'trend-neutral';
    return trend === 'up' ? 'trend-up' : 'trend-down';
  };

  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <span className="stats-card-title">{title}</span>
        {Icon && (
          <div className="stats-card-icon">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stats-card-value">{value?.toLocaleString?.() ?? value}</div>
      {trendValue && (
        <div className={`stats-card-trend ${getTrendClass()}`}>
          {getTrendIcon()}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
