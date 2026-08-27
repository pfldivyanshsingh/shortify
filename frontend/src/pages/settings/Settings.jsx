import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Trash2, Save, LogIn, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const isGuest = !user;

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/profile', profile);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.post('/auth/change-password', passwords);
      toast.success('Password changed! Please login again.');
      await logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await api.delete('/profile', { data: { password: deletePassword } });
      toast.success('Account deleted.');
      await logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (isGuest) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your account and preferences</p>
          </div>
        </div>

        <div className="settings-sections">
          <div className="glass-card settings-section settings-guest-notice">
            <div className="settings-guest-icon">
              <Sparkles size={40} />
            </div>
            <h2>You're in Guest Mode</h2>
            <p>
              You're currently using Shortify as a guest. Your links and analytics are saved to your browser session.
              Create a free account to unlock profile settings, password management, and to keep your links permanently across devices.
            </p>
            <div className="settings-guest-actions">
              <Link to="/register" className="btn btn-primary">
                <Sparkles size={16} />
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <LogIn size={16} />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-sections">
        {/* Profile Section */}
        <div className="glass-card settings-section">
          <div className="settings-section-header">
            <User size={20} />
            <h2>Profile Information</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="settings-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input-field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" className="input-field" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              <Save size={16} />
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="glass-card settings-section">
          <div className="settings-section-header">
            <Lock size={20} />
            <h2>Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <div className="input-group">
              <label>Current Password</label>
              <input type="password" className="input-field" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" className="input-field" placeholder="Min. 8 characters" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingPassword}>
              <Lock size={16} />
              {savingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="glass-card settings-section settings-danger">
          <div className="settings-section-header">
            <Trash2 size={20} />
            <h2>Danger Zone</h2>
          </div>
          <p className="settings-danger-text">
            Once you delete your account, there is no going back. All your links and data will be permanently deleted.
          </p>
          {!showDeleteConfirm ? (
            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={16} />
              Delete Account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="settings-form">
              <div className="input-group">
                <label>Enter your password to confirm</label>
                <input type="password" className="input-field" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-danger" disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
