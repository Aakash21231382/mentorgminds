import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminCourseOverviewApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';

// safe JSON parse for bullet points
const parseBullets = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); } catch { return []; }
};

// ── Settings Form ─────────────────────────────────────────────
const SettingsForm = ({ initial, onSaved }) => {
    const [form, setForm]     = useState({ headingNormal: '', headingOrange: '', mainDesc: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) setForm({
            headingNormal: initial.HeadingNormal || '',
            headingOrange: initial.HeadingOrange || '',
            mainDesc:      initial.MainDesc      || '',
        });
    }, [initial]);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminCourseOverviewApi.saveSettings(form);
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
                        placeholder="Agentic AI and Generative AI" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange text)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="Course Overview" />
                </div>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Main Description (intro paragraph)</label>
                <textarea className="mb-textarea" rows={4} value={form.mainDesc}
                    onChange={e => setForm(p => ({ ...p, mainDesc: e.target.value }))}
                    placeholder="Work is changing fast across engineering..." />
            </div>
            <div className="mb-form-actions">
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

// ── Section Form ──────────────────────────────────────────────
const SectionForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm] = useState({
        title: '', sectionType: 'text', paragraphs: '', subtitle: '', sortOrder: '0', isActive: true,
    });
    const [bullets, setBullets] = useState([]); // [{ label, desc }]
    const [saving, setSaving]   = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                title:       editData.Title       || '',
                sectionType: editData.SectionType || 'text',
                paragraphs:  editData.Paragraphs  || '',
                subtitle:    editData.Subtitle     || '',
                sortOrder:   String(editData.SortOrder ?? 0),
                isActive:    !!editData.IsActive,
            });
            setBullets(parseBullets(editData.BulletPoints));
        } else {
            setForm({ title: '', sectionType: 'text', paragraphs: '', subtitle: '', sortOrder: '0', isActive: true });
            setBullets([]);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        // sectionType change pe bullets reset
        if (name === 'sectionType' && value === 'text') setBullets([]);
        if (name === 'sectionType' && value === 'bullets' && bullets.length === 0)
            setBullets([{ label: '', desc: '' }]);
    };

    const addBullet    = () => setBullets(p => [...p, { label: '', desc: '' }]);
    const removeBullet = (i) => setBullets(p => p.filter((_, idx) => idx !== i));
    const handleBullet = (i, field, val) =>
        setBullets(p => p.map((b, idx) => idx === i ? { ...b, [field]: val } : b));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title required hai');
        if (form.sectionType === 'text' && !form.paragraphs.trim())
            return toast.error('Text section mein kam se kam ek paragraph chahiye');
        if (form.sectionType === 'bullets' && bullets.length === 0)
            return toast.error('Bullet section mein kam se kam ek item chahiye');
        setSaving(true);
        try {
            const payload = {
                title:        form.title,
                sectionType:  form.sectionType,
                paragraphs:   form.sectionType === 'text'    ? form.paragraphs : null,
                subtitle:     form.sectionType === 'bullets' ? form.subtitle   : null,
                bulletPoints: form.sectionType === 'bullets' ? JSON.stringify(bullets) : null,
                sortOrder:    parseInt(form.sortOrder) || 0,
                isActive:     form.isActive,
            };
            const res = editData
                ? await adminCourseOverviewApi.updateSection(editData.Id, payload)
                : await adminCourseOverviewApi.addSection(payload);
            if (res?.success || res?.data?.success) {
                toast.success(editData ? 'Section updated!' : 'Section added!'); onSaved();
            } else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Section</> : <><FaPlus /> Add New Section</>}</h3>

            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Section Title *</label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle}
                        placeholder="e.g. What is Generative AI?" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>

            {/* Section Type */}
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Section Type</label>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    {[{ val: 'text', label: '📝 Text Paragraphs' }, { val: 'bullets', label: '🔘 Bullet List (label + desc)' }].map(opt => (
                        <label key={opt.val} style={{
                            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                            padding: '8px 18px', borderRadius: 10, fontSize: 14,
                            border: form.sectionType === opt.val ? '2px solid #F07500' : '2px solid #e2e8f0',
                            background: form.sectionType === opt.val ? '#FFF1E6' : '#fff',
                            fontWeight: form.sectionType === opt.val ? 700 : 400,
                            color: form.sectionType === opt.val ? '#F07500' : '#555',
                        }}>
                            <input type="radio" name="sectionType" value={opt.val}
                                checked={form.sectionType === opt.val} onChange={handle}
                                style={{ display: 'none' }} />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* TEXT: paragraphs */}
            {form.sectionType === 'text' && (
                <div style={{ marginBottom: 14 }}>
                    <label className="mb-label">Paragraphs (ek blank line = ek naaya paragraph)</label>
                    <textarea className="mb-textarea" name="paragraphs" value={form.paragraphs}
                        onChange={handle} rows={6}
                        placeholder={"Generative AI refers to artificial intelligence systems that create new content...\n\nSome of the most widely used generative AI models today include..."} />
                    <p className="mb-hint">Paragraphs alag karne ke liye ek blank line chhodo (Enter x2)</p>
                </div>
            )}

            {/* BULLETS: subtitle + label/desc pairs */}
            {form.sectionType === 'bullets' && (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <label className="mb-label">Subtitle (optional intro line before bullets)</label>
                        <input className="mb-input" name="subtitle" value={form.subtitle} onChange={handle}
                            placeholder="Generative AI is not just limited to any single domain..." />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <label className="mb-label" style={{ margin: 0 }}>Bullet Points</label>
                            <button type="button" className="mb-btn-primary"
                                style={{ padding: '6px 14px', fontSize: 13 }} onClick={addBullet}>
                                <FaPlus /> Add Point
                            </button>
                        </div>
                        {bullets.length === 0 && <p className="mb-hint">Koi point nahi. "Add Point" click karo.</p>}
                        {bullets.map((b, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start',
                                background: '#f8f8f8', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
                                <div style={{ flex: '1 1 160px' }}>
                                    <label className="mb-label" style={{ fontSize: 11 }}>Label (bold)</label>
                                    <input className="mb-input" value={b.label} placeholder="e.g. Software Engineering"
                                        onChange={e => handleBullet(i, 'label', e.target.value)} />
                                </div>
                                <div style={{ flex: '3 1 300px' }}>
                                    <label className="mb-label" style={{ fontSize: 11 }}>Description</label>
                                    <input className="mb-input" value={b.desc} placeholder="It supports coding, reviews code..."
                                        onChange={e => handleBullet(i, 'desc', e.target.value)} />
                                </div>
                                <button type="button" className="mb-btn-delete"
                                    style={{ padding: '8px 10px', marginTop: 22 }} onClick={() => removeBullet(i)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="mb-checkbox-row">
                <input type="checkbox" id="coActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="coActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update Section' : 'Add Section'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const ManageCourseOverview = () => {
    const [settings,    setSettings]    = useState(null);
    const [sections,    setSections]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [showForm,    setShowForm]    = useState(false);
    const [editSection, setEditSection] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, cRes] = await Promise.all([
                adminCourseOverviewApi.getSettings(),
                adminCourseOverviewApi.getSections(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setSections(cRes?.sections || cRes?.data?.sections || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminCourseOverviewApi.toggleSection(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this section?')) return;
        try { await adminCourseOverviewApi.deleteSection(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading course overview..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage Course Overview</h2>
                        <p className="mb-subtitle">Section heading, main description aur content blocks manage karo.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* Sections */}
            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Content Sections ({sections.length})</h3>
                    {!showForm && !editSection && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Section
                        </button>
                    )}
                </div>

                {(showForm || editSection) && (
                    <SectionForm
                        editData={editSection}
                        onSaved={() => { setShowForm(false); setEditSection(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditSection(null); }}
                    />
                )}

                {sections.length === 0 ? (
                    <p className="mb-empty">No sections yet. Add one above!</p>
                ) : (
                    <div className="mb-list">
                        {sections.map((sec) => {
                            const bullets = parseBullets(sec.BulletPoints);
                            const paras   = sec.Paragraphs
                                ? sec.Paragraphs.split(/\n\n+/).filter(p => p.trim())
                                : [];
                            return (
                                <div key={sec.Id} className={`mb-item ${sec.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                                        background: sec.SectionType === 'bullets' ? '#EEF8FF' : '#FFF1E6',
                                        border: `1.5px solid ${sec.SectionType === 'bullets' ? '#BEE3F8' : '#FAD5C5'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 18,
                                    }}>
                                        {sec.SectionType === 'bullets' ? '🔘' : '📝'}
                                    </div>
                                    <div className="mb-content" style={{ flex: 1 }}>
                                        <p className="mb-item-title">{sec.Title}</p>
                                        <p className="mb-item-meta">
                                            <span style={{
                                                background: sec.SectionType === 'bullets' ? '#EEF8FF' : '#FFF1E6',
                                                color: sec.SectionType === 'bullets' ? '#3182CE' : '#F07500',
                                                padding: '1px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                                            }}>
                                                {sec.SectionType === 'bullets' ? 'Bullet List' : 'Text Paragraphs'}
                                            </span>
                                            {sec.SectionType === 'text'    && <> &nbsp;|&nbsp; {paras.length} paragraph{paras.length !== 1 ? 's' : ''}</>}
                                            {sec.SectionType === 'bullets' && <> &nbsp;|&nbsp; {bullets.length} point{bullets.length !== 1 ? 's' : ''}</>}
                                            &nbsp;|&nbsp; Sort: {sec.SortOrder}
                                        </p>
                                        {/* Preview */}
                                        {sec.SectionType === 'text' && paras[0] && (
                                            <p style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                                                {paras[0].slice(0, 90)}{paras[0].length > 90 ? '...' : ''}
                                            </p>
                                        )}
                                        {sec.SectionType === 'bullets' && bullets.slice(0, 2).map((b, i) => (
                                            <p key={i} style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                                • <strong>{b.label}</strong>{b.desc ? `: ${b.desc.slice(0, 60)}${b.desc.length > 60 ? '...' : ''}` : ''}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="mb-item-actions">
                                        <span className={sec.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                                            {sec.IsActive ? 'Active' : 'Hidden'}
                                        </span>
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(sec.Id)}>
                                            {sec.IsActive
                                                ? <FaToggleOn  style={{ color: '#48bb78' }} />
                                                : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => {
                                            setEditSection(sec); setShowForm(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(sec.Id)}>
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

export default ManageCourseOverview;
