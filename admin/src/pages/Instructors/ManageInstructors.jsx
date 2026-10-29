import React, { useState, useEffect } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff,
    FaList, FaChalkboardTeacher, FaSave, FaArrowLeft,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminInstructorApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';
import '../../assets/css/ManageCareer.css';

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
    if (!url) throw new Error('CDN upload failed');
    return url;
};

const BG_OPTIONS = [
    { value: 'blue',  label: '🔵 Blue'  },
    { value: 'cyan',  label: '🩵 Cyan'  },
    { value: 'green', label: '🟢 Green' },
];

const defaultForm = {
    name: '', role: '', photo: null, companyLogo: null,
    description: '', cardBg: 'blue',
    facebookUrl: '', twitterUrl: '', linkedinUrl: '', youtubeUrl: '',
    sortOrder: '0', isActive: true,
};

// ── AllPrograms Hero Form ─────────────────────────────────────
const AllProgramsHeroForm = () => {
    const [form,    setForm]    = useState({ headingLine1: '', headingLine2: '', bgImage: null });
    const [preview, setPreview] = useState(null);
    const [saving,  setSaving]  = useState(false);

    useEffect(() => {
        adminInstructorApi.getAllProgramsHero()
            .then(d => {
                if (d.success && d.hero) {
                    setForm({
                        headingLine1: d.hero.HeadingLine1 || '',
                        headingLine2: d.hero.HeadingLine2 || '',
                        bgImage:      null,
                    });
                    setPreview(d.hero.BgImage || null);
                }
            })
            .catch(console.error);
    }, []);

    const handle = (e) => {
        const { name, files } = e.target;
        if (name === 'bgImage' && files?.[0]) {
            setForm(p => ({ ...p, bgImage: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(p => ({ ...p, [name]: e.target.value }));
        }
    };

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let bgImageUrl = preview;
            // Naya file upload hua hai toh CDN pe bhejo
            if (form.bgImage instanceof File) {
                bgImageUrl = await uploadToCDN(form.bgImage);
            }
            const data = await adminInstructorApi.saveAllProgramsHero({
                headingLine1: form.headingLine1,
                headingLine2: form.headingLine2,
                bgImage:      bgImageUrl,
            });
            if (data.success) {
                toast.success('AllPrograms Hero saved!');
                setPreview(data.hero?.BgImage || bgImageUrl);
                setForm(p => ({ ...p, bgImage: null }));
            } else {
                toast.error(data.message || 'Save failed');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={save} className="mc-form" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                🖼️ All Programs Page — Hero Banner
            </h3>
            <p style={{ fontSize: 13, color: '#718096', marginBottom: 16 }}>
                Frontend <code>/all-Courses</code> page ke hero banner ka heading aur background image yahan manage karo.
            </p>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Heading Line 1</label>
                    <input
                        className="mb-input"
                        name="headingLine1"
                        value={form.headingLine1}
                        onChange={handle}
                        placeholder="Invest in yourself today. Unlock"
                    />
                </div>
                <div>
                    <label className="mb-label">Heading Line 2 (Orange)</label>
                    <input
                        className="mb-input"
                        name="headingLine2"
                        value={form.headingLine2}
                        onChange={handle}
                        placeholder="success for a lifetime."
                    />
                </div>
                <div>
                    <label className="mb-label">Background Image</label>
                    <input
                        className="mb-input"
                        type="file"
                        name="bgImage"
                        accept="image/*"
                        onChange={handle}
                    />
                </div>
                {preview && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label className="mb-label">Current Background</label>
                        <img
                            src={preview}
                            alt="Hero BG Preview"
                            style={{
                                width: '100%', maxHeight: 120,
                                objectFit: 'cover', borderRadius: 10,
                                border: '1px solid #e2e8f0',
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="mb-form-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Hero Banner'}
                </button>
            </div>
        </form>
    );
};


const SectionForm = ({ onSaved }) => {
    const [form, setForm]   = useState({ tagText: 'INSTRUCTORS', headingNormal: 'Master your craft with', headingOrange: 'renowned faculty', viewAllText: 'View All Courses', viewAllLink: '/all-Courses' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        adminInstructorApi.getSection()
            .then(d => {
                if (d.success && d.section) {
                    const s = d.section;
                    setForm({ tagText: s.TagText || '', headingNormal: s.HeadingNormal || '', headingOrange: s.HeadingOrange || '', viewAllText: s.ViewAllText || '', viewAllLink: s.ViewAllLink || '' });
                }
            })
            .catch(console.error);
    }, []);

    const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = await adminInstructorApi.saveSection(form);
            if (data.success) toast.success('Section heading saved!');
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={save} className="mc-form" style={{ marginBottom: 0 }}>
            <h3 className="mb-form-title">Section Heading</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Tag Text (pill)</label>
                    <input className="mb-input" name="tagText" value={form.tagText} onChange={handle} placeholder="INSTRUCTORS" />
                </div>
                <div>
                    <label className="mb-label">Heading Normal (black)</label>
                    <input className="mb-input" name="headingNormal" value={form.headingNormal} onChange={handle} placeholder="Master your craft with" />
                </div>
                <div>
                    <label className="mb-label">Heading Orange</label>
                    <input className="mb-input" name="headingOrange" value={form.headingOrange} onChange={handle} placeholder="renowned faculty" />
                </div>
                <div>
                    <label className="mb-label">View All Button Text</label>
                    <input className="mb-input" name="viewAllText" value={form.viewAllText} onChange={handle} placeholder="View All Courses" />
                </div>
                <div>
                    <label className="mb-label">View All Link</label>
                    <input className="mb-input" name="viewAllLink" value={form.viewAllLink} onChange={handle} placeholder="/all-Courses" />
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 12 }}>
                <button type="submit" className="mb-btn-primary" disabled={saving}><FaSave /> {saving ? 'Saving...' : 'Save Heading'}</button>
            </div>
        </form>
    );
};

// ── Instructor Form ───────────────────────────────────────────
const InstructorForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]             = useState(defaultForm);
    const [photoPreview, setPhotoPreview]     = useState(null);
    const [logoPreview, setLogoPreview]       = useState(null);
    const [loading, setLoading]               = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.Name || '', role: editData.Role || '',
                photo: null, companyLogo: null,
                description: editData.Description || '', cardBg: editData.CardBg || 'blue',
                facebookUrl: editData.FacebookUrl || '', twitterUrl: editData.TwitterUrl || '',
                linkedinUrl: editData.LinkedinUrl || '', youtubeUrl: editData.YoutubeUrl || '',
                sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive,
            });
            setPhotoPreview(editData.Photo || null);
            setLogoPreview(editData.CompanyLogo || null);
        } else {
            setForm(defaultForm);
            setPhotoPreview(null);
            setLogoPreview(null);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file' && files[0]) {
            if (name === 'photo') { setForm(p => ({ ...p, photo: files[0] })); setPhotoPreview(URL.createObjectURL(files[0])); }
            else                  { setForm(p => ({ ...p, companyLogo: files[0] })); setLogoPreview(URL.createObjectURL(files[0])); }
        } else {
            setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Name is required');
        setLoading(true);
        try {
            let photoUrl = editData?.Photo || null;
            let logoUrl  = editData?.CompanyLogo || null;
            if (form.photo       instanceof File) photoUrl = await uploadToCDN(form.photo);
            if (form.companyLogo instanceof File) logoUrl  = await uploadToCDN(form.companyLogo);

            const payload = {
                name: form.name, role: form.role || null, photo: photoUrl, companyLogo: logoUrl,
                description: form.description || null, cardBg: form.cardBg,
                facebookUrl: form.facebookUrl || null, twitterUrl: form.twitterUrl || null,
                linkedinUrl: form.linkedinUrl || null, youtubeUrl: form.youtubeUrl || null,
                sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0,
            };
            let data;
            if (editData) data = await adminInstructorApi.updateInstructor(editData.Id, payload);
            else           data = await adminInstructorApi.addInstructor(payload);
            if (data.success) { toast.success(editData ? 'Updated!' : 'Added!'); onSaved(); }
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} className="mc-form">
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Instructor</> : <><FaPlus /> Add Instructor</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Name *</label>
                    <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Pramanth Raj Sinha" />
                </div>
                <div>
                    <label className="mb-label">Role / Designation</label>
                    <input className="mb-input" name="role" value={form.role} onChange={handle} placeholder="e.g. Founder & Trustee" />
                </div>
                <div>
                    <label className="mb-label">Photo (Instructor Image)</label>
                    <input className="mb-input" type="file" name="photo" accept="image/*" onChange={handle} />
                    {photoPreview && <img src={photoPreview} alt="preview" className="mb-img-preview" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginTop: 6 }} />}
                </div>
                <div>
                    <label className="mb-label">Company Logo</label>
                    <input className="mb-input" type="file" name="companyLogo" accept="image/*" onChange={handle} />
                    {logoPreview && <img src={logoPreview} alt="logo" className="mb-img-preview" style={{ maxHeight: 40, marginTop: 6 }} />}
                </div>
                <div className="mb-grid-full">
                    <label className="mb-label">Description</label>
                    <textarea className="mb-textarea" name="description" value={form.description} onChange={handle} rows={3} placeholder="Former McKinsey Partner..." />
                </div>
                <div>
                    <label className="mb-label">Card Background Color</label>
                    <select className="mb-input" name="cardBg" value={form.cardBg} onChange={handle}>
                        {BG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div>
                    <label className="mb-label">Facebook URL</label>
                    <input className="mb-input" name="facebookUrl" value={form.facebookUrl} onChange={handle} placeholder="https://facebook.com/..." />
                </div>
                <div>
                    <label className="mb-label">Twitter / X URL</label>
                    <input className="mb-input" name="twitterUrl" value={form.twitterUrl} onChange={handle} placeholder="https://twitter.com/..." />
                </div>
                <div>
                    <label className="mb-label">LinkedIn URL</label>
                    <input className="mb-input" name="linkedinUrl" value={form.linkedinUrl} onChange={handle} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                    <label className="mb-label">YouTube URL</label>
                    <input className="mb-input" name="youtubeUrl" value={form.youtubeUrl} onChange={handle} placeholder="https://youtube.com/..." />
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="instrActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="instrActive" className="mb-label-inline">Active</label>
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 16 }}>
                <button type="submit" className="mb-btn-primary" disabled={loading}>{loading ? 'Saving...' : editData ? 'Update' : 'Add Instructor'}</button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main Component ────────────────────────────────────────────
const ManageInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showForm, setShowForm]       = useState(false);
    const [editItem, setEditItem]       = useState(null);

    const load = () => {
        setLoading(true);
        adminInstructorApi.getInstructors()
            .then(d => { if (d.success) setInstructors(d.instructors || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleToggle = async (id) => {
        await adminInstructorApi.toggleInstructor(id);
        load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this instructor?')) return;
        const d = await adminInstructorApi.deleteInstructor(id);
        if (d.success) { toast.success('Deleted'); load(); }
        else toast.error(d.message || 'Delete failed');
    };

    const onSaved = () => { setShowForm(false); setEditItem(null); load(); };

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* AllPrograms Hero Banner editor */}
            <div className="mb-card"><AllProgramsHeroForm /></div>

            {/* Section heading editor */}
            <div className="mb-card"><SectionForm /></div>

            {/* Add / Edit form */}
            <div className="mb-card">
                {(showForm || editItem) ? (
                    <InstructorForm editData={editItem} onSaved={onSaved} onCancel={() => { setShowForm(false); setEditItem(null); }} />
                ) : (
                    <div className="mb-header-row">
                        <div>
                            <h2 className="mb-title"><FaChalkboardTeacher style={{ color: '#F6881F', marginRight: 8 }} /> Manage Instructors</h2>
                            <p className="mb-subtitle">Homepage "Instructors" section ke cards manage karo.</p>
                        </div>
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}><FaPlus /> Add Instructor</button>
                    </div>
                )}
            </div>

            {/* List */}
            {!showForm && !editItem && (
                <div className="mb-card">
                    <h3 className="mb-list-title"><FaList /> All Instructors ({instructors.length})</h3>
                    {loading ? <PageLoader message="Loading..." /> : instructors.length === 0 ? (
                        <p className="mb-empty">No instructors yet. Add one above!</p>
                    ) : (
                        <div className="mc-course-list">
                            {instructors.map(item => (
                                <div key={item.Id} className={`mc-course-item ${item.IsActive ? '' : 'mc-course--inactive'}`}>
                                    <div className="mc-course-logo">
                                        {item.Photo
                                            ? <img src={item.Photo} alt={item.Name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                                            : <span className="mc-cat-noimg">No Photo</span>}
                                    </div>
                                    <div className="mc-course-info">
                                        <p className="mc-course-title">{item.Name}</p>
                                        <p className="mc-course-meta">{item.Role || '—'} | Card: {item.CardBg} | Sort: {item.SortOrder}</p>
                                    </div>
                                    <div className="mb-item-actions">
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(item.Id)}>
                                            {item.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => { setEditItem(item); setShowForm(false); }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(item.Id)}>
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageInstructors;
