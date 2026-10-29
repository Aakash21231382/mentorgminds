import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave, FaImage, FaLayerGroup } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminCurriculumComparisonApi } from '../../api/adminApi';
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

// ── parse tabs from JSON string ───────────────────────────────
const parseTabs = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); } catch { return []; }
};

// ── Settings Form ─────────────────────────────────────────────
const SettingsForm = ({ initial, onSaved }) => {
    const [form, setForm]   = useState({ headingNormal: '', headingOrange: '' });
    const [tabs, setTabs]   = useState([]); // [{ key, subTitle, mainTitle }]
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) {
            setForm({ headingNormal: initial.HeadingNormal || '', headingOrange: initial.HeadingOrange || '' });
            setTabs(parseTabs(initial.TabsJson));
        }
    }, [initial]);

    const handleTab = (i, field, val) =>
        setTabs(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

    const addTab = () => setTabs(prev => [...prev, { key: '', subTitle: '', mainTitle: '' }]);
    const removeTab = (i) => setTabs(prev => prev.filter((_, idx) => idx !== i));

    const submit = async (e) => {
        e.preventDefault();
        for (const t of tabs) {
            if (!t.key.trim()) return toast.error('Har tab ka key required hai (e.g. iitkgp)');
        }
        setSaving(true);
        try {
            const res = await adminCurriculumComparisonApi.saveSettings({ headingNormal: form.headingNormal, headingOrange: form.headingOrange, tabsJson: JSON.stringify(tabs) });
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
                        placeholder="Gen AI & Agentic AI Course" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange text)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="Curriculum Comparison" />
                </div>
            </div>

            {/* Tabs Manager */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label className="mb-label" style={{ margin: 0 }}>Toggle Tabs (Top Buttons on Frontend)</label>
                    <button type="button" className="mb-btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={addTab}>
                        <FaPlus /> Add Tab
                    </button>
                </div>
                {tabs.length === 0 && <p className="mb-hint">Koi tab nahi hai. "Add Tab" click karo.</p>}
                {tabs.map((tab, i) => (
                    <div key={i} style={{ background: '#f8f8f8', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div style={{ flex: '1 1 120px' }}>
                                <label className="mb-label" style={{ fontSize: 11 }}>Tab Key (unique, no spaces)</label>
                                <input className="mb-input" value={tab.key} placeholder="e.g. iitkgp"
                                    onChange={e => handleTab(i, 'key', e.target.value.replace(/\s/g, ''))} />
                            </div>
                            <div style={{ flex: '2 1 180px' }}>
                                <label className="mb-label" style={{ fontSize: 11 }}>Sub Title (small text)</label>
                                <input className="mb-input" value={tab.subTitle} placeholder="e.g. IIT KGP Curriculum"
                                    onChange={e => handleTab(i, 'subTitle', e.target.value)} />
                            </div>
                            <div style={{ flex: '2 1 200px' }}>
                                <label className="mb-label" style={{ fontSize: 11 }}>Main Title (bold text)</label>
                                <input className="mb-input" value={tab.mainTitle} placeholder="e.g. Gen AI & Agentic AI Course"
                                    onChange={e => handleTab(i, 'mainTitle', e.target.value)} />
                            </div>
                            <button type="button" className="mb-btn-delete" style={{ padding: '8px 12px' }} onClick={() => removeTab(i)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
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
const CardForm = ({ editData, tabs, onSaved, onCancel }) => {
    const [form, setForm] = useState({
        tabKey: '', part: 'A', partTitle: '', partBadge: '',
        title: '', descr: '', hours: '', projects: '', extra: '',
        iconUrl: '', sortOrder: '0', isActive: true,
    });
    const [preview, setPreview]     = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving]       = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                tabKey:    editData.TabKey    || (tabs[0]?.key || ''),
                part:      editData.Part      || 'A',
                partTitle: editData.PartTitle || '',
                partBadge: editData.PartBadge || '',
                title:     editData.Title     || '',
                descr:     editData.Descr     || '',
                hours:     editData.Hours     || '',
                projects:  editData.Projects  || '',
                extra:     editData.Extra     || '',
                iconUrl:   editData.IconUrl   || '',
                sortOrder: String(editData.SortOrder ?? 0),
                isActive:  !!editData.IsActive,
            });
            setPreview(editData.IconUrl || null);
        } else {
            setForm(p => ({ ...p, tabKey: tabs[0]?.key || '' }));
            setPreview(null);
        }
    }, [editData, tabs]);

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
        if (!form.tabKey.trim()) return toast.error('Tab Key required hai');
        if (!form.title.trim())  return toast.error('Title required hai');
        setSaving(true);
        try {
            const payload = {
                tabKey: form.tabKey, part: form.part,
                partTitle: form.partTitle || null, partBadge: form.partBadge || null,
                title: form.title, descr: form.descr || null,
                hours: form.hours || null, projects: form.projects || null, extra: form.extra || null,
                iconUrl: form.iconUrl || null,
                sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive,
            };
            const res = editData
                ? await adminCurriculumComparisonApi.updateCard(editData.Id, payload)
                : await adminCurriculumComparisonApi.addCard(payload);
            if (res?.success || res?.data?.success) {
                toast.success(editData ? 'Card updated!' : 'Card added!'); onSaved();
            } else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Card</> : <><FaPlus /> Add New Card</>}</h3>
            <div className="mb-grid-2">
                {/* Tab Key */}
                <div>
                    <label className="mb-label">Tab *</label>
                    <select className="mb-input" name="tabKey" value={form.tabKey} onChange={handle}>
                        {tabs.length === 0 && <option value="">— Pehle tab add karo —</option>}
                        {tabs.map(t => <option key={t.key} value={t.key}>{t.subTitle || t.key} — {t.mainTitle}</option>)}
                    </select>
                </div>
                {/* Part A / B */}
                <div>
                    <label className="mb-label">Part (A or B)</label>
                    <select className="mb-input" name="part" value={form.part} onChange={handle}>
                        <option value="A">Part A</option>
                        <option value="B">Part B</option>
                    </select>
                </div>
            </div>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Part Title (e.g. "Applied AI")</label>
                    <input className="mb-input" name="partTitle" value={form.partTitle} onChange={handle} placeholder="Applied AI" />
                </div>
                <div>
                    <label className="mb-label">Part Badge (e.g. "Foundational Focus")</label>
                    <input className="mb-input" name="partBadge" value={form.partBadge} onChange={handle} placeholder="Foundational Focus" />
                </div>
            </div>

            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Card Title *</label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle}
                        placeholder="Foundations of GenAI & LLMs" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label">Description</label>
                <textarea className="mb-textarea" name="descr" value={form.descr} onChange={handle} rows={2}
                    placeholder="Probability, Linear Algebra, and Calculus for AI engineers." />
            </div>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Hours (e.g. "128+ Hours")</label>
                    <input className="mb-input" name="hours" value={form.hours} onChange={handle} placeholder="128+ Hours" />
                </div>
                <div>
                    <label className="mb-label">Projects (e.g. "4 Projects")</label>
                    <input className="mb-input" name="projects" value={form.projects} onChange={handle} placeholder="4 Projects" />
                </div>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label">Extra Badge (optional, e.g. "Live Lab Access")</label>
                <input className="mb-input" name="extra" value={form.extra} onChange={handle} placeholder="Live Lab Access" />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label"><FaImage style={{ marginRight: 6 }} />Card Icon (image)</label>
                <input className="mb-input" type="file" accept="image/*" onChange={handleIcon} disabled={uploading} />
                {uploading && <p className="mb-hint">Uploading...</p>}
                {preview && (
                    <img src={preview} alt="preview"
                        style={{ maxHeight: 56, maxWidth: 56, marginTop: 8, objectFit: 'contain', borderRadius: 8, border: '1px solid #e2e8f0', padding: 4 }} />
                )}
                {form.iconUrl && !preview?.startsWith('blob') && (
                    <p className="mb-hint" style={{ marginTop: 4 }}>
                        Current: <a href={form.iconUrl} target="_blank" rel="noreferrer" style={{ color: '#F07500' }}>View Icon</a>
                    </p>
                )}
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id="ccActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="ccActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving || uploading}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update Card' : 'Add Card'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const ManageCurriculumComparison = () => {
    const [settings, setSettings] = useState(null);
    const [cards,    setCards]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editCard, setEditCard] = useState(null);
    const [activeTab, setActiveTab] = useState(null); // for filtering in list

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, cRes] = await Promise.all([
                adminCurriculumComparisonApi.getSettings(),
                adminCurriculumComparisonApi.getCards(),
            ]);
            const s = sRes?.settings || sRes?.data?.settings || null;
            const c = cRes?.cards    || cRes?.data?.cards    || [];
            setSettings(s);
            setCards(c);
            // Set default active tab to first tab in settings
            if (s && !activeTab) {
                const tabs = parseTabs(s.TabsJson);
                if (tabs.length > 0) setActiveTab(tabs[0].key);
            }
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []); // eslint-disable-line

    const handleToggle = async (id) => {
        try { await adminCurriculumComparisonApi.toggleCard(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this card?')) return;
        try { await adminCurriculumComparisonApi.deleteCard(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    const tabs = parseTabs(settings?.TabsJson);
    const filteredCards = activeTab ? cards.filter(c => c.TabKey === activeTab) : cards;
    const partACards = filteredCards.filter(c => c.Part === 'A');
    const partBCards = filteredCards.filter(c => c.Part === 'B');

    if (loading) return <PageLoader message="Loading curriculum comparison..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title"><FaLayerGroup style={{ color: '#F07500', marginRight: 8 }} />Manage Curriculum Comparison</h2>
                        <p className="mb-subtitle">Heading, toggle tabs aur cards — sab kuch yahan manage karo.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* Cards */}
            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Cards ({cards.length} total)</h3>
                    {!showForm && !editCard && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Card
                        </button>
                    )}
                </div>

                {(showForm || editCard) && (
                    <CardForm
                        editData={editCard}
                        tabs={tabs}
                        onSaved={() => { setShowForm(false); setEditCard(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditCard(null); }}
                    />
                )}

                {/* Tab filter */}
                {tabs.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                        {tabs.map(t => (
                            <button key={t.key} type="button"
                                onClick={() => setActiveTab(t.key)}
                                style={{
                                    padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    border: activeTab === t.key ? '2px solid #F07500' : '2px solid #e2e8f0',
                                    background: activeTab === t.key ? '#FFF1E6' : '#fff',
                                    color: activeTab === t.key ? '#F07500' : '#555',
                                }}>
                                {t.subTitle || t.key}
                            </button>
                        ))}
                        <button type="button"
                            onClick={() => setActiveTab(null)}
                            style={{
                                padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                border: activeTab === null ? '2px solid #F07500' : '2px solid #e2e8f0',
                                background: activeTab === null ? '#FFF1E6' : '#fff',
                                color: activeTab === null ? '#F07500' : '#555',
                            }}>
                            All Tabs
                        </button>
                    </div>
                )}

                {filteredCards.length === 0 ? (
                    <p className="mb-empty" style={{ marginTop: 16 }}>No cards found. Add one above!</p>
                ) : (
                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Part A */}
                        <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#F07500', marginBottom: 10 }}>
                                Part A — {partACards[0]?.PartTitle || '—'} ({partACards.length} cards)
                            </p>
                            {partACards.length === 0
                                ? <p className="mb-hint">No Part A cards for this tab.</p>
                                : <div className="mb-list">{partACards.map(card => <CardRow key={card.Id} card={card} onEdit={() => { setEditCard(card); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onToggle={() => handleToggle(card.Id)} onDelete={() => handleDelete(card.Id)} />)}</div>
                            }
                        </div>
                        {/* Part B */}
                        <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#6C63FF', marginBottom: 10 }}>
                                Part B — {partBCards[0]?.PartTitle || '—'} ({partBCards.length} cards)
                            </p>
                            {partBCards.length === 0
                                ? <p className="mb-hint">No Part B cards for this tab.</p>
                                : <div className="mb-list">{partBCards.map(card => <CardRow key={card.Id} card={card} onEdit={() => { setEditCard(card); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onToggle={() => handleToggle(card.Id)} onDelete={() => handleDelete(card.Id)} />)}</div>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Card Row ──────────────────────────────────────────────────
const CardRow = ({ card, onEdit, onToggle, onDelete }) => (
    <div className={`mb-item ${card.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
        <div style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, background: '#f5f5f5', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {card.IconUrl
                ? <img src={card.IconUrl} alt={card.Title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: 20 }}>📄</span>}
        </div>
        <div className="mb-content" style={{ flex: 1 }}>
            <p className="mb-item-title">{card.Title}</p>
            <p className="mb-item-meta">
                {card.PartBadge && <><span style={{ color: '#F07500' }}>{card.PartBadge}</span> &nbsp;|&nbsp;</>}
                Sort: {card.SortOrder}
                {card.Hours    && <> &nbsp;|&nbsp; ⏱ {card.Hours}</>}
                {card.Projects && <> &nbsp;|&nbsp; 📁 {card.Projects}</>}
                {card.Extra    && <> &nbsp;|&nbsp; 🖥 {card.Extra}</>}
            </p>
            {card.Descr && <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{card.Descr.slice(0, 80)}{card.Descr.length > 80 ? '...' : ''}</p>}
        </div>
        <div className="mb-item-actions">
            <span className={card.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>{card.IsActive ? 'Active' : 'Hidden'}</span>
            <button className="mb-btn-toggle" onClick={onToggle}>
                {card.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
            </button>
            <button className="mb-btn-edit" onClick={onEdit}><FaEdit /> Edit</button>
            <button className="mb-btn-delete" onClick={onDelete}><FaTrash /> Delete</button>
        </div>
    </div>
);

export default ManageCurriculumComparison;
