import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MousePointerClick, Link2, TrendingUp, Globe, PlusCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '../../components/StatsCard';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setStats(data.data);
      } catch {
        // Silently fail — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      </div>
    );
  }

  const chartData = stats?.clicksOverTime || [];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your link performance</p>
        </div>
        <Link to="/links/new" className="btn btn-primary">
          <PlusCircle size={16} />
          Create Link
        </Link>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Clicks"
          value={stats?.totalClicks || 0}
          icon={MousePointerClick}
          color="primary"
        />
        <StatsCard
          title="Total Links"
          value={stats?.totalLinks || 0}
          icon={Link2}
          color="info"
        />
        <StatsCard
          title="Today's Clicks"
          value={stats?.todayClicks || 0}
          icon={TrendingUp}
          color="success"
        />
        <StatsCard
          title="This Month"
          value={stats?.monthlyClicks || 0}
          icon={Globe}
          color="warning"
        />
      </div>

      <div className="dashboard-chart glass-card">
        <h3 className="chart-title">Clicks Over Time</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b6b82', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fill: '#6b6b82', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a24',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: '#f1f1f6',
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#clicksGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats?.topCountries?.length > 0 && (
        <div className="dashboard-grid">
          <div className="glass-card dashboard-list-card">
            <h3 className="chart-title">Top Countries</h3>
            <div className="dashboard-list">
              {stats.topCountries.slice(0, 5).map((item, i) => (
                <div key={i} className="dashboard-list-item">
                  <span className="dashboard-list-name">{item.name || 'Unknown'}</span>
                  <span className="dashboard-list-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card dashboard-list-card">
            <h3 className="chart-title">Top Browsers</h3>
            <div className="dashboard-list">
              {(stats.topBrowsers || []).slice(0, 5).map((item, i) => (
                <div key={i} className="dashboard-list-item">
                  <span className="dashboard-list-name">{item.name || 'Unknown'}</span>
                  <span className="dashboard-list-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
