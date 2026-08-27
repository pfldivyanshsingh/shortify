import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle, Search, Trash2, ExternalLink, BarChart3,
  Copy, QrCode, ChevronLeft, ChevronRight, MoreHorizontal,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Links.css';

const Links = () => {
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sortBy, sortOrder };
      if (search) params.search = search;
      if (status) params.status = status;
      const { data } = await api.get('/urls', { params });
      setUrls(data.data.urls);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder, status]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      fetchUrls();
    }, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.delete(`/urls/${id}`);
      toast.success('Link deleted');
      fetchUrls();
    } catch {
      toast.error('Failed to delete link');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} links?`)) return;
    try {
      await api.post('/urls/bulk-delete', { ids: selected });
      toast.success('Links deleted');
      setSelected([]);
      fetchUrls();
    } catch {
      toast.error('Failed to delete links');
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === urls.length) {
      setSelected([]);
    } else {
      setSelected(urls.map((u) => u.id));
    }
  };

  const getStatusBadge = (url) => {
    if (!url.isActive) return <span className="badge badge-error">Inactive</span>;
    if (url.expiresAt && new Date(url.expiresAt) < new Date())
      return <span className="badge badge-warning">Expired</span>;
    return <span className="badge badge-success">Active</span>;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>All Links</h1>
          <p>Manage and track your shortened URLs</p>
        </div>
        <Link to="/links/new" className="btn btn-primary">
          <PlusCircle size={16} />
          Create Link
        </Link>
      </div>

      <div className="links-toolbar glass-card">
        <div className="links-search">
          <Search size={16} className="links-search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="links-filters">
          <select
            className="input-field links-select"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>

          <select
            className="input-field links-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
              setPage(1);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="clickCount-desc">Most Clicks</option>
            <option value="clickCount-asc">Least Clicks</option>
          </select>

          {selected.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
              <Trash2 size={14} />
              Delete ({selected.length})
            </button>
          )}
        </div>
      </div>

      <div className="links-table-wrapper glass-card">
        {loading ? (
          <div style={{ padding: 20 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8, borderRadius: 8 }} />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="links-empty">
            <Link2 size={48} className="links-empty-icon" />
            <h3>No links yet</h3>
            <p>Create your first shortened link to get started</p>
            <Link to="/links/new" className="btn btn-primary" style={{ marginTop: 16 }}>
              <PlusCircle size={16} />
              Create Link
            </Link>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selected.length === urls.length && urls.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Link</th>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(url.id)}
                        onChange={() => toggleSelect(url.id)}
                      />
                    </td>
                    <td>
                      <div className="link-cell">
                        <span className="link-title">{url.title || url.originalUrl}</span>
                        <span className="link-url">{url.originalUrl.substring(0, 50)}{url.originalUrl.length > 50 ? '...' : ''}</span>
                      </div>
                    </td>
                    <td>
                      <div className="short-url-cell">
                        <span className="short-url-text">{url.shortUrl}</span>
                        {url.isPasswordProtected && <span className="badge badge-warning" style={{ marginLeft: 6, fontSize: '0.65rem' }}>🔒</span>}
                      </div>
                    </td>
                    <td>
                      <span className="click-count">{url.clickCount}</span>
                    </td>
                    <td>{getStatusBadge(url)}</td>
                    <td className="date-cell">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleCopy(url.shortUrl)} title="Copy">
                          <Copy size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/analytics/${url.id}`)} title="Analytics">
                          <BarChart3 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/links/${url.id}/edit`)} title="Edit">
                          <MoreHorizontal size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(url.id)} title="Delete" style={{ color: 'var(--error)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div className="links-pagination">
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} links)
                </span>
                <div className="pagination-buttons">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={!pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Links;
