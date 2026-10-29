import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminSkillsComparisonApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';

// ── Settings Form ─────────────────────────────────────────────
const SettingsForm = ({ initial, onSaved }) => {
    const [form, setForm]     = useState({ headingNormal: '', headingOrange: '' });
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
            const res = await adminSkillsComparisonApi.saveSettings(form);
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
                        placeholder="Skills You'll Acquire" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange text)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="IIITB vs IITKGP" />
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

// ── Card Form ─────────────────────────────────────────────────
const CardForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]     = useState({ cardTitle: '', cardSubtitle: '', skills: '', sortOrder: '0', isActive: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(editData ? {
            cardTitle:    editData.CardTitle    || '',
            cardSubtitle: editData.CardSubtitle || '',
            skills:       editData.Skills       || '',
            sortOrder:    String(editData.SortOrder ?? 0),
            isActive:     !!editData.IsActive,
        } : { cardTitle: '', cardSubtitle: '', skills: '', sortOrder: '0', isActive: true });
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.cardTitle.trim()) return toast.error('Card Title required hai');
        if (!form.skills.trim())    return toast.error('Kam se kam ek skill add karo');
        setSaving(true);
        try {
            const payload = {
                cardTitle:    form.cardTitle,
                cardSubtitle: form.cardSubtitle || null,
                skills:       form.skills,
                sortOrder:    parseInt(form.sortOrder) || 0,
                isActive:     form.isActive,
            };
            const res = editData
                ? await adminSkillsComparisonApi.updateCard(editData.Id, payload)
                : await adminSkillsComparisonApi.addCard(payload);
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
                <div>
                    <label className="mb-label">Card Title * (e.g. "IIT KGP")</label>
                    <input className="mb-input" name="cardTitle" value={form.cardTitle} onChange={handle}
                        placeholder="IIT KGP" required />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label className="mb-label">Card Subtitle</label>
                <input className="mb-input" name="cardSubtitle" value={form.cardSubtitle} onChange={handle}
                    placeholder="Skills you will learn in IIT KGP's Gen AI & Agentic AI Course" />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label className="mb-label">Skills (ek line = ek skill)</label>
                <textarea className="mb-textarea" name="skills" value={form.skills} onChange={handle} rows={8}
                    placeholder={"LLM fundamentals & transformers\nAdvanced Prompting & RAG\nLLM fine-tuning with LoRA\nAgentic AI system design"} />
                <p className="mb-hint">Har skill ek nayi line mein — Enter dabao next skill ke liye</p>
            </div>
            <div className="mb-checkbox-row">
                <input type="checkbox" id="scActive" name="isActive" checked={form.isActive} onChange={handle} />
                <label htmlFor="scActive" className="mb-label-inline">Active (visible on website)</label>
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
const ManageSkillsComparison = () => {
    const [settings, setSettings] = useState(null);
    const [cards,    setCards]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editCard, setEditCard] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, cRes] = await Promise.all([
                adminSkillsComparisonApi.getSettings(),
                adminSkillsComparisonApi.getCards(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setCards(cRes?.cards || cRes?.data?.cards || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminSkillsComparisonApi.toggleCard(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this card?')) return;
        try { await adminSkillsComparisonApi.deleteCard(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading skills comparison..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage Skills Comparison</h2>
                        <p className="mb-subtitle">Section heading aur skill cards manage karo. Jitne cards add karo utne columns dikhenge.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* Cards */}
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
                        {cards.map((card) => {
                            const skillList = card.Skills
                                ? card.Skills.split('\n').filter(s => s.trim())
                                : [];
                            return (
                                <div key={card.Id} className={`mb-item ${card.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    {/* Preview mini card */}
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                                        background: '#FFF1E6', border: '1.5px solid #FAD5C5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 800, color: '#F07500',
                                    }}>
                                        {card.SortOrder + 1}
                                    </div>
                                    <div className="mb-content" style={{ flex: 1 }}>
                                        <p className="mb-item-title" style={{ color: '#F07500' }}>{card.CardTitle}</p>
                                        {card.CardSubtitle && (
                                            <p className="mb-item-meta">{card.CardSubtitle}</p>
                                        )}
                                        <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 12, color: '#666' }}>
                                            {skillList.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                                            {skillList.length > 3 && (
                                                <li style={{ color: '#aaa' }}>+{skillList.length - 3} more skills...</li>
                                            )}
                                        </ul>
                                        <p className="mb-item-meta" style={{ marginTop: 4 }}>
                                            {skillList.length} skills &nbsp;|&nbsp; Sort: {card.SortOrder}
                                        </p>
                                    </div>
                                    <div className="mb-item-actions">
                                        <span className={card.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                                            {card.IsActive ? 'Active' : 'Hidden'}
                                        </span>
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(card.Id)}>
                                            {card.IsActive
                                                ? <FaToggleOn  style={{ color: '#48bb78' }} />
                                                : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => {
                                            setEditCard(card); setShowForm(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}>
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

export default ManageSkillsComparison;
