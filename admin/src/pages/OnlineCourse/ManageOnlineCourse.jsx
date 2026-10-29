import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff,
    FaList, FaLayerGroup, FaBook, FaChevronDown, FaChevronUp, FaFileAlt, FaFilePdf,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminOnlineCourseApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';
import '../../assets/css/ManageCareer.css';

const CDN_URL = 'https://host0008-001-site1.qtempurl.com/api/uploadfile';

// ── CDN Upload helper ─────────────────────────────────────────
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

// ── Category Form ─────────────────────────────────────────────
const CategoryForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]   = useState({ name: '', sortOrder: '0', isActive: true });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({ name: editData.Name || '', sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive });
        } else {
            setForm({ name: '', sortOrder: '0', isActive: true });
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Category name is required');
        setLoading(true);
        try {
            const payload = { name: form.name, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0 };
            const data = editData ? await adminOnlineCourseApi.updateCategory(editData.Id, payload) : await adminOnlineCourseApi.addCategory(payload);
            if (data.success) { toast.success(editData ? 'Category updated!' : 'Category added!'); onSaved(); }
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message || 'Server error'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} className="mc-form">
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Category</> : <><FaPlus /> Add Category</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Category Name *</label>
                    <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Data Science" />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="ocCatActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="ocCatActive" className="mb-label-inline">Active (visible on website)</label>
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 16 }}>
                <button type="submit" className="mb-btn-primary" disabled={loading}>{loading ? 'Saving...' : editData ? 'Update' : 'Add Category'}</button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Course Form ───────────────────────────────────────────────
