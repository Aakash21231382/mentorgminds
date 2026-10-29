import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave, FaImage, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminCourseInstructorsApi } from '../../api/adminApi';
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

const BG_OPTIONS = [
    { value: 'card-bg-1', label: '💜 Lavender', color: '#F4F5FF' },
    { value: 'card-bg-2', label: '🔵 Blue',     color: '#EAF7FF' },
    { value: 'card-bg-3', label: '💚 Green',    color: '#EFFFEE' },
    { value: 'card-bg-4', label: '🍑 Cream',    color: '#FFFAED' },
];

// ── Settings Form ─────────────────────────────────────────────
const SettingsForm = ({ initial, onSaved }) => {
    const [form, setForm] = useState({ headingNormal: '', headingOrange: '', subtitle: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) setForm({
            headingNormal: initial.HeadingNormal || '',
            headingOrange: initial.HeadingOrange || '',
            subtitle:      initial.Subtitle      || '',
        });
    }, [initial]);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminCourseInstructorsApi.saveSettings(form);
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
                    <label className="mb-label">Heading (normal)</label>
                    <input className="mb-input" value={form.headingNormal}
                        onChange={e => setForm(p => ({ ...p, headingNormal: e.target.value }))}
                        placeholder="Course" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="Instructors" />
                </div>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Subtitle</label>
                <input className="mb-input" value={form.subtitle}
                    onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                    placeholder="Guidance from world-class researchers and industry veterans" />
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
const CardForm = ({ tabId, editData, onSaved, onCancel }) => {
    const [form, setForm]       = useState({ name: '', role: '', linkedinUrl: '', cardBg: 'card-bg-1', sortOrder: '0', isActive: true });
    const [preview, setPreview]   = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        setForm(editData ? {
            name:        editData.Name        || '',
            role:        editData.Role        || '',
            linkedinUrl: editData.LinkedinUrl || '',
            cardBg:      editData.CardBg      || 'card-bg-1',
            sortOrder:   String(editData.SortOrder ?? 0),
            isActive:    !!editData.IsActive,
        } : { name: '', role: '', linkedinUrl: '', cardBg: 'card-bg-1', sortOrder: '0', isActive: true });
        setPreview(editData?.Photo || null);
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            const url = await uploadToCDN(file);
            setForm(p => ({ ...p, photo: url }));
            toast.success('Photo uploaded!');
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Name required');
        setSaving(true);
        try {
            const payload = { ...form, photo: form.photo || (editData?.Photo || null), sortOrder: parseInt(form.sortOrder) || 0 };
            const res = editData
                ? await adminCourseInstructorsApi.updateCard(editData.Id, payload)
                : await adminCourseInstructorsApi.addCard(tabId, payload);
            if (res?.success || res?.data?.success) { toast.success(editData ? 'Updated!' : 'Added!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const selectedBg = BG_OPTIONS.find(b => b.value === form.cardBg);

    return (
        <form onSubmit={submit} style={{ background: '#f9f9f9', borderRadius: 10, padding: '14px 16px', marginBottom: 12, border: '1px dashed #e0e0e0' }}>
            <h4 className="mb-form-title" style={{ fontSize: 14, marginBottom: 12 }}>
                {editData ? <><FaEdit /> Edit Card</> : <><FaPlus /> Add Card</>}
            </h4>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Name *</label>
                    <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="Dr. Sarah Chen" required />
                </div>
                <div>
                    <label className="mb-label">Role</label>
                    <input className="mb-input" name="role" value={form.role} onChange={handle} placeholder="Head of AI Research @ Google AI" />
                </div>
                <div>
                    <label className="mb-label">LinkedIn URL</label>
                    <input className="mb-input" name="linkedinUrl" value={form.linkedinUrl} onChange={handle} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            {/* Photo */}
            <div style={{ marginBottom: 10 }}>
                <label className="mb-label"><FaImage style={{ marginRight: 5 }} />Photo</label>
                <input className="mb-input" type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} />
                {uploading && <p className="mb-hint">Uploading...</p>}
                {preview && <img src={preview} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', marginTop: 8, border: '2px solid #e2e8f0' }} />}
            </div>
            {/* Card BG */}
            <div style={{ marginBottom: 10 }}>
                <label className="mb-label">Card Background</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    {BG_OPTIONS.map(b => (
                        <label key={b.value} style={{
                            padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                            background: b.color, border: form.cardBg === b.value ? '2px solid #F07500' : '2px solid #e2e8f0',
                            fontWeight: form.cardBg === b.value ? 700 : 400,
                        }}>
                            <input type="radio" name="cardBg" value={b.value} checked={form.cardBg === b.value} onChange={handle} style={{ display: 'none' }} />
                            {b.label}
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id={`ca-${editData?.Id || 'new'}`} name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor={`ca-${editData?.Id || 'new'}`} className="mb-label-inline">Active</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 10 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving || uploading}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update' : 'Add Card'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Tab Row (expandable) ──────────────────────────────────────
const TabRow = ({ tab, onEditTab, onDeleteTab, onToggleTab, onRefresh }) => {
    const [expanded,     setExpanded]     = useState(false);
    const [cards,        setCards]        = useState(tab.cards || []);
    const [showCardForm, setShowCardForm] = useState(false);
    const [editCard,     setEditCard]     = useState(null);

    useEffect(() => { setCards(tab.cards || []); }, [tab]);

    const fetchCards = async () => {
        try {
            const res = await adminCourseInstructorsApi.getCards(tab.Id);
            setCards(res?.cards || res?.data?.cards || []);
        } catch {}
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('Delete this card?')) return;
        try {
            await adminCourseInstructorsApi.deleteCard(cardId);
            toast.success('Card deleted');
            fetchCards(); onRefresh();
        } catch { toast.error('Delete failed'); }
    };

    const handleToggleCard = async (cardId) => {
        try { await adminCourseInstructorsApi.toggleCard(cardId); fetchCards(); }
        catch { toast.error('Toggle failed'); }
    };

    return (
        <div className={`mb-item ${tab.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}
            style={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>

            {/* Tab header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
                <div className="mb-content" style={{ flex: 1 }}>
                    <p className="mb-item-title">{tab.TabName}</p>
                    <p className="mb-item-meta">{cards.length} cards | Sort: {tab.SortOrder}</p>
                </div>
                <div className="mb-item-actions">
                    <button className="mb-btn-toggle" onClick={() => onToggleTab(tab.Id)}>
                        {tab.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                    </button>
                    <button className="mb-btn-edit" onClick={() => onEditTab(tab)}><FaEdit /> Edit</button>
                    <button className="mb-btn-delete" onClick={() => onDeleteTab(tab.Id)}><FaTrash /> Delete</button>
                    <button className="mb-btn-edit" style={{ background: '#ebf4ff', color: '#2b6cb0' }}
                        onClick={() => { setExpanded(p => !p); if (!expanded) fetchCards(); }}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />} Cards
                    </button>
                </div>
            </div>

            {/* Cards panel */}
            {expanded && (
                <div style={{ borderTop: '1px solid #f0f0f0', padding: '14px 16px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>Cards in "{tab.TabName}"</span>
                        <button className="mb-btn-primary" onClick={() => { setShowCardForm(true); setEditCard(null); }}>
                            <FaPlus /> Add Card
                        </button>
                    </div>

                    {(showCardForm || editCard) && (
                        <CardForm
                            tabId={tab.Id}
                            editData={editCard}
                            onSaved={() => { setShowCardForm(false); setEditCard(null); fetchCards(); onRefresh(); }}
                            onCancel={() => { setShowCardForm(false); setEditCard(null); }}
                        />
                    )}

                    {cards.length === 0 ? (
                        <p className="mb-empty" style={{ margin: 0 }}>No cards yet.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                            {cards.map(card => {
                                const bg = BG_OPTIONS.find(b => b.value === card.CardBg);
                                return (
                                    <div key={card.Id} style={{
                                        background: bg?.color || '#fff', borderRadius: 12,
                                        padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0',
                                        opacity: card.IsActive ? 1 : 0.5,
                                    }}>
                                        {card.Photo
                                            ? <img src={card.Photo} alt={card.Name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginBottom: 6, border: '2px solid #fff' }} />
                                            : <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>}
                                        <p style={{ fontWeight: 700, fontSize: 12, margin: '0 0 2px' }}>{card.Name}</p>
                                        <p style={{ fontSize: 11, color: '#888', margin: '0 0 8px' }}>{card.Role}</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                                            <button className="mb-btn-toggle" onClick={() => handleToggleCard(card.Id)}>
                                                {card.IsActive ? <FaToggleOn style={{ color: '#48bb78', fontSize: 16 }} /> : <FaToggleOff style={{ color: '#cbd5e0', fontSize: 16 }} />}
                                            </button>
                                            <button className="mb-btn-edit" style={{ padding: '3px 8px', fontSize: 11 }}
                                                onClick={() => { setEditCard(card); setShowCardForm(false); }}>
                                                <FaEdit />
                                            </button>
                                            <button className="mb-btn-delete" style={{ padding: '3px 8px', fontSize: 11 }}
                                                onClick={() => handleDeleteCard(card.Id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Tab Form ──────────────────────────────────────────────────
const TabForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]   = useState({ tabName: '', sortOrder: '0', isActive: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(editData ? {
            tabName:   editData.TabName   || '',
            sortOrder: String(editData.SortOrder ?? 0),
            isActive:  !!editData.IsActive,
        } : { tabName: '', sortOrder: '0', isActive: true });
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.tabName.trim()) return toast.error('Tab name required');
        setSaving(true);
        try {
            const payload = { tabName: form.tabName, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive };
            const res = editData
                ? await adminCourseInstructorsApi.updateTab(editData.Id, payload)
                : await adminCourseInstructorsApi.addTab(payload);
            if (res?.success || res?.data?.success) { toast.success(editData ? 'Tab updated!' : 'Tab added!'); onSaved(); }
            else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Tab</> : <><FaPlus /> Add New Tab</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Tab Name *</label>
                    <input className="mb-input" name="tabName" value={form.tabName} onChange={handle} placeholder="e.g. Instructors, Industry Experts" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id="tabActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="tabActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update Tab' : 'Add Tab'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main ──────────────────────────────────────────────────────
const ManageCourseInstructors = () => {
    const [settings, setSettings] = useState(null);
    const [tabs,     setTabs]     = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editTab,  setEditTab]  = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, dRes] = await Promise.all([
                adminCourseInstructorsApi.getSettings(),
                adminCourseInstructorsApi.getData(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setTabs(dRes?.tabs || dRes?.data?.tabs || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggleTab = async (id) => {
        try { await adminCourseInstructorsApi.toggleTab(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDeleteTab = async (id) => {
        if (!window.confirm('Delete this tab and ALL its cards?')) return;
        try { await adminCourseInstructorsApi.deleteTab(id); toast.success('Tab deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading instructors..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage Course Instructors</h2>
                        <p className="mb-subtitle">Tabs (categories) banao jaise "Instructors", "Industry Experts". Har tab mein cards add karo.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Tabs / Categories ({tabs.length})</h3>
                    {!showForm && !editTab && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Tab
                        </button>
                    )}
                </div>

                {(showForm || editTab) && (
                    <TabForm
                        editData={editTab}
                        onSaved={() => { setShowForm(false); setEditTab(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditTab(null); }}
                    />
                )}

                {tabs.length === 0 ? (
                    <p className="mb-empty">No tabs yet. Add one above!</p>
                ) : (
                    <div className="mb-list">
                        {tabs.map(tab => (
                            <TabRow
                                key={tab.Id}
                                tab={tab}
                                onEditTab={(t) => { setEditTab(t); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                onDeleteTab={handleDeleteTab}
                                onToggleTab={handleToggleTab}
                                onRefresh={fetchAll}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourseInstructors;
