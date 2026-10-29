import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave, FaImage, FaTools } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminToolsTechApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';

const CDN_URL = 'https://host0008-001-site1.qtempurl.com/api/uploadfile';
const uploadToCDN = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post(CDN_URL, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    const d = res.data;
    let url = null;
    if (Array.isArray(d?.result))           url = d.result[0]?.variants?.[0] || d.result[0]?.url;
    else if (d?.result?.variants)           url = Array.isArray(d.result.variants) ? d.result.variants[0] : d.result.variants;
    else if (d?.url)                        url = d.url;
    else if (typeof d?.result === 'string') url = d.result;
    if (!url) throw new Error('CDN returned no URL');
    return url;
};

// ── Settings Form ─────────────────────────────────────────────
const SettingsForm = ({ initial, onSaved }) => {
    const [form, setForm]   = useState({ headingNormal: '', headingOrange: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) setForm({
            headingNormal: initial.HeadingNormal || '',
            headingOrange: initial.HeadingOrange || '',
        });
    }, [initial]);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminToolsTechApi.saveSettings(form);
            if (res?.success || res?.data?.success) { toast.success('Settings saved!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit}>
            <h3 className="mb-form-title">⚙️ Section Settings</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Heading (normal black text)</label>
                    <input className="mb-input" value={form.headingNormal}
                        onChange={e => setForm(p => ({ ...p, headingNormal: e.target.value }))}
                        placeholder="Tools & Technologies" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange text)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="You'll Learn" />
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

// ── Tool Form ─────────────────────────────────────────────────
const ToolForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]       = useState({ name: '', iconUrl: '', sortOrder: '0', isActive: true });
    const [preview, setPreview]   = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        setForm(editData ? {
            name:      editData.Name      || '',
            iconUrl:   editData.IconUrl   || '',
            sortOrder: String(editData.SortOrder ?? 0),
            isActive:  !!editData.IsActive,
        } : { name: '', iconUrl: '', sortOrder: '0', isActive: true });
        setPreview(editData?.IconUrl || null);
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleIcon = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            const url = await uploadToCDN(file);
            setForm(p => ({ ...p, iconUrl: url }));
            toast.success('Icon uploaded!');
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Name required');
        setSaving(true);
        try {
            const payload = { name: form.name, iconUrl: form.iconUrl || null, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive };
            const res = editData
                ? await adminToolsTechApi.updateTool(editData.Id, payload)
                : await adminToolsTechApi.addTool(payload);
            if (res?.success || res?.data?.success) { toast.success(editData ? 'Updated!' : 'Added!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Tool</> : <><FaPlus /> Add Tool</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Tool Name *</label>
                    <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Python" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label"><FaImage style={{ marginRight: 6 }} />Tool Icon</label>
                <input className="mb-input" type="file" accept="image/*" onChange={handleIcon} disabled={uploading} />
                {uploading && <p className="mb-hint">Uploading...</p>}
                {preview && (
                    <img src={preview} alt="preview"
                        style={{ maxHeight: 56, maxWidth: 56, marginTop: 8, objectFit: 'contain', borderRadius: 8, border: '1px solid #e2e8f0', padding: 4 }} />
                )}
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id="toolActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="toolActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving || uploading}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update Tool' : 'Add Tool'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main ──────────────────────────────────────────────────────
const ManageToolsTech = () => {
    const [settings, setSettings] = useState(null);
    const [tools,    setTools]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editTool, setEditTool] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, tRes] = await Promise.all([
                adminToolsTechApi.getSettings(),
                adminToolsTechApi.getTools(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setTools(tRes?.tools || tRes?.data?.tools || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminToolsTechApi.toggleTool(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tool?')) return;
        try { await adminToolsTechApi.deleteTool(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading tools..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title"><FaTools style={{ color: '#F07500', marginRight: 8 }} />Manage Tools & Technologies</h2>
                        <p className="mb-subtitle">Section heading aur tools manage karo. Jitne tools add karoge utne dikhenge.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* Tools */}
            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Tools ({tools.length})</h3>
                    {!showForm && !editTool && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Tool
                        </button>
                    )}
                </div>

                {(showForm || editTool) && (
                    <ToolForm
                        editData={editTool}
                        onSaved={() => { setShowForm(false); setEditTool(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditTool(null); }}
                    />
                )}

                {tools.length === 0 ? (
                    <p className="mb-empty">No tools yet. Add one above!</p>
                ) : (
                    /* Grid preview — same as frontend */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginTop: 8 }}>
                        {tools.map((tool) => (
                            <div key={tool.Id} style={{
                                background: tool.IsActive ? '#fff' : '#f9f9f9',
                                border: `1.5px solid ${tool.IsActive ? '#e2e8f0' : '#f0f0f0'}`,
                                borderRadius: 16, padding: '16px 12px', textAlign: 'center',
                                opacity: tool.IsActive ? 1 : 0.5, position: 'relative',
                            }}>
                                {/* Icon */}
                                <div style={{ width: 48, height: 48, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {tool.IconUrl
                                        ? <img src={tool.IconUrl} alt={tool.Name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        : <span style={{ fontSize: 28 }}>🔧</span>}
                                </div>
                                <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 10px', color: '#1a1a1a' }}>{tool.Name}</p>
                                {/* Actions */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                                    <button className="mb-btn-toggle" onClick={() => handleToggle(tool.Id)} title="Toggle">
                                        {tool.IsActive ? <FaToggleOn style={{ color: '#48bb78', fontSize: 18 }} /> : <FaToggleOff style={{ color: '#cbd5e0', fontSize: 18 }} />}
                                    </button>
                                    <button className="mb-btn-edit" style={{ padding: '4px 8px', fontSize: 12 }}
                                        onClick={() => { setEditTool(tool); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                        <FaEdit />
                                    </button>
                                    <button className="mb-btn-delete" style={{ padding: '4px 8px', fontSize: 12 }}
                                        onClick={() => handleDelete(tool.Id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageToolsTech;
