import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminFaqApi } from '../../api/adminApi';
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
            const res = await adminFaqApi.saveSettings(form);
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
                        placeholder="Frequently" />
                </div>
                <div>
                    <label className="mb-label">Heading (orange text)</label>
                    <input className="mb-input" value={form.headingOrange}
                        onChange={e => setForm(p => ({ ...p, headingOrange: e.target.value }))}
                        placeholder="Asked Questions" />
                </div>
            </div>
            <div className="mb-form-actions">
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

// ── FAQ Item Form ─────────────────────────────────────────────
const FaqForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm] = useState({
        question: '', answer: '', subHeading: '', introText: '',
        bulletPoints: '', outroText: '', exampleHeading: '', examples: '',
        sortOrder: '0', isActive: true,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(editData ? {
            question:       editData.Question       || '',
            answer:         editData.Answer         || '',
            subHeading:     editData.SubHeading     || '',
            introText:      editData.IntroText      || '',
            bulletPoints:   editData.BulletPoints   || '',
            outroText:      editData.OutroText      || '',
            exampleHeading: editData.ExampleHeading || '',
            examples:       editData.Examples       || '',
            sortOrder:      String(editData.SortOrder ?? 0),
            isActive:       !!editData.IsActive,
        } : {
            question: '', answer: '', subHeading: '', introText: '',
            bulletPoints: '', outroText: '', exampleHeading: '', examples: '',
            sortOrder: '0', isActive: true,
        });
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.question.trim()) return toast.error('Question required hai');
        setSaving(true);
        try {
            const payload = {
                question:       form.question,
                answer:         form.answer         || null,
                subHeading:     form.subHeading     || null,
                introText:      form.introText      || null,
                bulletPoints:   form.bulletPoints   || null,
                outroText:      form.outroText      || null,
                exampleHeading: form.exampleHeading || null,
                examples:       form.examples       || null,
                sortOrder:      parseInt(form.sortOrder) || 0,
                isActive:       form.isActive,
            };
            const res = editData
                ? await adminFaqApi.updateItem(editData.Id, payload)
                : await adminFaqApi.addItem(payload);
            if (res?.success || res?.data?.success) {
                toast.success(editData ? 'FAQ updated!' : 'FAQ added!'); onSaved();
            } else toast.error(res?.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const TA = ({ label, name, rows = 3, placeholder }) => (
        <div style={{ marginBottom: 12 }}>
            <label className="mb-label">{label}</label>
            <textarea className="mb-textarea" name={name} value={form[name]}
                onChange={handle} rows={rows} placeholder={placeholder} />
        </div>
    );

    return (
        <form onSubmit={submit} className="mb-card" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit FAQ</> : <><FaPlus /> Add New FAQ</>}</h3>

            <div className="mb-grid-2">
                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="mb-label">Question * (sidebar mein dikhega)</label>
                    <input className="mb-input" name="question" value={form.question} onChange={handle}
                        placeholder="What is an agentic AI and Gen AI course online?" required />
                </div>
            </div>

            <TA label="Main Answer (1st paragraph in detail area)" name="answer" rows={4}
                placeholder="An online Generative AI course is a structured..." />

            <div style={{ background: '#f8faff', border: '1px solid #e2eeff', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#3182CE', marginBottom: 10 }}>
                    📌 Optional Rich Content (SubHeading + Bullet Points block)
                </p>
                <div style={{ marginBottom: 10 }}>
                    <label className="mb-label">Sub Heading (h4 — bold section title)</label>
                    <input className="mb-input" name="subHeading" value={form.subHeading} onChange={handle}
                        placeholder="Generative AI Core Focus" />
                </div>
                <TA label="Intro Text (paragraph before bullet points)" name="introText" rows={2}
                    placeholder="Generative AI primarily focuses on..." />
                <div style={{ marginBottom: 10 }}>
                    <label className="mb-label">Bullet Points (ek line = ek point)</label>
                    <textarea className="mb-textarea" name="bulletPoints" value={form.bulletPoints}
                        onChange={handle} rows={5}
                        placeholder={"Advanced text generation\nProduction-ready code generation\nMultimodal outputs"} />
                    <p className="mb-hint">Har point ek nayi line mein</p>
                </div>
                <TA label="Outro Text (paragraph after bullet points)" name="outroText" rows={2}
                    placeholder="Beyond content creation, advanced learners develop..." />
            </div>

            <div style={{ background: '#fffaf5', border: '1px solid #FAD5C5', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#F07500', marginBottom: 10 }}>
                    🔶 Optional Examples Block
                </p>
                <div style={{ marginBottom: 10 }}>
                    <label className="mb-label">Example Heading (h5)</label>
                    <input className="mb-input" name="exampleHeading" value={form.exampleHeading} onChange={handle}
                        placeholder="Real-World Operational Comparison:" />
                </div>
                <div>
                    <label className="mb-label">Examples (ek line = ek example)</label>
                    <textarea className="mb-textarea" name="examples" value={form.examples}
                        onChange={handle} rows={3}
                        placeholder={"A standard GenAI system writes an email draft.\nAn Agentic AI system autonomously reads emails..."} />
                    <p className="mb-hint">Har example ek nayi line mein</p>
                </div>
            </div>

            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                    <div className="mb-checkbox-row" style={{ margin: 0 }}>
                        <input type="checkbox" id="faqActive" name="isActive" checked={form.isActive} onChange={handle} />
                        <label htmlFor="faqActive" className="mb-label-inline">Active (visible on website)</label>
                    </div>
                </div>
            </div>

            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : editData ? 'Update FAQ' : 'Add FAQ'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const ManageFAQ = () => {
    const [settings, setSettings] = useState(null);
    const [items,    setItems]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, iRes] = await Promise.all([
                adminFaqApi.getSettings(),
                adminFaqApi.getItems(),
            ]);
            setSettings(sRes?.settings || sRes?.data?.settings || null);
            setItems(iRes?.items || iRes?.data?.items || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleToggle = async (id) => {
        try { await adminFaqApi.toggleItem(id); fetchAll(); }
        catch { toast.error('Toggle failed'); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this FAQ?')) return;
        try { await adminFaqApi.deleteItem(id); toast.success('Deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <PageLoader message="Loading FAQ section..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Settings */}
            <div className="mb-card">
                <div className="mb-header-row" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="mb-title">Manage FAQ Section</h2>
                        <p className="mb-subtitle">Section heading aur FAQ items manage karo. Questions left sidebar mein, answers right side mein dikhenge.</p>
                    </div>
                </div>
                <SettingsForm initial={settings} onSaved={fetchAll} />
            </div>

            {/* FAQ Items */}
            <div className="mb-card">
                <div className="mb-header-row">
                    <h3 className="mb-list-title">FAQ Items ({items.length})</h3>
                    {!showForm && !editItem && (
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add FAQ
                        </button>
                    )}
                </div>

                {(showForm || editItem) && (
                    <FaqForm
                        editData={editItem}
                        onSaved={() => { setShowForm(false); setEditItem(null); fetchAll(); }}
                        onCancel={() => { setShowForm(false); setEditItem(null); }}
                    />
                )}

                {items.length === 0 ? (
                    <p className="mb-empty">No FAQs yet. Add one above!</p>
                ) : (
                    <div className="mb-list">
                        {items.map((item, idx) => {
                            const bullets  = item.BulletPoints ? item.BulletPoints.split('\n').filter(b => b.trim()) : [];
                            const examples = item.Examples     ? item.Examples.split('\n').filter(e => e.trim())     : [];
                            return (
                                <div key={item.Id} className={`mb-item ${item.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                        background: '#FFF1E6', border: '1.5px solid #FAD5C5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 800, color: '#F07500',
                                    }}>Q{idx + 1}</div>
                                    <div className="mb-content" style={{ flex: 1 }}>
                                        <p className="mb-item-title">{item.Question}</p>
                                        <p className="mb-item-meta">
                                            Sort: {item.SortOrder}
                                            {item.SubHeading    && <> &nbsp;|&nbsp; SubHeading: {item.SubHeading.slice(0, 30)}{item.SubHeading.length > 30 ? '...' : ''}</>}
                                            {bullets.length > 0 && <> &nbsp;|&nbsp; {bullets.length} bullet{bullets.length !== 1 ? 's' : ''}</>}
                                            {examples.length > 0 && <> &nbsp;|&nbsp; {examples.length} example{examples.length !== 1 ? 's' : ''}</>}
                                        </p>
                                        {item.Answer && (
                                            <p style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                                                {item.Answer.slice(0, 100)}{item.Answer.length > 100 ? '...' : ''}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-item-actions">
                                        <span className={item.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                                            {item.IsActive ? 'Active' : 'Hidden'}
                                        </span>
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(item.Id)}>
                                            {item.IsActive
                                                ? <FaToggleOn  style={{ color: '#48bb78' }} />
                                                : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => {
                                            setEditItem(item); setShowForm(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}><FaEdit /> Edit</button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(item.Id)}>
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

export default ManageFAQ;
