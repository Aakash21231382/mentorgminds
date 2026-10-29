import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave, FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminAchieveGoalsApi } from '../../api/adminApi';
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
    const [form, setForm]     = useState({ headingNormal: '', headingOrange: '', subHeading: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) setForm({
            headingNormal: initial.HeadingNormal || '',
            headingOrange: initial.HeadingOrange || '',
            subHeading:    initial.SubHeading    || '',
        });
    }, [initial]);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminAchieveGoalsApi.saveSettings(form);
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
                        placeholder="Services to Help You" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange text)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="Achieve Your Goal" />
                </div>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Sub Heading (description below heading)</label>
                <textarea className="mb-textarea" rows={2} value={form.subHeading}
                    onChange={e => setForm(p => ({ ...p, subHeading: e.target.value }))}
                    placeholder="Access the various career development support services..." />
            </div>
            <div className="mb-form-actions">
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

// ── Tab Form ──────────────────────────────────────────────────
const TabForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm] = useState({
        tabLabel: '', infoTag: '', infoSubtitle: '', cardHeading: '',
        cardDesc: '', imageUrl: '', videoUrl: '', points: '', sortOrder: '0', isActive: true,
    });
    const [preview,   setPreview]   = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving,    setSaving]    = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                tabLabel:     editData.TabLabel     || '',
                infoTag:      editData.InfoTag      || '',
                infoSubtitle: editData.InfoSubtitle || '',
                cardHeading:  editData.CardHeading  || '',
                cardDesc:     editData.CardDesc     || '',
                imageUrl:     editData.ImageUrl     || '',
                videoUrl:     editData.VideoUrl     || '',
                points:       editData.Points       || '',
                sortOrder:    String(editData.SortOrder ?? 0),
                isActive:     !!editData.IsActive,
            });
            setPreview(editData.ImageUrl || null);
        } else {
            setForm({ tabLabel: '', infoTag: '', infoSubtitle: '', cardHeading: '', cardDesc: '', imageUrl: '', videoUrl: '', points: '', sortOrder: '0', isActive: true });
            setPreview(null);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            const url = await uploadToCDN(file);
            setForm(p => ({ ...p, imageUrl: url }));
            toast.success('Image uploaded!');
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.tabLabel.trim()) return toast.error('Tab Label required hai');
        setSaving(true);
        try {
            const payload = {
                tabLabel:     form.tabLabel,
                infoTag:      form.infoTag      || null,
                infoSubtitle: form.infoSubtitle || null,
                cardHeading:  form.cardHeading  || null,
                cardDesc:     form.cardDesc     || null,
                imageUrl:     form.imageUrl     || null,
                videoUrl:     form.videoUrl     || null,
                points:       form.points       || null,
                sortOrder:    parseInt(form.sortOrder) || 0,
                isActive:     form.isActive,
            };
            const res = editData
                ? await adminAchieveGoalsApi.updateTab(editData.Id, payload)
                : await adminAchieveGoalsApi.addTab(payload);
            if (res?.success || res?.data?.success) {
                toast.success(editData ? 'Tab updated!' : 'Tab added!'); onSaved();
            } else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Tab</> : <><FaPlus /> Add New Tab</>}</h3>

            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Tab Button Label * (e.g. "Industry Mentors")</label>
                    <input className="mb-input" name="tabLabel" value={form.tabLabel} onChange={handle}
                        placeholder="Industry Mentors" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>

            {/* Right side info */}
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Info Tag (orange text, e.g. "IIT KGP")</label>
                    <input className="mb-input" name="infoTag" value={form.infoTag} onChange={handle} placeholder="IIT KGP" />
                </div>
                <div>
                    <label className="mb-label">Info Subtitle (bold heading)</label>
                    <input className="mb-input" name="infoSubtitle" value={form.infoSubtitle} onChange={handle} placeholder="Industry Mentors" />
                </div>
            </div>

            {/* Image card overlay text */}
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Card Heading (image overlay h3)</label>
                    <input className="mb-input" name="cardHeading" value={form.cardHeading} onChange={handle} placeholder="Hear from our Alumni" />
                </div>
                <div>
                    <label className="mb-label">Card Description (image overlay p)</label>
                    <input className="mb-input" name="cardDesc" value={form.cardDesc} onChange={handle} placeholder="Discover how AI Engineering..." />
                </div>
            </div>

            {/* Background Image */}
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label"><FaImage style={{ marginRight: 6 }} />Background Image (card left side)</label>
                <input className="mb-input" type="file" accept="image/*" onChange={handleImage} disabled={uploading} />
                {uploading && <p className="mb-hint">Uploading...</p>}
                {preview && (
                    <img src={preview} alt="preview"
                        style={{ height: 80, marginTop: 8, objectFit: 'cover', borderRadius: 10,
                            border: '1px solid #e2e8f0', width: '100%', maxWidth: 200 }} />
                )}
                {form.imageUrl && (
                    <p className="mb-hint" style={{ marginTop: 4 }}>
                        <a href={form.imageUrl} target="_blank" rel="noreferrer" style={{ color: '#F07500' }}>View current image</a>
                    </p>
                )}
            </div>

            {/* Video URL */}
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">
                    ▶️ Video URL (optional — Play button tab hi dikhega jab URL dala ho)
                </label>
                <input
                    className="mb-input"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handle}
                    placeholder="https://www.youtube.com/watch?v=... ya koi bhi video link"
                />
                <p className="mb-hint">
                    YouTube, Vimeo ya koi bhi direct video link. Blank chhodo toh Play button hide ho jaayega.
                </p>
            </div>

            {/* Points */}
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Bullet Points (ek line = ek point)</label>
                <textarea className="mb-textarea" name="points" value={form.points} onChange={handle} rows={5}
                    placeholder={"1-on-1 monthly mentoring sessions with top AI engineers.\nGet career guidance, portfolio reviews, and interview preparation tips.\nDirect code reviews from experts."} />
                <p className="mb-hint">Har point ek nayi line mein — Enter dabao next point ke liye</p>
            </div>

            <div className="mb-checkbox-row">
                <input type="checkbox" id="agActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="agActive" className="mb-label-inline">Active (visible on website)</label>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving || uploading}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update Tab' : 'Add Tab'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const ManageAchieveGoals = () => {
    const [settings, setSettings] = useState(null);
    const [tabs,     setTabs]     = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editTab,  setEditTab]  = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, tRes] = await Promise.all([
                adminAchieveGoalsApi.getSettings(),
                adminAchieveGoalsApi.getTabs(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setTabs(tRes?.tabs || tRes?.data?.tabs || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminAchieveGoalsApi.toggleTab(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tab?')) return;
        try { await adminAchieveGoalsApi.deleteTab(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading achieve goals..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage Achieve Goals Section</h2>
                        <p className="mb-subtitle">Section heading, description aur service tabs manage karo.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* Tabs */}
            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">Service Tabs ({tabs.length})</h3>
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
                        {tabs.map((tab) => {
                            const pointList = tab.Points
                                ? tab.Points.split('\n').filter(p => p.trim())
                                : [];
                            return (
                                <div key={tab.Id} className={`mb-item ${tab.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    {/* Image preview */}
                                    <div style={{ width: 56, height: 44, borderRadius: 8, flexShrink: 0, overflow: 'hidden', background: '#f5f5f5', border: '1px solid #e2e8f0' }}>
                                        {tab.ImageUrl
                                            ? <img src={tab.ImageUrl} alt={tab.TabLabel}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 20 }}>🖼️</span>
                                        }
                                    </div>
                                    <div className="mb-content" style={{ flex: 1 }}>
                                        <p className="mb-item-title">{tab.TabLabel}</p>
                                        <p className="mb-item-meta">
                                            {tab.InfoTag && <><span style={{ color: '#F07500', fontWeight: 700 }}>{tab.InfoTag}</span> — </>}
                                            {tab.InfoSubtitle}
                                            {tab.CardHeading && <> &nbsp;|&nbsp; 📷 {tab.CardHeading}</>}
                                        </p>
                                        {pointList.length > 0 && (
                                            <p className="mb-item-meta" style={{ marginTop: 3 }}>
                                                {pointList.length} points &nbsp;|&nbsp; Sort: {tab.SortOrder}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-item-actions">
                                        <span className={tab.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                                            {tab.IsActive ? 'Active' : 'Hidden'}
                                        </span>
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(tab.Id)}>
                                            {tab.IsActive
                                                ? <FaToggleOn  style={{ color: '#48bb78' }} />
                                                : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => {
                                            setEditTab(tab); setShowForm(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(tab.Id)}>
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

export default ManageAchieveGoals;
