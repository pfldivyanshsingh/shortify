import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Calendar, Lock, Type, Zap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './CreateLink.css';

const CreateLink = () => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    expiresAt: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { originalUrl: formData.originalUrl };
      if (formData.customAlias) payload.customAlias = formData.customAlias;
      if (formData.title) payload.title = formData.title;
      if (formData.expiresAt) payload.expiresAt = new Date(formData.expiresAt).toISOString();
      if (formData.password) payload.password = formData.password;

      const { data } = await api.post('/urls', payload);
      setCreatedUrl(data.data);
      toast.success('Link created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  if (createdUrl) {
    return (
      <div className="page-container animate-fade-in">
        <div className="create-success glass-card">
          <div className="create-success-icon">
            <Zap size={32} />
          </div>
          <h2>Link Created!</h2>
          <p className="create-success-url">{createdUrl.shortUrl}</p>

          <div className="create-success-actions">
            <button className="btn btn-primary" onClick={() => handleCopy(createdUrl.shortUrl)}>
              Copy Short URL
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/links')}>
              View All Links
            </button>
            <button className="btn btn-ghost" onClick={() => { setCreatedUrl(null); setFormData({ originalUrl: '', customAlias: '', title: '', expiresAt: '', password: '' }); }}>
              Create Another
            </button>
          </div>

          {createdUrl.qrCode && (
            <div className="create-success-qr">
              <img src={createdUrl.qrCode} alt="QR Code" />
              <a
                href={createdUrl.qrCode}
                download={`qr-${createdUrl.shortCode}.png`}
                className="btn btn-ghost btn-sm"
              >
                Download QR Code
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Create New Link</h1>
          <p>Shorten a URL and customize it</p>
        </div>
      </div>

      <div className="create-form-container glass-card">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="input-group">
            <label htmlFor="originalUrl">
              <Link2 size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Destination URL *
            </label>
            <input
              id="originalUrl"
              name="originalUrl"
              type="url"
              className="input-field"
              placeholder="https://example.com/very-long-url"
              value={formData.originalUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-form-row">
            <div className="input-group">
              <label htmlFor="customAlias">
                <Type size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Custom Alias
              </label>
              <input
                id="customAlias"
                name="customAlias"
                type="text"
                className="input-field"
                placeholder="my-custom-alias"
                value={formData.customAlias}
                onChange={handleChange}
              />
              <span className="input-hint">Leave empty for auto-generated code</span>
            </div>

            <div className="input-group">
              <label htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="input-field"
                placeholder="My Link Title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="create-form-row">
            <div className="input-group">
              <label htmlFor="expiresAt">
                <Calendar size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Expiration Date
              </label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                className="input-field"
                value={formData.expiresAt}
                onChange={handleChange}
              />
              <span className="input-hint">Leave empty for no expiration</span>
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <Lock size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Password Protection
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                placeholder="Optional password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="input-hint">Visitors will need this password to access</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Creating...' : 'Shorten URL'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLink;
