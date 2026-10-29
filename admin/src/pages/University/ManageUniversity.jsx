import React, { useState, useEffect } from 'react';
import {
  FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus,
  FaSave, FaImage, FaUniversity, FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminUniversityApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageUniversity.css';

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

const EMPTY_SLIDE = { badgeText: '', heading: '', description: '', btnText: '', btnLink: '', sortOrder: '0', isActive: true };
const EMPTY_LOGO  = { name: '', logoFile: null, logoUrl: '', sortOrder: '0' };

// ── Slide Form ────────────────────────────────────────────────
const SlideForm = ({ editData, onSaved, onCancel }) => {
  const [form, setForm]   = useState(EMPTY_SLIDE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editData ? {
      badgeText:   editData.BadgeText   || '',
      heading:     editData.Heading     || '',
      description: editData.Description || '',
      btnText:     editData.BtnText     || '',
      btnLink:     editData.BtnLink     || '',
      sortOrder:   String(editData.SortOrder ?? 0),
      isActive:    !!editData.IsActive,
    } : EMPTY_SLIDE);
  }, [editData]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.heading.trim()) return toast.error('Heading is required');
    setSaving(true);
    try {
      const payload = {
        badgeText: form.badgeText || null, heading: form.heading,
        description: form.description || null, btnText: form.btnText || null,
        btnLink: form.btnLink || null, sortOrder: parseInt(form.sortOrder) || 0,
        isActive: form.isActive,
      };
      let res;
      if (editData) {
        res = await adminUniversityApi.updateSlide(editData.Id, payload);
      } else {
        res = await adminUniversityApi.addSlide(payload);
      }
      if (res?.success || res?.data?.success) {
        toast.success(editData ? 'Slide updated!' : 'Slide added!');
        onSaved();
      } else {
        toast.error(res?.message || res?.data?.message || 'Error');
      }
    } catch (err) {
      toast.error(err.message || 'Server error');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="mu-add-logo-form">
      <h4 className="mu-sec-title">{editData ? <><FaEdit /> Edit Slide</> : <><FaPlus /> Add New Slide</>}</h4>
      <div className="mu-grid-2">
        <div>
          <label className="mu-label">Badge Text (green pill)</label>
          <input className="mu-input" name="badgeText" value={form.badgeText} onChange={handle} placeholder="Earn Certificates from" />
        </div>
        <div>
          <label className="mu-label">Heading *</label>
          <input className="mu-input" name="heading" value={form.heading} onChange={handle} placeholder="Prestigious universities" required />
        </div>
        <div>
          <label className="mu-label">Button Text</label>
          <input className="mu-input" name="btnText" value={form.btnText} onChange={handle} placeholder="View all Universities" />
        </div>
        <div>
          <label className="mu-label">Button Link</label>
          <input className="mu-input" name="btnLink" value={form.btnLink} onChange={handle} placeholder="/universities" />
        </div>
        <div>
          <label className="mu-label">Sort Order</label>
          <input className="mu-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
        </div>
        <div className="mu-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
          <input type="checkbox" id="slideActive" name="isActive" checked={form.isActive} onChange={handle} />
          <label htmlFor="slideActive" className="mu-label-inline">Active (visible on website)</label>
        </div>
      </div>
      <div>
        <label className="mu-label">Description</label>
        <textarea className="mu-textarea" name="description" value={form.description} onChange={handle} placeholder="We partner with world-renowned universities..." rows={3} />
      </div>
      <div className="mu-form-actions" style={{ marginTop: 14 }}>
        <button type="submit" className="mu-btn-primary" disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : editData ? 'Update Slide' : 'Add Slide'}
        </button>
        {onCancel && <button type="button" className="mu-btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

// ── Logo Form (inside slide) ──────────────────────────────────
const LogoForm = ({ slideId, editData, onSaved, onCancel }) => {
  const [form, setForm]     = useState(EMPTY_LOGO);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    setForm(editData ? {
      name: editData.Name || '', logoFile: null,
      logoUrl: editData.LogoUrl || '', sortOrder: String(editData.SortOrder ?? 0),
    } : EMPTY_LOGO);
    setPreview(editData?.LogoUrl || null);
  }, [editData]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) { setForm(p => ({ ...p, logoFile: file })); setPreview(URL.createObjectURL(file)); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = form.logoUrl || null;
      if (form.logoFile instanceof File) logoUrl = await uploadToCDN(form.logoFile);
      const payload = { name: form.name || null, logoUrl, sortOrder: parseInt(form.sortOrder) || 0, isActive: true };
      let res;
      if (editData) {
        res = await adminUniversityApi.updateLogo(editData.Id, payload);
      } else {
        res = await adminUniversityApi.addLogo(slideId, payload);
      }
      if (res?.success || res?.data?.success) {
        toast.success(editData ? 'Logo updated!' : 'Logo added!');
        onSaved();
      } else {
        toast.error(res?.message || 'Error');
      }
    } catch (err) { toast.error(err.message || 'Server error'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} style={{ background: '#f9f9f9', borderRadius: 10, padding: '14px 16px', marginBottom: 12, border: '1px dashed #e0e0e0' }}>
      <div className="mu-grid-2">
        <div>
          <label className="mu-label">University Name</label>
          <input className="mu-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. IIT Kharagpur" />
        </div>
        <div>
          <label className="mu-label">Sort Order</label>
          <input className="mu-input" type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label className="mu-label">Logo Image</label>
        <input className="mu-input" type="file" accept="image/*" onChange={handleFile} />
        {preview && <img src={preview} alt="preview" className="mu-img-preview" />}
      </div>
      <div className="mu-form-actions">
        <button type="submit" className="mu-btn-primary" disabled={saving}>{saving ? 'Saving...' : editData ? 'Update Logo' : 'Add Logo'}</button>
        {onCancel && <button type="button" className="mu-btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

// ── Slide Row (expandable with logos) ────────────────────────
const SlideRow = ({ slide, onEdit, onDelete, onToggle, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [showLogoForm, setShowLogoForm] = useState(false);
  const [editLogo, setEditLogo]         = useState(null);
  const [logos, setLogos]               = useState(slide.logos || []);

  useEffect(() => { setLogos(slide.logos || []); }, [slide]);

  const fetchLogos = async () => {
    try {
      const res = await adminUniversityApi.getSlides();
      const found = (res?.slides || res?.data?.slides || []).find(s => s.Id === slide.Id);
      if (found) setLogos(found.logos || []);
    } catch {}
  };

  const handleDeleteLogo = async (logoId) => {
    if (!window.confirm('Delete this logo?')) return;
    try {
      await adminUniversityApi.deleteLogo(logoId);
      toast.success('Logo deleted');
      fetchLogos();
      onRefresh();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className={`mu-item ${slide.IsActive ? 'mu-item--active' : 'mu-item--inactive'}`} style={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>

      {/* Slide header row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {slide.BadgeText && <span style={{ background: '#389444', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'inline-block' }}>{slide.BadgeText}</span>}
          <p className="mu-item-title" style={{ margin: '4px 0 2px' }}>{slide.Heading || <em>No heading</em>}</p>
          {slide.Description && <p className="mu-item-meta" style={{ fontSize: 12, color: '#888' }}>{slide.Description.slice(0, 80)}...</p>}
          <p className="mu-item-meta">Sort: {slide.SortOrder} | Logos: {logos.length}</p>
        </div>
        <div className="mu-item-actions" style={{ flexShrink: 0 }}>
          <button className={`mu-btn-toggle ${slide.IsActive ? 'mu-btn-toggle--active' : 'mu-btn-toggle--inactive'}`} onClick={() => onToggle(slide.Id)}>
            {slide.IsActive ? <FaToggleOn /> : <FaToggleOff />}
          </button>
          <button className="mu-btn-edit" onClick={() => onEdit(slide)}><FaEdit /> Edit</button>
          <button className="mu-btn-delete" onClick={() => onDelete(slide.Id)}><FaTrash /> Delete</button>
          <button className="mu-btn-edit" style={{ background: '#ebf4ff', color: '#2b6cb0' }} onClick={() => setExpanded(p => !p)}>
            {expanded ? <FaChevronUp /> : <FaChevronDown />} Logos
          </button>
        </div>
      </div>

      {/* Logos panel */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '14px 16px', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}><FaImage /> Logos in this slide</span>
            <button className="mu-btn-primary" onClick={() => { setShowLogoForm(true); setEditLogo(null); }}>
              <FaPlus /> Add Logo
            </button>
          </div>

          {(showLogoForm || editLogo) && (
            <LogoForm
              slideId={slide.Id}
              editData={editLogo}
              onSaved={() => { setShowLogoForm(false); setEditLogo(null); fetchLogos(); onRefresh(); }}
              onCancel={() => { setShowLogoForm(false); setEditLogo(null); }}
            />
          )}

          {logos.length === 0 ? (
            <p className="mu-empty" style={{ margin: 0, padding: '8px 0' }}>No logos yet. Add one above!</p>
          ) : (
            <div className="mu-list" style={{ gap: 8 }}>
              {logos.map(logo => (
                <div key={logo.Id} className="mu-item mu-item--active" style={{ padding: '10px 12px' }}>
                  <div className="mu-thumb" style={{ width: 60, height: 36 }}>
                    {logo.LogoUrl
                      ? <img src={logo.LogoUrl} alt={logo.Name || 'logo'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span className="mu-thumb-noimg">No Img</span>}
                  </div>
                  <div className="mu-content">
                    <p className="mu-item-title" style={{ fontSize: 13 }}>{logo.Name || <em>No name</em>}</p>
                    <p className="mu-item-meta">Sort: {logo.SortOrder}</p>
                  </div>
                  <div className="mu-item-actions">
                    <button className="mu-btn-edit" onClick={() => { setEditLogo(logo); setShowLogoForm(false); }}><FaEdit /></button>
                    <button className="mu-btn-delete" onClick={() => handleDeleteLogo(logo.Id)}><FaTrash /></button>
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

// ── Main ManageUniversity ─────────────────────────────────────
const ManageUniversity = () => {
  const [slides, setSlides]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editSlide, setEditSlide]   = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await adminUniversityApi.getSlides();
      const data = res?.slides || res?.data?.slides || [];
      setSlides(data);
    } catch { toast.error('Failed to load slides'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggle = async (id) => {
    try { await adminUniversityApi.toggleSlide(id); fetchAll(); }
    catch { toast.error('Toggle failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slide and all its logos?')) return;
    try {
      await adminUniversityApi.deleteSlide(id);
      toast.success('Slide deleted'); fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const onSaved = () => { setShowForm(false); setEditSlide(null); fetchAll(); };

  if (loading) return <PageLoader message="Loading university slides..." />;

  return (
    <div className="mu-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mu-card">
        <div className="mu-header-row" style={{ marginBottom: showForm || editSlide ? 20 : 0 }}>
          <div>
            <h2 className="mu-title"><FaUniversity style={{ color: '#F6881F', marginRight: 8 }} />Manage University Section</h2>
            <p className="mu-subtitle">Har slide ka apna badge, heading, description, button aur logos hote hain. Poora card slide hoga.</p>
          </div>
          {!showForm && !editSlide && (
            <button className="mu-btn-primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Slide
            </button>
          )}
        </div>

        {(showForm || editSlide) && (
          <SlideForm
            editData={editSlide}
            onSaved={onSaved}
            onCancel={() => { setShowForm(false); setEditSlide(null); }}
          />
        )}
      </div>

      <div className="mu-card">
        <h3 className="mu-list-title"><FaImage /> All Slides ({slides.length})</h3>
        {slides.length === 0 ? (
          <p className="mu-empty">No slides yet. Add one above!</p>
        ) : (
          <div className="mu-list">
            {slides.map(slide => (
              <SlideRow
                key={slide.Id}
                slide={slide}
                onEdit={(s) => { setEditSlide(s); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onRefresh={fetchAll}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUniversity;
