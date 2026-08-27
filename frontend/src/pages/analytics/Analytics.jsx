import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MousePointerClick, TrendingUp, Globe, Monitor,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import StatsCard from '../../components/StatsCard';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Analytics.css';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#14b8a6'];

const Analytics = () => {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [urlInfo, setUrlInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, urlRes] = await Promise.all([
          api.get(`/analytics/${urlId}`),
          api.get(`/urls/${urlId}`),
        ]);
        setData(analyticsRes.data.data);
        setUrlInfo(urlRes.data.data);
      } catch {
        toast.error('Failed to load analytics');
        navigate('/links');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [urlId, navigate]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/links')} style={{ marginBottom: 8 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1>Link Analytics</h1>
          {urlInfo && <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{urlInfo.shortUrl}</p>}
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Clicks" value={data?.totalClicks || 0} icon={MousePointerClick} color="primary" />
        <StatsCard title="Today" value={data?.todayClicks || 0} icon={TrendingUp} color="success" />
        <StatsCard title="This Week" value={data?.weeklyClicks || 0} icon={Globe} color="info" />
        <StatsCard title="This Month" value={data?.monthlyClicks || 0} icon={Monitor} color="warning" />
      </div>

      <div className="analytics-charts-grid">
        <div className="glass-card analytics-chart-card analytics-chart-wide">
          <h3>Clicks Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data?.clicksOverTime || []}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#6b6b82', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#6b6b82', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f1f6', fontSize: 13 }} />
              <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card analytics-chart-card">
          <h3>Top Countries</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={(data?.topCountries || []).slice(0, 6)} layout="vertical">
              <XAxis type="number" tick={{ fill: '#6b6b82', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#a0a0b8', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f1f6' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card analytics-chart-card">
          <h3>Browsers</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data?.topBrowsers || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {(data?.topBrowsers || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f1f6' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card analytics-chart-card">
          <h3>Devices</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data?.topDevices || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {(data?.topDevices || []).map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f1f6' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card analytics-chart-card">
          <h3>Operating Systems</h3>
          <div className="analytics-list">
            {(data?.topOs || []).slice(0, 6).map((item, i) => (
              <div key={i} className="analytics-list-item">
                <span>{item.name}</span>
                <span className="analytics-list-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card analytics-chart-card">
          <h3>Top Referrers</h3>
          <div className="analytics-list">
            {(data?.topReferrers || []).length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: 16 }}>No referrer data yet</p>
            ) : (
              (data?.topReferrers || []).slice(0, 6).map((item, i) => (
                <div key={i} className="analytics-list-item">
                  <span style={{ wordBreak: 'break-all' }}>{item.name}</span>
                  <span className="analytics-list-count">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {data?.recentClicks?.length > 0 && (
        <div className="glass-card" style={{ padding: 24, marginTop: 16 }}>
          <h3 style={{ marginBottom: 16 }}>Recent Visitors</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Country</th>
                  <th>Browser</th>
                  <th>Device</th>
                  <th>OS</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {data.recentClicks.slice(0, 10).map((click, i) => (
                  <tr key={i}>
                    <td>{new Date(click.timestamp).toLocaleString()}</td>
                    <td>{click.country || '—'}</td>
                    <td>{click.browser || '—'}</td>
                    <td>{click.device || '—'}</td>
                    <td>{click.os || '—'}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{click.referrer || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
