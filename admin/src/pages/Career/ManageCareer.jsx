import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff,
    FaList, FaLayerGroup, FaBook, FaTimes, FaChevronDown, FaChevronUp, FaFileAlt,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminCareerApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
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


const ICON_OPTIONS = [
    { value: 'PiCertificateLight', label: '📜 Certificate' },
    { value: 'FaMedal',            label: '🏅 Medal' },
    { value: 'FaGraduationCap',    label: '🎓 Graduation' },
    { value: 'FaBook',             label: '📚 Book' },
    { value: 'FaStar',             label: '⭐ Star' },
    { value: 'FaClock',            label: '⏱ Clock' },
    { value: 'FaUserTie',          label: '👔 Professional' },
    { value: 'FaLaptopCode',       label: '💻 Laptop Code' },
];

// ── Category Form ─────────────────────────────────────────────
const CategoryForm = ({ editData, onSaved, onCancel }) => {
    const [form, setForm]       = useState({ name: '', image: null, sortOrder: '0', isActive: true });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({ name: editData.Name || '', image: null, sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive });
            setPreview(editData.Image || null);
        } else {
            setForm({ name: '', image: null, sortOrder: '0', isActive: true });
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
        if (!form.name.trim()) return toast.error('Category name is required');
        setLoading(true);
        try {
            let imageUrl = editData?.Image || null;
            if (form.image instanceof File) imageUrl = await uploadToCDN(form.image);

            const payload = { name: form.name, image: imageUrl, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0 };
            const data = editData ? await adminCareerApi.updateCategory(editData.Id, payload) : await adminCareerApi.addCategory(payload);
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
                    <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Agentic AI" />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div>
                    <label className="mb-label">Category Image (Icon)</label>
                    <input className="mb-input" type="file" name="image" accept="image/*" onChange={handle} />
                    {preview && <img src={preview} alt="preview" className="mb-img-preview" style={{ background: '#f5f5f5', padding: 4 }} />}
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="catActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="catActive" className="mb-label-inline">Active (visible on website)</label>
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
    const [form, setForm]       = useState({ ribbon: '', ribbonColor: 'blue', logo: null, location: '', title: '', feature1Text: '', feature1Icon: 'PiCertificateLight', feature2Text: '', feature2Icon: 'FaMedal', sortOrder: '0', isActive: true });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                ribbon: editData.Ribbon || '', ribbonColor: editData.RibbonColor || 'blue',
                logo: null, location: editData.Location || '', title: editData.Title || '',
                feature1Text: editData.Feature1Text || '', feature1Icon: editData.Feature1Icon || 'PiCertificateLight',
                feature2Text: editData.Feature2Text || '', feature2Icon: editData.Feature2Icon || 'FaMedal',
                sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive
            });
            setPreview(editData.Logo || null);
        } else {
            setForm({ ribbon: '', ribbonColor: 'blue', logo: null, location: '', title: '', feature1Text: '', feature1Icon: 'PiCertificateLight', feature2Text: '', feature2Icon: 'FaMedal', sortOrder: '0', isActive: true });
            setPreview(null);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file' && files[0]) {
            setForm(p => ({ ...p, logo: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Course title is required');
        setLoading(true);
        try {
            let logoUrl = editData?.Logo || null;
            if (form.logo instanceof File) logoUrl = await uploadToCDN(form.logo);

            const payload = {
                categoryId: categoryId, ribbon: form.ribbon || null, ribbonColor: form.ribbonColor || null,
                logo: logoUrl, location: form.location || null, title: form.title,
                feature1Text: form.feature1Text || null, feature1Icon: form.feature1Icon || null,
                feature2Text: form.feature2Text || null, feature2Icon: form.feature2Icon || null,
                sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0
            };
            const data = editData ? await adminCareerApi.updateCourse(editData.Id, payload) : await adminCareerApi.addCourse(payload);
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
                    <input className="mb-input" name="title" value={form.title} onChange={handle} placeholder="e.g. Executive PG Certificate in AI..." />
                </div>
                <div>
                    <label className="mb-label">Ribbon Text</label>
                    <input className="mb-input" name="ribbon" value={form.ribbon} onChange={handle} placeholder="e.g. Popular, New Course" />
                </div>
                <div>
                    <label className="mb-label">Ribbon Color</label>
                    <select className="mb-input" name="ribbonColor" value={form.ribbonColor} onChange={handle}>
                        <option value="blue">Blue</option>
                        <option value="orange">Orange</option>
                    </select>
                </div>
                <div>
                    <label className="mb-label">Institution Logo</label>
                    <input className="mb-input" type="file" name="logo" accept="image/*" onChange={handle} />
                    {preview && <img src={preview} alt="logo" className="mb-img-preview" style={{ background: '#f5f5f5', padding: 4 }} />}
                </div>
                <div>
                    <label className="mb-label">Location / Institution Name</label>
                    <input className="mb-input" name="location" value={form.location} onChange={handle} placeholder="e.g. IIT Kharagpur" />
                </div>
                <div>
                    <label className="mb-label">Feature 1 Text</label>
                    <input className="mb-input" name="feature1Text" value={form.feature1Text} onChange={handle} placeholder="e.g. Executive Post Graduate Certificate" />
                </div>
                <div>
                    <label className="mb-label">Feature 1 Icon</label>
                    <select className="mb-input" name="feature1Icon" value={form.feature1Icon} onChange={handle}>
                        {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="mb-label">Feature 2 Text</label>
                    <input className="mb-input" name="feature2Text" value={form.feature2Text} onChange={handle} placeholder="e.g. Executive Post Graduate Certificate" />
                </div>
                <div>
                    <label className="mb-label">Feature 2 Icon</label>
                    <select className="mb-input" name="feature2Icon" value={form.feature2Icon} onChange={handle}>
                        {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="courseActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="courseActive" className="mb-label-inline">Active</label>
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
    const [expanded, setExpanded]         = useState(false);
    const [courses, setCourses]           = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [editCourse, setEditCourse]     = useState(null);
    const navigate = useNavigate();

    const loadCourses = async () => {
        setLoadingCourses(true);
        try {
            const data = await adminCareerApi.getCoursesByCategory(cat.Id);
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
        const data = await adminCareerApi.deleteCourse(id);
        if (data.success) { toast.success('Course deleted'); loadCourses(); onRefresh(); }
        else toast.error(data.message || 'Delete failed');
    };

    const handleToggleCourse = async (id) => {
        await adminCareerApi.toggleCourse(id);
        loadCourses();
    };

    const onCourseSaved = () => { setShowCourseForm(false); setEditCourse(null); loadCourses(); onRefresh(); };

    return (
        <div className={`mc-cat-row ${cat.IsActive ? 'mc-cat--active' : 'mc-cat--inactive'}`}>
            {/* Category header */}
            <div className="mc-cat-header">
                <div className="mc-cat-thumb">
                    {cat.Image
                        ? <img src={cat.Image} alt={cat.Name} />
                        : <span className="mc-cat-noimg">No Img</span>}
                </div>
                <div className="mc-cat-info">
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
                                        {c.Logo
                                            ? <img src={c.Logo} alt={c.Location} />
                                            : <span className="mc-cat-noimg">No Logo</span>}
                                    </div>
                                    <div className="mc-course-info">
                                        {c.Ribbon && (
                                            <span className={`mc-ribbon mc-ribbon--${c.RibbonColor}`}>{c.Ribbon}</span>
                                        )}
                                        <p className="mc-course-title">{c.Title}</p>
                                        <p className="mc-course-meta">{c.Location || '—'} | Sort: {c.SortOrder}</p>
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
                                            onClick={() => navigate(`/admin/course-detail/${c.Id}`)}
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

// ── Main ManageCareer ─────────────────────────────────────────
const ManageCareer = () => {
    const [categories, setCategories]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showCatForm, setShowCatForm] = useState(false);
    const [editCat, setEditCat]         = useState(null);

    const loadCategories = () => {
        setLoading(true);
        adminCareerApi.getCategories()
            .then(d => { if (d.success) setCategories(d.categories || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadCategories(); }, []);

    const handleToggleCat = async (id) => {
        await adminCareerApi.toggleCategory(id);
        loadCategories();
    };

    const handleDeleteCat = async (id) => {
        if (!window.confirm('Delete this category and ALL its courses?')) return;
        const data = await adminCareerApi.deleteCategory(id);
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
                            <h2 className="mb-title"><FaLayerGroup style={{ color: '#F6881F', marginRight: 8 }} /> Manage Career Sections</h2>
                            <p className="mb-subtitle">Add categories (tabs) and courses inside each. Frontend mein automatically show honge.</p>
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

export default ManageCareer;
