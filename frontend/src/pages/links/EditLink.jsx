import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './CreateLink.css';

const EditLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    expiresAt: '',
    password: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const { data } = await api.get(`/urls/${id}`);
        const url = data.data;
        setFormData({
          originalUrl: url.originalUrl,
          customAlias: url.customAlias || '',
          title: url.title || '',
          expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
          password: '',
          isActive: url.isActive,
        });
      } catch {
        toast.error('Failed to load link');
        navigate('/links');
      } finally {
        setLoading(false);
      }
    };
    fetchUrl();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      if (formData.originalUrl) payload.originalUrl = formData.originalUrl;
      if (formData.customAlias) payload.customAlias = formData.customAlias;
      if (formData.title !== undefined) payload.title = formData.title;
      if (formData.expiresAt) payload.expiresAt = new Date(formData.expiresAt).toISOString();
      else payload.expiresAt = null;
      if (formData.password) payload.password = formData.password;
      payload.isActive = formData.isActive;

      await api.put(`/urls/${id}`, payload);
      toast.success('Link updated!');
      navigate('/links');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/links')} style={{ marginBottom: 8 }}>
            <ArrowLeft size={16} /> Back to Links
          </button>
          <h1>Edit Link</h1>
        </div>
      </div>

      <div className="create-form-container glass-card">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="input-group">
            <label>Destination URL</label>
            <input name="originalUrl" type="url" className="input-field" value={formData.originalUrl} onChange={handleChange} required />
          </div>

          <div className="create-form-row">
            <div className="input-group">
              <label>Custom Alias</label>
              <input name="customAlias" type="text" className="input-field" value={formData.customAlias} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Title</label>
              <input name="title" type="text" className="input-field" value={formData.title} onChange={handleChange} />
            </div>
          </div>

          <div className="create-form-row">
            <div className="input-group">
              <label>Expiration Date</label>
              <input name="expiresAt" type="datetime-local" className="input-field" value={formData.expiresAt} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>New Password (leave empty to keep current)</label>
              <input name="password" type="password" className="input-field" placeholder="New password" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
            <label htmlFor="isActive" style={{ marginBottom: 0 }}>Active</label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLink;
