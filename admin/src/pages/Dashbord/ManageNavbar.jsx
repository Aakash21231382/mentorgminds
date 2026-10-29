import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { navbarApi, courseApi } from '../../api/adminApi';
import {
  FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaBook, FaTimes,
  FaChevronDown, FaChevronUp, FaLink, FaBookOpen, FaPlus, FaFilter, FaLayerGroup,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageNavbar.css';

// CDN URL — direct upload, same as frontend profile image upload
const CDN_URL = 'https://host0008-001-site1.qtempurl.com/api/uploadfile';

// ─── Upload image directly to CDN ────────
const uploadToCDN = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post(CDN_URL, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const d = res.data;
  // result can be object OR array depending on CDN response
  let url = null;
  if (Array.isArray(d?.result)) {
    url = d.result[0]?.variants?.[0] || d.result[0]?.url;
  } else if (d?.result?.variants) {
    url = Array.isArray(d.result.variants) ? d.result.variants[0] : d.result.variants;
  } else if (d?.url) {
    url = d.url;
  }
  if (!url) throw new Error(`CDN returned no URL: ${JSON.stringify(d)}`);
  return url;
};

// ─── Category options ────────────────────────────────────────
const CATEGORY_OPTIONS = [
  { value: 'courses',        label: 'Courses' },
  { value: 'certifications', label: 'Certifications' },
  { value: 'study-abroad',   label: 'Study Abroad' },
  { value: 'mentorship',     label: 'Mentorship' },
  { value: 'centers',        label: 'Centers' },
  { value: 'static',         label: 'Static (No Details)' },
];

// ─── NavbarLinkForm ──────────────────────────────────────────
const NavbarLinkForm = ({ editMode, editId, formData, setFormData, flatLinks, onSubmit, onCancel, loading }) => {
  const handle = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(p => ({ ...p, [e.target.name]: val }));
  };

  return (
    <form onSubmit={onSubmit}>
      <h3 className="mn-section-title">
        {editMode ? <><FaEdit /> Edit Link</> : <><FaPlus /> Add New Navbar Link</>}
      </h3>
      <div className="mn-form-grid">
        <div className="mn-form-group">
          <label className="mn-form-label">Link Title *</label>
          <input className="mn-form-input" name="title" value={formData.title} onChange={handle} required placeholder="e.g. Technology" />
        </div>
        <div className="mn-form-group">
          <label className="mn-form-label">Category</label>
          <select className="mn-form-select" name="category" value={formData.category} onChange={handle}>
            <option value="">-- Select Category --</option>
            {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {!editMode && (
          <div className="mn-form-group">
            <label className="mn-form-label">Parent Menu (leave blank for main menu item)</label>
            <select className="mn-form-select" name="parentId" value={formData.parentId} onChange={handle}>
              <option value="">-- No Parent (Main Menu) --</option>
              {flatLinks.filter(l => !l.ParentId).map(p => (
                <option key={p.Id} value={p.Id}>{p.Title}</option>
              ))}
            </select>
          </div>
        )}
        <div className="mn-form-group">
          <label className="mn-form-label">Custom URL (optional — auto-generated if blank)</label>
          <input className="mn-form-input" name="url" value={formData.url} onChange={handle} placeholder="/courses/technology" />
        </div>
        <div className="mn-form-group">
          <label className="mn-form-label">Badge Text (e.g. "New")</label>
          <input className="mn-form-input" name="badgeText" value={formData.badgeText} onChange={handle} placeholder="New" />
        </div>
        <div className="mn-form-group">
          <label className="mn-form-label">Sort Order</label>
          <input className="mn-form-input" type="number" name="sortOrder" value={formData.sortOrder} onChange={handle} />
        </div>
        <div className="mn-form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="mn-form-label">
            "View All" Button URL
            <span style={{ fontWeight: 400, color: '#a0aec0', marginLeft: 8, fontSize: 11 }}>
              (Mega dropdown ke neeche button show hoga — e.g. /centres, /courses)
            </span>
          </label>
          <input
            className="mn-form-input"
            name="viewAllUrl"
            value={formData.viewAllUrl || ''}
            onChange={handle}
            placeholder="e.g. /centres  or  /all-courses  or  /certifications"
          />
        </div>
      </div>
      {editMode && (
        <div className="mn-checkbox-group">
          <input type="checkbox" name="isActive" id="activeChk" checked={formData.isActive} onChange={handle} />
          <label htmlFor="activeChk" className="mn-form-label">Active (visible on website)</label>
        </div>
      )}
      <div className="mn-form-actions">
        <button type="submit" className="mn-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : editMode ? 'Update Link' : 'Add Link'}
        </button>
        {editMode && <button type="button" className="mn-btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

// ─── CourseDetailsForm ───────────────────────────────────────
const CourseDetailsForm = ({ navbarLink, onClose }) => {
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    heroTitle: '', heroSubtitle: '', heroBadge: '', heroImage: null,
    overviewTitle: '', overviewDescription: '',
    keyHighlights: '', curriculum: '', whoShouldEnroll: '',
    originalFee: '', discountedFee: '', duration: '',
    rating: '', studentsEnrolled: '',
    institutionName: '', institutionLogo: null,
    certificateTitle: '', certificateImage: null,
    faqs: '', metaTitle: '', metaDescription: '',
    brochureFile: null,
  });
  const [preview, setPreview] = useState({ heroImage: null, institutionLogo: null, certificateImage: null, brochureUrl: null });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await courseApi.getCourseByNavbarId(navbarLink.Id);
        if (res.success && res.course) {
          const c = res.course;
          setForm({
            heroTitle: c.HeroTitle || '', heroSubtitle: c.HeroSubtitle || '',
            heroBadge: c.HeroBadge || '', heroImage: null,
            overviewTitle: c.OverviewTitle || '', overviewDescription: c.OverviewDescription || '',
            keyHighlights: c.KeyHighlights || '', curriculum: c.Curriculum || '',
            whoShouldEnroll: c.WhoShouldEnroll || '',
            originalFee: c.OriginalFee || '', discountedFee: c.DiscountedFee || '',
            duration: c.Duration || '', rating: c.Rating || '',
            studentsEnrolled: c.StudentsEnrolled || '',
            institutionName: c.InstitutionName || '', institutionLogo: null,
            certificateTitle: c.CertificateTitle || '', certificateImage: null,
            faqs: c.FAQs || '', metaTitle: c.MetaTitle || '',
            metaDescription: c.MetaDescription || '',
            brochureFile: null,
          });
          setPreview({ heroImage: c.HeroImage, institutionLogo: c.InstitutionLogo, certificateImage: c.CertificateImage, brochureUrl: c.BrochureUrl || null });
        }
      } catch { /* no existing data — fresh form */ }
      setFetching(false);
    };
    load();
  }, [navbarLink.Id]);

  const handle     = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setForm(p    => ({ ...p,    [name]: files[0] }));
      setPreview(p => ({ ...p,    [name]: URL.createObjectURL(files[0]) }));
    }
  };

  // Images are CDN URLs — already full URL, no prefix needed
  const imgSrc = (field) => {
    if (preview[field] && preview[field].startsWith('blob')) return preview[field];
    if (preview[field]) return preview[field];
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = navbarLink.Slug || navbarLink.Title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Upload any new image/file to CDN first — get back full URL
      const heroImageUrl        = form.heroImage        instanceof File ? await uploadToCDN(form.heroImage)        : (preview.heroImage        || null);
      const institutionLogoUrl  = form.institutionLogo  instanceof File ? await uploadToCDN(form.institutionLogo)  : (preview.institutionLogo  || null);
      const certificateImageUrl = form.certificateImage instanceof File ? await uploadToCDN(form.certificateImage) : (preview.certificateImage || null);
      const brochureUrl         = form.brochureFile     instanceof File ? await uploadToCDN(form.brochureFile)     : (preview.brochureUrl      || null);

      // Build JSON payload — no files, only text + CDN URLs
      const payload = {
        slug,
        category:            navbarLink.Category || '',
        heroTitle:           form.heroTitle           || null,
        heroSubtitle:        form.heroSubtitle        || null,
        heroBadge:           form.heroBadge           || null,
        heroImage:           heroImageUrl,
        overviewTitle:       form.overviewTitle       || null,
        overviewDescription: form.overviewDescription || null,
        keyHighlights:       form.keyHighlights       || null,
        curriculum:          form.curriculum          || null,
        whoShouldEnroll:     form.whoShouldEnroll     || null,
        originalFee:         form.originalFee         || null,
        discountedFee:       form.discountedFee       || null,
        duration:            form.duration            || null,
        rating:              form.rating              || null,
        studentsEnrolled:    form.studentsEnrolled    || null,
        institutionName:     form.institutionName     || null,
        institutionLogo:     institutionLogoUrl,
        certificateTitle:    form.certificateTitle    || null,
        certificateImage:    certificateImageUrl,
        faqs:                form.faqs                || null,
        metaTitle:           form.metaTitle           || null,
        metaDescription:     form.metaDescription     || null,
        brochureUrl:         brochureUrl,
      };

      const res = await courseApi.upsertCourseDetails(navbarLink.Id, payload);
      if (res.success) { toast.success('Details saved successfully!'); onClose(); }
      else toast.error(res.message || 'Something went wrong');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Server error');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="mn-modal-overlay">
      <div className="mn-modal-content">
        <div className="mn-loading-text">Loading existing data...</div>
      </div>
    </div>
  );

  const fld = (label, name, type = 'text', ph = '') => (
    <div className="mn-form-group" key={name}>
      <label className="mn-form-label">{label}</label>
      <input className="mn-form-input" type={type} name={name} value={form[name]} onChange={handle} placeholder={ph} />
    </div>
  );

  return (
    <div className="mn-modal-overlay">
      <div className="mn-modal-content">
        <div className="mn-modal-header">
          <h3 className="mn-section-title" style={{ margin: 0 }}>
            <FaBookOpen style={{ marginRight: 6 }} /> Course Details — <em>{navbarLink.Title}</em>
          </h3>
          <button onClick={onClose} className="mn-modal-close"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Hero Section */}
          <p className="mn-modal-section-title">Hero Section</p>
          <div className="mn-form-grid">
            {fld('Hero Title', 'heroTitle', 'text', 'e.g. Master Technology')}
            {fld('Hero Badge', 'heroBadge', 'text', 'e.g. Most Popular')}
          </div>
          <div className="mn-form-group">
            <label className="mn-form-label">Hero Subtitle</label>
            <textarea className="mn-form-textarea" name="heroSubtitle" value={form.heroSubtitle} onChange={handle} placeholder="Short description..." />
          </div>
          <div className="mn-form-group">
            <label className="mn-form-label">Hero Image</label>
            <input type="file" name="heroImage" accept="image/*" onChange={handleFile} className="mn-form-input" />
            {imgSrc('heroImage') && <img src={imgSrc('heroImage')} alt="hero preview" className="mn-preview-img" />}
          </div>

          {/* Overview */}
          <p className="mn-modal-section-title">Overview</p>
          <div className="mn-form-grid">
            {fld('Overview Title', 'overviewTitle', 'text', 'What is this course?')}
          </div>
          <div className="mn-form-group">
            <label className="mn-form-label">Overview Description</label>
            <textarea className="mn-form-textarea large" name="overviewDescription" value={form.overviewDescription} onChange={handle} placeholder="Detailed description..." />
          </div>

          {/* Highlights & Curriculum */}
          <p className="mn-modal-section-title">Key Highlights & Curriculum</p>
          <div className="mn-form-group">
            <label className="mn-form-label">Key Highlights (JSON array)</label>
            <textarea className="mn-form-textarea" name="keyHighlights" value={form.keyHighlights} onChange={handle} placeholder='[{"icon":"fa-certificate","text":"12 Months Duration"}]' />
          </div>
          <div className="mn-form-group">
            <label className="mn-form-label">Curriculum (JSON array)</label>
            <textarea className="mn-form-textarea" name="curriculum" value={form.curriculum} onChange={handle} placeholder='[{"moduleTitle":"Introduction","topics":["Overview","Setup"]}]' />
          </div>
          <div className="mn-form-group">
            <label className="mn-form-label">Who Should Enroll (JSON array)</label>
            <textarea className="mn-form-textarea" name="whoShouldEnroll" value={form.whoShouldEnroll} onChange={handle} placeholder='["Software Engineers","Data Analysts"]' />
          </div>

          {/* Fee & Stats */}
          <p className="mn-modal-section-title">Fee, Duration & Stats</p>
          <div className="mn-form-grid-3">
            {fld('Original Fee',    'originalFee',    'text',   '₹1,20,000')}
            {fld('Discounted Fee',  'discountedFee',  'text',   '₹84,000')}
            {fld('Duration',        'duration',       'text',   '6 Months')}
            {fld('Rating',          'rating',         'number', '4.5')}
            {fld('Students Enrolled','studentsEnrolled','number','')}
          </div>

          {/* Institution & Certificate */}
          <p className="mn-modal-section-title">Institution & Certificate</p>
          <div className="mn-form-grid">
            {fld('Institution Name', 'institutionName', 'text', 'IIT Kharagpur')}
            {fld('Certificate Title','certificateTitle','text', 'Post Graduate Certificate')}
          </div>
          <div className="mn-form-grid">
            <div className="mn-form-group">
              <label className="mn-form-label">Institution Logo</label>
              <input type="file" name="institutionLogo" accept="image/*" onChange={handleFile} className="mn-form-input" />
              {imgSrc('institutionLogo') && <img src={imgSrc('institutionLogo')} alt="logo preview" className="mn-preview-img" />}
            </div>
            <div className="mn-form-group">
              <label className="mn-form-label">Certificate Image</label>
              <input type="file" name="certificateImage" accept="image/*" onChange={handleFile} className="mn-form-input" />
              {imgSrc('certificateImage') && <img src={imgSrc('certificateImage')} alt="cert preview" className="mn-preview-img" />}
            </div>
          </div>

          {/* FAQs & SEO */}
          <p className="mn-modal-section-title">FAQs & SEO</p>
          <div className="mn-form-group">
            <label className="mn-form-label">FAQs (JSON)</label>
            <textarea className="mn-form-textarea" name="faqs" value={form.faqs} onChange={handle} placeholder='[{"question":"What is the duration?","answer":"6 months"}]' />
          </div>
          <div className="mn-form-grid">
            {fld('Meta Title',       'metaTitle',       'text', 'SEO page title')}
            {fld('Meta Description', 'metaDescription', 'text', 'SEO description')}
          </div>

          {/* Brochure PDF */}
          <p className="mn-modal-section-title">Brochure PDF</p>
          <div className="mn-form-group">
            <label className="mn-form-label">Upload Brochure (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="mn-form-input"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setForm(p => ({ ...p, brochureFile: file }));
              }}
            />
            {preview.brochureUrl && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <a
                  href={preview.brochureUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, color: '#F6881F', fontWeight: 600 }}
                >
                  📄 View Current Brochure
                </a>
                <button
                  type="button"
                  onClick={() => setPreview(p => ({ ...p, brochureUrl: null }))}
                  style={{ fontSize: 12, color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  ✕ Remove
                </button>
              </div>
            )}
            {form.brochureFile instanceof File && (
              <p style={{ fontSize: 12, color: '#48bb78', marginTop: 6, fontWeight: 600 }}>
                ✓ New PDF selected: {form.brochureFile.name}
              </p>
            )}
            <p style={{ fontSize: 11, color: '#a0aec0', marginTop: 4 }}>
              Leave empty to keep existing brochure. Upload new PDF to replace.
            </p>
          </div>

          <div className="mn-form-actions">
            <button type="submit" className="mn-btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Details'}
            </button>
            <button type="button" className="mn-btn-secondary" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ─── MAIN ManageNavbar ───────────────────────────────────────
const ManageNavbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flatLinks,       setFlatLinks]       = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [pageLoading,     setPageLoading]     = useState(true);
  const [editMode,        setEditMode]        = useState(false);
  const [editId,          setEditId]          = useState(null);
  const [formData,        setFormData]        = useState({ title: '', url: '', category: '', parentId: '', badgeText: '', isActive: true, sortOrder: 0, viewAllUrl: '' });
  const [expandedRows,    setExpandedRows]    = useState([]);

  // Read filter from URL param — e.g. ?filter=hidden
  const statusFilter = searchParams.get('filter') || 'all'; // all | active | hidden

  const fetchLinks = async () => {
    try {
      const res = await navbarApi.getNavbarLinks();
      if (res.success) setFlatLinks(res.flatLinks);
    } catch (err) { console.error(err); }
    finally { setPageLoading(false); }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, parentId: formData.parentId ? parseInt(formData.parentId) : null };
      if (editMode) {
        const res = await navbarApi.updateNavbarLink(editId, data);
        if (res.success) toast.success('Link updated!');
      } else {
        const res = await navbarApi.addNavbarLink(data);
        if (res.success) toast.success('Link added!');
      }
      resetForm();
      fetchLinks();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving link'); }
    finally { setLoading(false); }
  };

  const handleEdit = (link) => {
    setEditMode(true);
    setEditId(link.Id);
    setFormData({ title: link.Title, url: link.Url || '', category: link.Category || '', parentId: link.ParentId || '', badgeText: link.BadgeText || '', isActive: link.IsActive, sortOrder: link.SortOrder || 0, viewAllUrl: link.ViewAllUrl || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      const res = await navbarApi.deleteNavbarLink(id);
      if (res.success) { toast.success('Link deleted'); fetchLinks(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Error deleting link'); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await navbarApi.toggleNavbarLinkStatus(id);
      if (res.success) fetchLinks();
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({ title: '', url: '', category: '', parentId: '', badgeText: '', isActive: true, sortOrder: 0, viewAllUrl: '' });
  };

  const toggleRow = (id) => setExpandedRows(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // Apply status filter to ALL links first, then split into parent/children
  const filteredLinks = flatLinks.filter(l => {
    if (statusFilter === 'active') return l.IsActive;
    if (statusFilter === 'hidden') return !l.IsActive;
    return true;
  });

  // For hidden/active filter — show all matching links (parent + children) as flat list
  // For 'all' — keep normal tree structure
  const mainItems = statusFilter === 'all'
    ? flatLinks.filter(l => !l.ParentId)
    : filteredLinks;

  const childrenMap = {};
  flatLinks.forEach(l => {
    if (l.ParentId) {
      childrenMap[l.ParentId] = childrenMap[l.ParentId] || [];
      childrenMap[l.ParentId].push(l);
    }
  });

  return (
    <div className="mn-page">
      {pageLoading && <PageLoader message="Loading navbar links..." />}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Form Card */}
      <div className="mn-card">
        <h2 className="mn-title">Manage Navbar Links</h2>
        <p className="mn-subtitle">Add, edit, delete navbar items and their dropdown children. Manage course/certification/study-abroad details.</p>
        <NavbarLinkForm
          editMode={editMode} editId={editId}
          formData={formData} setFormData={setFormData}
          flatLinks={flatLinks} onSubmit={handleSubmit}
          onCancel={resetForm} loading={loading}
        />
      </div>

      {/* Links Table Card */}
      <div className="mn-card">
        <div className="mn-table-header-row">
          <h3 className="mn-section-title"><FaLink /> Current Links</h3>
          {/* Status Filter Buttons */}
          <div className="mn-filter-group">
            <FaFilter style={{ color: '#718096', fontSize: 13 }} />
            {[
              { key: 'all',    label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'hidden', label: 'Hidden' },
            ].map(f => (
              <button
                key={f.key}
                className={`mn-filter-btn${statusFilter === f.key ? ' mn-filter-btn--active' : ''}`}
                onClick={() => {
                  if (f.key === 'all') searchParams.delete('filter');
                  else searchParams.set('filter', f.key);
                  setSearchParams(searchParams);
                }}
              >
                {f.label}
                <span className="mn-filter-count">
                  {f.key === 'all'    && flatLinks.length}
                  {f.key === 'active' && flatLinks.filter(l => l.IsActive).length}
                  {f.key === 'hidden' && flatLinks.filter(l => !l.IsActive).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mn-table-container">
          <table className="mn-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Category</th>
                <th>Badge</th>
                <th className="mn-td-center">Status</th>
                <th className="mn-td-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mainItems.length === 0 && (
                <tr><td colSpan={6} className="mn-empty-row">No links found</td></tr>
              )}
              {statusFilter !== 'all'
                ? /* Flat list for filtered view */
                  mainItems.map(link => (
                    <tr key={link.Id} className={link.ParentId ? 'mn-tr-child' : 'mn-tr-main'}>
                      <td className="mn-td-title">
                        {link.ParentId && <span style={{ color: '#a0aec0', marginRight: 4 }}>↳</span>}
                        {link.Title}
                        {link.BadgeText && <span className="mn-badge-text">{link.BadgeText}</span>}
                        {link.ParentId && (
                          <span className="mn-parent-label">
                            ({flatLinks.find(l => l.Id === link.ParentId)?.Title || 'Sub-item'})
                          </span>
                        )}
                      </td>
                      <td className="mn-td-url">{link.Url || '—'}</td>
                      <td>
                        {link.Category
                          ? <span className={`mn-category-tag tag-${link.Category}`}>{link.Category}</span>
                          : <span className="mn-category-tag tag-none">—</span>}
                      </td>
                      <td>{link.BadgeText || '—'}</td>
                      <td className="mn-td-center">
                        <button onClick={() => handleToggle(link.Id)} className={`mn-btn-icon ${link.IsActive ? 'status-active' : 'status-inactive'}`}>
                          {link.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </td>
                      <td className="mn-td-actions">
                        {!link.ParentId && (
                          <button onClick={() => navigate(`/admin/navbar-dropdown/${link.Id}`)} className="mn-btn-info" title="Manage Mega Dropdown" style={{ background: '#6366f1', color: '#fff' }}>
                            <FaLayerGroup /> Dropdown
                          </button>
                        )}
                        {link.Category && link.Category !== 'static' && (
                          <button onClick={() => navigate(`/admin/navbar-course-detail/${link.Id}`)} className="mn-btn-info" title="Manage Details">
                            <FaBook /> Details
                          </button>
                        )}
                        <button onClick={() => handleEdit(link)}      className="mn-btn-icon edit"   title="Edit">  <FaEdit />  </button>
                        <button onClick={() => handleDelete(link.Id)} className="mn-btn-icon delete" title="Delete"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                : /* Tree view for 'all' */
                  mainItems.map(link => {
                const children = childrenMap[link.Id] || [];
                const expanded = expandedRows.includes(link.Id);
                return (
                  <React.Fragment key={link.Id}>
                    <tr className="mn-tr-main">
                      <td className="mn-td-title">
                        {children.length > 0 && (
                          <button onClick={() => toggleRow(link.Id)} className="mn-btn-icon toggle">
                            {expanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        )}
                        {link.Title}
                        {link.BadgeText && <span className="mn-badge-text">{link.BadgeText}</span>}
                      </td>
                      <td className="mn-td-url">{link.Url || '—'}</td>
                      <td>
                        {link.Category
                          ? <span className={`mn-category-tag tag-${link.Category}`}>{link.Category}</span>
                          : <span className="mn-category-tag tag-none">—</span>}
                      </td>
                      <td>{link.BadgeText || '—'}</td>
                      <td className="mn-td-center">
                        <button onClick={() => handleToggle(link.Id)} className={`mn-btn-icon ${link.IsActive ? 'status-active' : 'status-inactive'}`}>
                          {link.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </td>
                      <td className="mn-td-actions">
                        <button onClick={() => navigate(`/admin/navbar-dropdown/${link.Id}`)} className="mn-btn-info" title="Manage Mega Dropdown" style={{ background: '#6366f1', color: '#fff' }}>
                          <FaLayerGroup /> Dropdown
                        </button>
                        {link.Category && link.Category !== 'static' && (
                          <button onClick={() => navigate(`/admin/navbar-course-detail/${link.Id}`)} className="mn-btn-info" title="Manage Details">
                            <FaBook /> Details
                          </button>
                        )}
                        <button onClick={() => handleEdit(link)}       className="mn-btn-icon edit"   title="Edit">  <FaEdit />  </button>
                        <button onClick={() => handleDelete(link.Id)}  className="mn-btn-icon delete" title="Delete"><FaTrash /></button>
                      </td>
                    </tr>

                    {expanded && children.map(child => (
                      <tr key={child.Id} className="mn-tr-child">
                        <td>↳ {child.Title}</td>
                        <td className="mn-td-url">{child.Url || '—'}</td>
                        <td>
                          {child.Category
                            ? <span className={`mn-category-tag tag-${child.Category}`}>{child.Category}</span>
                            : <span className="mn-category-tag tag-none">—</span>}
                        </td>
                        <td>{child.BadgeText || '—'}</td>
                        <td className="mn-td-center">
                          <button onClick={() => handleToggle(child.Id)} className={`mn-btn-icon ${child.IsActive ? 'status-active' : 'status-inactive'}`}>
                            {child.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        </td>
                        <td className="mn-td-actions">
                          {child.Category && child.Category !== 'static' && (
                            <button onClick={() => navigate(`/admin/navbar-course-detail/${child.Id}`)} className="mn-btn-info" title="Manage Details">
                              <FaBook /> Details
                            </button>
                          )}
                          <button onClick={() => handleEdit(child)}       className="mn-btn-icon edit"   title="Edit">  <FaEdit />  </button>
                          <button onClick={() => handleDelete(child.Id)}  className="mn-btn-icon delete" title="Delete"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageNavbar;
