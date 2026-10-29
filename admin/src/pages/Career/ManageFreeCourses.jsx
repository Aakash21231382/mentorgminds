import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaList, FaBookOpen } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminFreeCourseApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';

const CDN_URL  = 'https://host0008-001-site1.qtempurl.com/api/uploadfile';

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
    if (!url) throw new Error(`CDN response unexpected: ${JSON.stringify(d)}`);
    return url;
};

const EMPTY = { title: '', image: null, learners: '', duration: '', programUrl: '', enrollUrl: '', sortOrder: '0', isActive: true };

// ── Form ──────────────────────────────────────────────────────
const FreeCourseForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]       = useState(EMPTY);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.Title || '', image: null,
                learners: editData.Learners || '', duration: editData.Duration || '',
                programUrl: editData.ProgramUrl || '', enrollUrl: editData.EnrollUrl || '',
                sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive
            });
            setPreview(editData.Image || null);
        } else {
            setForm(EMPTY);
            setPreview(null);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file' && files[0]) {
            setForm(p => ({ ...p, image: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        setLoading(true);
        try {
            let imageUrl = editData?.Image || null;
            if (form.image instanceof File) imageUrl = await uploadToCDN(form.image);

            const payload = {
                title: form.title, image: imageUrl,
                learners: form.learners || null, duration: form.duration || null,
                programUrl: form.programUrl || null, enrollUrl: form.enrollUrl || null,
                sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0
            };
            let data;
            if (editData) {
                data = await adminFreeCourseApi.update(editData.Id, payload);
            } else {
                data = await adminFreeCourseApi.add(payload);
            }
            if (data.success) { toast.success(editData ? 'Course updated!' : 'Course added!'); onSaved(); }
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message || 'Server error'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit}>
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Free Course</> : <><FaPlus /> Add Free Course</>}</h3>

            <div className="mb-sec">
                <div style={{ marginBottom: 12 }}>
                    <label className="mb-label">Course Title *</label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle}
                        placeholder="e.g. Introduction to Generative AI" />
                </div>
                <div className="mb-grid-2">
                    <div>
                        <label className="mb-label">Course Image</label>
                        <input className="mb-input" type="file" name="image" accept="image/*" onChange={handle} />
                        {preview && <img src={preview} alt="preview" className="mb-img-preview" />}
                    </div>
                    <div>
                        <label className="mb-label">Learners Count</label>
                        <input className="mb-input" name="learners" value={form.learners} onChange={handle}
                            placeholder="e.g. 2.8k+ learners" />
                        <label className="mb-label" style={{ marginTop: 12 }}>Duration</label>
                        <input className="mb-input" name="duration" value={form.duration} onChange={handle}
                            placeholder="e.g. 2 hrs" />
                    </div>
                </div>
            </div>

            <div className="mb-sec">
                <p className="mb-sec-label">Links</p>
                <div className="mb-grid-2">
                    <div>
                        <label className="mb-label">View Program URL</label>
                        <input className="mb-input" name="programUrl" value={form.programUrl} onChange={handle} placeholder="/courses/..." />
                    </div>
                    <div>
                        <label className="mb-label">Enroll Now URL</label>
                        <input className="mb-input" name="enrollUrl" value={form.enrollUrl} onChange={handle} placeholder="/enroll/..." />
                    </div>
                </div>
            </div>

            <div className="mb-meta-row">
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input-sm" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div className="mb-checkbox-row">
                    <input type="checkbox" id="fcActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="fcActive" className="mb-label-inline">Active (visible on website)</label>
                </div>
            </div>

            <div className="mb-form-actions">
                <button type="submit" className="mb-btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editData ? 'Update Course' : 'Add Course'}
                </button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Main ──────────────────────────────────────────────────────
const ManageFreeCourses = () => {
    const [courses,   setCourses]   = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showForm,  setShowForm]  = useState(false);
    const [editData,  setEditData]  = useState(null);

    const load = () => {
        setLoading(true);
        adminFreeCourseApi.getAll()
            .then(d => { if (d.success) setCourses(d.courses || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleToggle = async (id) => {
        await adminFreeCourseApi.toggle(id);
        load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this free course?')) return;
        const data = await adminFreeCourseApi.delete(id);
        if (data.success) { toast.success('Deleted'); load(); }
        else toast.error(data.message || 'Error');
    };

    const onSaved = () => { setShowForm(false); setEditData(null); load(); };

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="mb-card">
                {editData ? (
                    <FreeCourseForm editData={editData} onSaved={onSaved} onCancel={() => setEditData(null)} />
                ) : showForm ? (
                    <FreeCourseForm onSaved={onSaved} onCancel={() => setShowForm(false)} />
                ) : (
                    <div className="mb-header-row">
                        <div>
                            <h2 className="mb-title"><FaBookOpen style={{ color: '#F6881F', marginRight: 8 }} /> Manage Free Courses</h2>
                            <p className="mb-subtitle">Add free introductory courses shown on the All Programs page.</p>
                        </div>
                        <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Free Course
                        </button>
                    </div>
                )}
            </div>

            {!showForm && !editData && (
                <div className="mb-card">
                    <h3 className="mb-list-title"><FaList /> All Free Courses ({courses.length})</h3>
                    {loading ? <PageLoader message="Loading..." /> : courses.length === 0 ? (
                        <p className="mb-empty">No free courses yet. Add one above!</p>
                    ) : (
                        <div className="mb-list">
                            {courses.map(c => (
                                <div key={c.Id} className={`mb-item ${c.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}>
                                    <div className="mb-thumb">
                                        {c.Image
                                            ? <img src={c.Image} alt={c.Title} />
                                            : <span className="mb-thumb-noimg">No Image</span>}
                                    </div>
                                    <div className="mb-content">
                                        <p className="mb-item-title">{c.Title}</p>
                                        <p className="mb-item-meta">
                                            {c.Learners || '—'} &nbsp;|&nbsp; {c.Duration || '—'} &nbsp;|&nbsp; Sort: {c.SortOrder}
                                        </p>
                                    </div>
                                    <div className="mb-item-actions">
                                        <button className="mb-btn-toggle" onClick={() => handleToggle(c.Id)}>
                                            {c.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => { setEditData(c); setShowForm(false); }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDelete(c.Id)}>
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

export default ManageFreeCourses;
