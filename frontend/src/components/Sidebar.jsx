import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  Settings,
  LogIn,
  LogOut,
  Zap,
  PlusCircle,
  User,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/links', label: 'All Links', icon: Link2 },
  { path: '/links/new', label: 'Create Link', icon: PlusCircle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isGuest = !user;

  const handleLogout = async () => {
    await logout();
    // Stay on current page — no redirect to login
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap size={24} className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">Shortify</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isGuest ? (
          /* Guest Mode — show login/register prompt */
          <div className="sidebar-guest">
            <div className="sidebar-user">
              <div className="sidebar-avatar sidebar-avatar-guest">
                <User size={18} />
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">Guest Session</span>
                <span className="sidebar-user-email">No account needed</span>
              </div>
            </div>
            <NavLink to="/login" className="sidebar-login-btn" title="Sign In">
              <LogIn size={18} />
            </NavLink>
          </div>
        ) : (
          /* Logged-in user */
          <div className="sidebar-guest">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || 'User'}</span>
                <span className="sidebar-user-email">{user?.email || ''}</span>
              </div>
            </div>
            <button className="sidebar-logout" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
