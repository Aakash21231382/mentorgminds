import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave, FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminCourseProjectsApi } from '../../api/adminApi';
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
    const [form, setForm]   = useState({ headingLine1: '', headingLine2: '', headingLine3: '', badgeText: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) setForm({
            headingLine1: initial.HeadingLine1 || '',
            headingLine2: initial.HeadingLine2 || '',
            headingLine3: initial.HeadingLine3 || '',
            badgeText:    initial.BadgeText    || '',
        });
    }, [initial]);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminCourseProjectsApi.saveSettings(form);
            if (res?.success || res?.data?.success) { toast.success('Settings saved!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const h = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <form onSubmit={submit}>
            <h3 className="mb-form-title">⚙️ Section Settings</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Heading Line 1 (normal)</label>
                    <input className="mb-input" value={form.headingLine1} onChange={h('headingLine1')} placeholder="Gen AI & Agentic AI Course" />
                </div>
                <div>
                    <label className="mb-label">Heading Line 2 (orange)</label>
                    <input className="mb-input" value={form.headingLine2} onChange={h('headingLine2')} placeholder="Projects Learn" />
                </div>
                <div>
                    <label className="mb-label">Heading Line 2 ke baad ka text (normal)</label>
                    <input className="mb-input" value={form.headingLine3} onChange={h('headingLine3')} placeholder="by Doing" />
                </div>
                <div>
                    <label className="mb-label">Badge Count (e.g. "10+")</label>
                    <input className="mb-input" value={form.badgeText} onChange={h('badgeText')} placeholder="10+" />
                    <p className="mb-hint">Agar blank chhodo toh real count auto-calculate hoga</p>
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

// ── Project Form ──────────────────────────────────────────────
const ProjectForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]       = useState({ title: '', description: '', iconUrl: '', skills: '', sortOrder: '0', isActive: true });
    const [iconFile, setIconFile] = useState(null);
    const [preview, setPreview]   = useState(null);
    const [saving, setSaving]     = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setForm(editData ? {
            title:       editData.Title       || '',
            description: editData.Description || '',
            iconUrl:     editData.IconUrl      || '',
            skills:      editData.Skills       || '',
            sortOrder:   String(editData.SortOrder ?? 0),
            isActive:    !!editData.IsActive,
        } : { title: '', description: '', iconUrl: '', skills: '', sortOrder: '0', isActive: true });
        setPreview(editData?.IconUrl || null);
        setIconFile(null);
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleIcon = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIconFile(file.name);
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
        if (!form.title.trim()) return toast.error('Title required');
        setSaving(true);
        try {
            const payload = { ...form, sortOrder: parseInt(form.sortOrder) || 0 };
            const res = editData
                ? await adminCourseProjectsApi.updateProject(editData.Id, payload)
                : await adminCourseProjectsApi.addProject(payload);
            if (res?.success || res?.data?.success) { toast.success(editData ? 'Updated!' : 'Added!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Project</> : <><FaPlus /> Add Project</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Project Title *</label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle} placeholder="e.g. Create ShopAssist AI" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label">Description</label>
                <textarea className="mb-textarea" name="description" value={form.description} onChange={handle} rows={2}
                    placeholder="A conversational chatbot that provides shopping recommendations..." />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label">Skills (comma separated)</label>
                <input className="mb-input" name="skills" value={form.skills} onChange={handle}
                    placeholder="ChatGPT,GPT 3.5/4,OpenAI API,Flask" />
                <p className="mb-hint">Skills ko comma se alag karo: ChatGPT,Flask,Python</p>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label"><FaImage style={{ marginRight: 6 }} />Project Icon / Image</label>
                <input className="mb-input" type="file" accept="image/*" onChange={handleIcon} disabled={uploading} />
                {uploading && <p className="mb-hint">Uploading...</p>}
                {preview && <img src={preview} alt="preview" className="mb-img-preview" style={{ maxHeight: 60, marginTop: 8, borderRadius: 8 }} />}
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id="projActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="projActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving || uploading}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update' : 'Add Project'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main ──────────────────────────────────────────────────────
const ManageCourseProjects = () => {
    const [settings,  setSettings]  = useState(null);
    const [projects,  setProjects]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showForm,  setShowForm]  = useState(false);
    const [editProj,  setEditProj]  = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                adminCourseProjectsApi.getSettings(),
                adminCourseProjectsApi.getProjects(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setProjects(pRes?.projects || pRes?.data?.projects || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminCourseProjectsApi.toggleProject(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try { await adminCourseProjectsApi.deleteProject(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading projects..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage Course Projects</h2>
                        <p className="mb-subtitle">Section heading, badge count aur projects manage karo.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Projects ({projects.length})</h3>
                    {!showForm && !editProj && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Project
                        </button>
                    )}
                </div>

                {(showForm || editProj) && (
                    <ProjectForm
                        editData={editProj}
                        onSaved={() => { setShowForm(false); setEditProj(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditProj(null); }}
                    />
                )}

                {projects.length === 0 ? (
                    <p className="mb-empty">No projects yet. Add one above!</p>
                ) : (
                    <div className="mb-list">
                        {projects.map((proj, idx) => {
                            const skills = proj.Skills ? proj.Skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                            return (
                                <div key={proj.Id} className={`mb-item ${proj.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    <div className="mb-thumb">
                                        {proj.IconUrl
                                            ? <img src={proj.IconUrl} alt={proj.Title} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                                            : <span className="mb-thumb-noimg">No Icon</span>}
                                    </div>
                                    <div className="mb-content" style={{ flex: 1 }}>
                                        <p className="mb-item-title">{proj.Title}</p>
                                        {proj.Description && <p className="mb-item-meta" style={{ fontSize: 12 }}>{proj.Description.slice(0, 80)}...</p>}
                                        <p className="mb-item-meta">{skills.length} skills | Sort: {proj.SortOrder}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                            {skills.slice(0, 4).map((s, i) => (
                                                <span key={i} style={{ background: '#fff7ee', border: '1px solid #FAD5C5', borderRadius: 20, padding: '2px 8px', fontSize: 11, color: '#333' }}>{s}</span>
                                            ))}
                                            {skills.length > 4 && <span style={{ fontSize: 11, color: '#aaa' }}>+{skills.length - 4} more</span>}
                                        </div>
                                    </div>
                                    <div className="mb-item-actions">
                                        <span className={proj.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>{proj.IsActive ? 'Active' : 'Hidden'}</span>
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(proj.Id)}>
                                            {proj.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => { setEditProj(proj); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(proj.Id)}>
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourseProjects;
