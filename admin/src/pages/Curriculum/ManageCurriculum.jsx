import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminCurriculumApi } from '../../api/adminApi';
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

const COLOR_OPTIONS = [
    { value: 'white', label: ' White',      bg: '#ffffff' },
    { value: 'peach', label: ' Peach',      bg: '#FFF5EE' },
    { value: 'blue',  label: ' Light Blue', bg: '#EEF8FF' },
];

// ── Settings Form (header + brochure) ────────────────────────
const SettingsForm = ({ initial, onSaved }) => {
    const [form, setForm]       = useState({ headingLine1: '', headingLine2: '', brochureUrl: '' });
    const [pdfFile, setPdfFile] = useState(null);
    const [saving, setSaving]   = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initial) setForm({
            headingLine1: initial.HeadingLine1 || '',
            headingLine2: initial.HeadingLine2 || '',
            brochureUrl:  initial.BrochureUrl  || '',
        });
    }, [initial]);

    const handlePdf = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadToCDN(file);
            setForm(p => ({ ...p, brochureUrl: url }));
            setPdfFile(file.name);
            toast.success('PDF uploaded!');
        } catch { toast.error('PDF upload failed'); }
        finally { setUploading(false); }
    };

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminCurriculumApi.saveSettings(form);
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
                    <label className="mb-label">Heading Line 1</label>
                    <input className="mb-input" value={form.headingLine1}
                        onChange={e => setForm(p => ({ ...p, headingLine1: e.target.value }))}
                        placeholder="Agentic AI & Generative" />
                </div>
                <div>
                    <label className="mb-label">Heading Line 2 (orange color)</label>
                    <input className="mb-input" value={form.headingLine2}
                        onChange={e => setForm(p => ({ ...p, headingLine2: e.target.value }))}
                        placeholder="AI Course Curriculum" />
                </div>
            </div>

            {/* Brochure PDF */}
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label"><FaFilePdf style={{ color: '#e53e3e', marginRight: 6 }} />Brochure PDF (Download Syllabus button)</label>
                <input className="mb-input" type="file" accept=".pdf,application/pdf" onChange={handlePdf} disabled={uploading} />
                {uploading && <p className="mb-hint">Uploading PDF...</p>}
                {form.brochureUrl && (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <a href={form.brochureUrl} target="_blank" rel="noreferrer"
                            style={{ color: '#F07500', fontWeight: 600, fontSize: 13 }}>
                            📄 View Current Brochure
                        </a>
                        <button type="button" onClick={() => { setForm(p => ({ ...p, brochureUrl: '' })); setPdfFile(null); }}
                            style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            ✕ Remove
                        </button>
                    </div>
                )}
                {pdfFile && <p className="mb-hint" style={{ color: '#48bb78' }}>✓ {pdfFile} uploaded</p>}
                <p className="mb-hint">Agar koi PDF nahi dala toh "Download Syllabus" button hide ho jaayega</p>
            </div>

            <div className="mb-form-actions">
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

// ── Card Form ─────────────────────────────────────────────────
const CardForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]   = useState({ title: '', points: '', cardColor: 'white', sortOrder: '0', isActive: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(editData ? {
            title:     editData.Title     || '',
            points:    editData.Points    || '',
            cardColor: editData.CardColor || 'white',
            sortOrder: String(editData.SortOrder ?? 0),
            isActive:  !!editData.IsActive,
        } : { title: '', points: '', cardColor: 'white', sortOrder: '0', isActive: true });
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        if (!form.points.trim()) return toast.error('At least one point is required');
        setSaving(true);
        try {
            const payload = { title: form.title, points: form.points, cardColor: form.cardColor, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive };
            const res = editData
                ? await adminCurriculumApi.updateCard(editData.Id, payload)
                : await adminCurriculumApi.addCard(payload);
            if (res?.success || res?.data?.success) { toast.success(editData ? 'Card updated!' : 'Card added!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Card</> : <><FaPlus /> Add New Card</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Card Title *</label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle} placeholder="e.g. Foundations of AI" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Points (ek line = ek point)</label>
                <textarea className="mb-textarea" name="points" value={form.points} onChange={handle} rows={5}
                    placeholder={"Builds a strong foundation in AI.\nExplains how AI systems learn from data.\nCovers different AI approaches.\nHelps learners gain confidence."} />
                <p className="mb-hint">Har point ek nayi line mein — Enter dabao new point ke liye</p>
            </div>
            {/* Color selector */}
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Card Background Color</label>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                    {COLOR_OPTIONS.map(c => (
                        <label key={c.value} style={{
                            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                            padding: '8px 16px', borderRadius: 10, fontSize: 14,
                            border: form.cardColor === c.value ? '2px solid #F07500' : '2px solid #e2e8f0',
                            background: c.bg, fontWeight: form.cardColor === c.value ? 700 : 400,
                        }}>
                            <input type="radio" name="cardColor" value={c.value}
                                checked={form.cardColor === c.value} onChange={handle}
                                style={{ display: 'none' }} />
                            {c.label}
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id="cardActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="cardActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update Card' : 'Add Card'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const ManageCurriculum = () => {
    const [settings,  setSettings]  = useState(null);
    const [cards,     setCards]     = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showForm,  setShowForm]  = useState(false);
    const [editCard,  setEditCard]  = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, cRes] = await Promise.all([
                adminCurriculumApi.getSettings(),
                adminCurriculumApi.getCards(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setCards(cRes?.cards || cRes?.data?.cards || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminCurriculumApi.toggleCard(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this card?')) return;
        try { await adminCurriculumApi.deleteCard(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    const COLOR_BG = { white: '#ffffff', peach: '#FFF5EE', blue: '#EEF8FF' };
    const COLOR_LABEL = { white: '⬜ White', peach: '🍑 Peach', blue: '🔵 Blue' };

    if (loading) return <PageLoader message="Loading curriculum..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings Card */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage Curriculum</h2>
                        <p className="mb-subtitle">Header text, brochure PDF aur cards manage karo.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* Cards Card */}
            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Cards ({cards.length})</h3>
                    {!showForm && !editCard && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Card
                        </button>
                    )}
                </div>

                {(showForm || editCard) && (
                    <CardForm
                        editData={editCard}
                        onSaved={() => { setShowForm(false); setEditCard(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditCard(null); }}
                    />
                )}

                {cards.length === 0 ? (
                    <p className="mb-empty">No cards yet. Add one above!</p>
                ) : (
                    <div className="mb-list">
                        {cards.map((card, idx) => {
                            const pts = card.Points ? card.Points.split('\n').filter(p => p.trim()) : [];
                            return (
                                <div key={card.Id} className={`mb-item ${card.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: COLOR_BG[card.CardColor] || '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#555' }}>
                                        #{idx + 1}
                                    </div>
                                    <div className="mb-content" style={{ flex: 1 }}>
                                        <p className="mb-item-title">{card.Title}</p>
                                        <p className="mb-item-meta">{COLOR_LABEL[card.CardColor]} &nbsp;|&nbsp; {pts.length} points &nbsp;|&nbsp; Sort: {card.SortOrder}</p>
                                        <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 12, color: '#666' }}>
                                            {pts.slice(0, 2).map((p, i) => <li key={i}>{p}</li>)}
                                            {pts.length > 2 && <li style={{ color: '#aaa' }}>+{pts.length - 2} more...</li>}
                                        </ul>
                                    </div>
                                    <div className="mb-item-actions">
                                        <span className={card.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>{card.IsActive ? 'Active' : 'Hidden'}</span>
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(card.Id)}>
                                            {card.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => { setEditCard(card); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(card.Id)}>
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

export default ManageCurriculum;