const CourseForm = ({ editData, categoryId, onSaved, onCancel }) => {
    const [form, setForm]       = useState({
        title: '', subtitle: '', image: null, feature1: '', feature2: '', feature3: '',
        skillImages: [],   // array of {url, file}
        extraSkills: '0', programUrl: '', brochureUrl: '', sortOrder: '0', isActive: true
    });
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading]       = useState(false);
    const [uploading, setUploading]   = useState(false);
    const [brochureUploading, setBrochureUploading] = useState(false);

    // Parse existing SkillImages from DB (JSON string or null)
    const parseSkillImages = (raw) => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw.map(url => ({ url, file: null }));
        try { return JSON.parse(raw).map(url => ({ url, file: null })); } catch { return []; }
    };

    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.Title || '', subtitle: editData.Subtitle || '',
                image: null, feature1: editData.Feature1 || '', feature2: editData.Feature2 || '',
                feature3: editData.Feature3 || '',
                skillImages: parseSkillImages(editData.SkillImages),
                extraSkills: String(editData.ExtraSkills || 0),
                programUrl: editData.ProgramUrl || '', brochureUrl: editData.BrochureUrl || '',
                sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive
            });
            setImgPreview(editData.Image || null);
        } else {
            setForm({ title: '', subtitle: '', image: null, feature1: '', feature2: '', feature3: '',
                skillImages: [], extraSkills: '0', programUrl: '', brochureUrl: '', sortOrder: '0', isActive: true });
            setImgPreview(null);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file' && files[0] && name === 'image') {
            setForm(p => ({ ...p, image: files[0] }));
            setImgPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    // Add new skill image slot via file pick
    const handleAddSkillImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadToCDN(file);
            setForm(p => ({ ...p, skillImages: [...p.skillImages, { url, file: null }] }));
            toast.success('Skill image uploaded!');
        } catch { toast.error('Skill image upload failed'); }
        finally { setUploading(false); e.target.value = ''; }
    };

    // Remove skill image by index
    const removeSkillImage = (idx) => {
        setForm(p => ({ ...p, skillImages: p.skillImages.filter((_, i) => i !== idx) }));
    };

    // Upload brochure PDF to CDN
    const handleBrochurePdf = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setBrochureUploading(true);
        try {
            const url = await uploadToCDN(file);
            setForm(p => ({ ...p, brochureUrl: url }));
            toast.success('Brochure uploaded!');
        } catch { toast.error('Brochure upload failed'); }
        finally { setBrochureUploading(false); e.target.value = ''; }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Course title is required');
        setLoading(true);
        try {
            let imageUrl = editData?.Image || null;
            if (form.image instanceof File) imageUrl = await uploadToCDN(form.image);

            // skillImages — array of URLs
            const skillUrlsArr = form.skillImages.map(s => s.url).filter(Boolean);
            // first image as legacy SkillImage for backward compat
            const firstSkill = skillUrlsArr[0] || (editData?.SkillImage || null);

            const payload = {
                categoryId, title: form.title, subtitle: form.subtitle || null,
                image: imageUrl, feature1: form.feature1 || null, feature2: form.feature2 || null,
                feature3: form.feature3 || null,
                skillImage: firstSkill,
                skillImages: skillUrlsArr.length > 0 ? JSON.stringify(skillUrlsArr) : null,
                extraSkills: parseInt(form.extraSkills) || 0,
                programUrl: form.programUrl || null, brochureUrl: form.brochureUrl || null,
                sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0
            };
            const data = editData ? await adminOnlineCourseApi.updateCourse(editData.Id, payload) : await adminOnlineCourseApi.addCourse(payload);
            if (data.success) { toast.success(editData ? 'Course updated!' : 'Course added!'); onSaved(); }
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message || 'Server error'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} className="mc-form">
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Course</> : <><FaPlus /> Add Course</>}</h3>
            <div className="mb-grid-2">
                <div className="mb-grid-full">
                    <label className="mb-label">Course Title *</label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle} placeholder="e.g. Web Developer Course" />
                </div>
                <div className="mb-grid-full">
                    <label className="mb-label">Subtitle</label>
                    <input className="mb-input" name="subtitle" value={form.subtitle} onChange={handle} placeholder="e.g. with Placement Assistance" />
                </div>
                <div>
                    <label className="mb-label">Course Banner Image</label>
                    <input className="mb-input" type="file" name="image" accept="image/*" onChange={handle} />
                    {imgPreview && <img src={imgPreview} alt="preview" className="mb-img-preview" style={{ maxHeight: 80, marginTop: 6 }} />}
                </div>
                <div>
                    <label className="mb-label">Extra Skills Count</label>
                    <input className="mb-input" type="number" name="extraSkills" value={form.extraSkills} onChange={handle} placeholder="e.g. 6" />
                </div>
                <div className="mb-grid-full">
                    <label className="mb-label">Skills / Tools Images <span style={{ color: '#aaa', fontWeight: 400 }}>(multiple upload karein)</span></label>
                    {/* Existing previews with remove button */}
                    {form.skillImages.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                            {form.skillImages.map((s, idx) => (
                                <div key={idx} style={{ position: 'relative', display: 'inline-flex' }}>
                                    <img src={s.url} alt={`skill-${idx}`} style={{ height: 52, width: 52, objectFit: 'contain', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', padding: 4 }} />
                                    <button
                                        type="button"
                                        onClick={() => removeSkillImage(idx)}
                                        style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#e53e3e', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                                        title="Remove"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#f0f4f8', border: '1.5px dashed #CBD5E0', borderRadius: 8, cursor: uploading ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600, color: '#4A5568' }}>
                        <FaPlus size={12} /> {uploading ? 'Uploading...' : 'Add Skill Image'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddSkillImage} disabled={uploading} />
                    </label>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Ek ek karke images add karo. Max recommended: 6</p>
                </div>
                <div>
                    <label className="mb-label">Feature 1</label>
                    <input className="mb-input" name="feature1" value={form.feature1} onChange={handle} placeholder="e.g. Master 8+ in-demand skills" />
                </div>
                <div>
                    <label className="mb-label">Feature 2</label>
                    <input className="mb-input" name="feature2" value={form.feature2} onChange={handle} placeholder="e.g. Unlimited mock AI interviews" />
                </div>
                <div>
                    <label className="mb-label">Feature 3</label>
                    <input className="mb-input" name="feature3" value={form.feature3} onChange={handle} placeholder="e.g. Priority access to top opportunities" />
                </div>
                <div>
                    <label className="mb-label">View Program URL</label>
                    <input className="mb-input" name="programUrl" value={form.programUrl} onChange={handle} placeholder="https://..." />
                </div>
                <div>
                    <label className="mb-label">
                        <FaFilePdf style={{ color: '#e53e3e', marginRight: 6 }} />
                        Brochure (PDF upload ya URL)
                    </label>
                    {/* URL input */}
                    <input
                        className="mb-input"
                        name="brochureUrl"
                        value={form.brochureUrl}
                        onChange={handle}
                        placeholder="URL paste karo ya neeche se PDF upload karo"
                        style={{ marginBottom: 8 }}
                    />
                    {/* PDF file upload */}
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff5f5', border: '1.5px dashed #FC8181', borderRadius: 8, cursor: brochureUploading ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600, color: '#C53030' }}>
                        <FaFilePdf size={14} /> {brochureUploading ? 'Uploading...' : 'Upload PDF from System'}
                        <input type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handleBrochurePdf} disabled={brochureUploading} />
                    </label>
                    {/* Show current PDF link if uploaded */}
                    {form.brochureUrl && (
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaFilePdf style={{ color: '#e53e3e' }} />
                            <a href={form.brochureUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#3182ce', textDecoration: 'underline', wordBreak: 'break-all' }}>
                                {form.brochureUrl.length > 60 ? form.brochureUrl.slice(0, 60) + '...' : form.brochureUrl}
                            </a>
                        </div>
                    )}
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="ocCourseActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="ocCourseActive" className="mb-label-inline">Active</label>
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 16 }}>
                <button type="submit" className="mb-btn-primary" disabled={loading}>{loading ? 'Saving...' : editData ? 'Update Course' : 'Add Course'}</button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Category Row with expandable courses ─────────────────────
const CategoryRow = ({ cat, onEditCat, onDeleteCat, onToggleCat, onRefresh }) => {
    const [expanded, setExpanded]             = useState(false);
    const [courses, setCourses]               = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [editCourse, setEditCourse]         = useState(null);
    const navigate = useNavigate();

    const loadCourses = async () => {
        setLoadingCourses(true);
        try {
            const data = await adminOnlineCourseApi.getCoursesByCategory(cat.Id);
            if (data.success) setCourses(data.courses || []);
        } catch (err) { console.error(err); }
        finally { setLoadingCourses(false); }
    };

    const handleExpand = () => {
        if (!expanded) loadCourses();
        setExpanded(p => !p);
        setShowCourseForm(false);
        setEditCourse(null);
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm('Delete this course?')) return;
        const data = await adminOnlineCourseApi.deleteCourse(id);
        if (data.success) { toast.success('Course deleted'); loadCourses(); onRefresh(); }
        else toast.error(data.message || 'Delete failed');
    };

    const handleToggleCourse = async (id) => {
        await adminOnlineCourseApi.toggleCourse(id);
        loadCourses();
    };

    const onCourseSaved = () => { setShowCourseForm(false); setEditCourse(null); loadCourses(); onRefresh(); };

    return (
        <div className={`mc-cat-row ${cat.IsActive ? 'mc-cat--active' : 'mc-cat--inactive'}`}>
            {/* Category header */}
            <div className="mc-cat-header">
                <div className="mc-cat-info" style={{ paddingLeft: 12 }}>
                    <span className="mc-cat-name">{cat.Name}</span>
                    <span className="mc-cat-count">{cat.CourseCount} course{cat.CourseCount !== 1 ? 's' : ''}</span>
                    <span className={cat.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                        {cat.IsActive ? 'Active' : 'Hidden'}
                    </span>
                </div>
                <div className="mc-cat-actions">
                    <button className="mb-btn-toggle" onClick={() => onToggleCat(cat.Id)} title="Toggle">
                        {cat.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                    </button>
                    <button className="mb-btn-edit" onClick={() => onEditCat(cat)}>
                        <FaEdit /> Edit
                    </button>
                    <button className="mb-btn-delete" onClick={() => onDeleteCat(cat.Id)}>
                        <FaTrash /> Delete
                    </button>
                    <button className="mc-expand-btn" onClick={handleExpand}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />} Courses
                    </button>
                </div>
            </div>

            {/* Courses panel */}
            {expanded && (
                <div className="mc-courses-panel">
                    <div className="mc-courses-toolbar">
                        <span className="mc-courses-label"><FaBook /> Courses in "{cat.Name}"</span>
                        <button className="mb-btn-primary mc-add-course-btn"
                            onClick={() => { setShowCourseForm(true); setEditCourse(null); }}>
                            <FaPlus /> Add Course
                        </button>
                    </div>

                    {(showCourseForm || editCourse) && (
                        <div className="mc-course-form-wrap">
                            <CourseForm
                                editData={editCourse}
                                categoryId={cat.Id}
                                onSaved={onCourseSaved}
                                onCancel={() => { setShowCourseForm(false); setEditCourse(null); }}
                            />
                        </div>
                    )}

                    {loadingCourses ? (
                        <PageLoader message="Loading courses..." />
                    ) : courses.length === 0 ? (
                        <p className="mc-no-courses">No courses yet. Add one above!</p>
                    ) : (
                        <div className="mc-course-list">
                            {courses.map(c => (
                                <div key={c.Id} className={`mc-course-item ${c.IsActive ? '' : 'mc-course--inactive'}`}>
                                    <div className="mc-course-logo">
                                        {c.Image
                                            ? <img src={c.Image} alt={c.Title} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                                            : <span className="mc-cat-noimg">No Img</span>}
                                    </div>
                                    <div className="mc-course-info">
                                        <p className="mc-course-title">{c.Title}</p>
                                        <p className="mc-course-meta">{c.Subtitle || '—'} | Sort: {c.SortOrder}</p>
                                        {c.Feature1 && <p className="mc-course-meta" style={{ fontSize: 12 }}>✓ {c.Feature1}</p>}
                                    </div>
                                    <div className="mb-item-actions">
                                        <button className="mb-btn-toggle" onClick={() => handleToggleCourse(c.Id)}>
                                            {c.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => { setEditCourse(c); setShowCourseForm(false); }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDeleteCourse(c.Id)}>
                                            <FaTrash /> Delete
                                        </button>
                                        <button
                                            className="mb-btn-edit"
                                            style={{ background: '#f0fff4', color: '#276749' }}
                                            onClick={() => navigate(`/admin/online-course-detail/${c.Id}`)}
                                            title="Edit Detail Page"
                                        >
                                            <FaFileAlt /> Detail Page
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

// ── Main ManageOnlineCourse ───────────────────────────────────
const ManageOnlineCourse = () => {
    const [categories, setCategories]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showCatForm, setShowCatForm] = useState(false);
    const [editCat, setEditCat]         = useState(null);

    const loadCategories = () => {
        setLoading(true);
        adminOnlineCourseApi.getCategories()
            .then(d => { if (d.success) setCategories(d.categories || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadCategories(); }, []);

    const handleToggleCat = async (id) => {
        await adminOnlineCourseApi.toggleCategory(id);
        loadCategories();
    };

    const handleDeleteCat = async (id) => {
        if (!window.confirm('Delete this category and ALL its courses?')) return;
        const data = await adminOnlineCourseApi.deleteCategory(id);
        if (data.success) { toast.success('Category deleted'); loadCategories(); }
        else toast.error(data.message || 'Delete failed');
    };

    const onCatSaved = () => { setShowCatForm(false); setEditCat(null); loadCategories(); };

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header / Form card */}
            <div className="mb-card">
                {editCat ? (
                    <CategoryForm editData={editCat} onSaved={onCatSaved} onCancel={() => setEditCat(null)} />
                ) : showCatForm ? (
                    <CategoryForm onSaved={onCatSaved} onCancel={() => setShowCatForm(false)} />
                ) : (
                    <div className="mb-header-row">
                        <div>
                            <h2 className="mb-title">
                                <FaLayerGroup style={{ color: '#F6881F', marginRight: 8 }} />
                                Manage Online Courses
                            </h2>
                            <p className="mb-subtitle">
                                Categories aur courses manage karo. Frontend mein automatically show honge.
                            </p>
                        </div>
                        <button className="mb-btn-primary" onClick={() => setShowCatForm(true)}>
                            <FaPlus /> Add Category
                        </button>
                    </div>
                )}
            </div>

            {/* Categories list */}
            {!showCatForm && !editCat && (
                <div className="mb-card">
                    <h3 className="mb-list-title"><FaList /> All Categories ({categories.length})</h3>
                    {loading ? (
                        <PageLoader message="Loading categories..." />
                    ) : categories.length === 0 ? (
                        <p className="mb-empty">No categories yet. Add one above!</p>
                    ) : (
                        <div className="mc-cat-list">
                            {categories.map(cat => (
                                <CategoryRow
                                    key={cat.Id}
                                    cat={cat}
                                    onEditCat={setEditCat}
                                    onDeleteCat={handleDeleteCat}
                                    onToggleCat={handleToggleCat}
                                    onRefresh={loadCategories}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageOnlineCourse;
