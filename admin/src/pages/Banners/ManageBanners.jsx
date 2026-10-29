import React, { useState, useEffect } from 'react';
import {
  FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus, FaTimes,
  FaEye, FaEyeSlash, FaTag, FaHeading, FaAlignLeft,
  FaMousePointer, FaImage, FaVideo, FaList, FaPaintBrush,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminBannerApi } from '../../api/adminApi';
import axios from 'axios';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';

const CDN_URL = 'https://host0008-001-site1.qtempurl.com/api/uploadfile';

const uploadToCDN = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post(CDN_URL, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const d = res.data;
  let url = null;
  if (Array.isArray(d?.result)) {
    url = d.result[0]?.variants?.[0] || d.result[0]?.url;
  } else if (d?.result?.variants) {
    url = Array.isArray(d.result.variants) ? d.result.variants[0] : d.result.variants;
  } else if (d?.url) {
    url = d.url;
  } else if (typeof d?.result === 'string') {
    url = d.result;
  }
  if (!url) {
    console.error('CDN response structure unexpected:', d);
    throw new Error(`CDN response: ${JSON.stringify(d)}`);
  }
  return url;
};

const EMPTY = {
  badgeText: '', headingLine1: '', headingLine2: '',
  subText1: '', subText2: '',
  btn1Text: '', btn1Link: '', btn2Text: '', btn2Link: '',
  bannerImage: null, bgImage: null,
  videoUrl: '', videoCardLabel: '', videoCardTitle: '',
  sortOrder: '0', isActive: true,
};

const Field = ({ label, name, value, onChange, type = 'text', hint, placeholder }) => (
  <div>
    <label className="mb-label">{label}</label>
    <input className="mb-input" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder || ''} />
    {hint && <p className="mb-hint">{hint}</p>}
  </div>
);

// ─── BannerForm ─────────────────────────────────────────────
const BannerForm = ({ editId, initial, onSaved, onCancel }) => {
  const [form, setForm]         = useState(initial || EMPTY);
  const [previews, setPreviews] = useState({ bannerImage: null, bgImage: null });
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setForm(initial || EMPTY);
    setPreviews({ bannerImage: null, bgImage: null });
  }, [initial, editId]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setForm(p => ({ ...p, [name]: files[0] }));
      setPreviews(p => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bannerImageUrl = form.bannerImage instanceof File
        ? await uploadToCDN(form.bannerImage)
        : (initial?.BannerImage || null);

      const bgImageUrl = form.bgImage instanceof File
        ? await uploadToCDN(form.bgImage)
        : (initial?.BgImage || null);

      const payload = {
        badgeText:      form.badgeText      || null,
        headingLine1:   form.headingLine1   || null,
        headingLine2:   form.headingLine2   || null,
        subText1:       form.subText1       || null,
        subText2:       form.subText2       || null,
        btn1Text:       form.btn1Text       || null,
        btn1Link:       form.btn1Link       || null,
        btn2Text:       form.btn2Text       || null,
        btn2Link:       form.btn2Link       || null,
        bannerImage:    bannerImageUrl,
        bgImage:        bgImageUrl,
        videoUrl:       form.videoUrl       || null,
        videoCardLabel: form.videoCardLabel || null,
        videoCardTitle: form.videoCardTitle || null,
        sortOrder:      parseInt(form.sortOrder) || 0,
        isActive:       form.isActive ? 1 : 0,
      };

      let data;
      if (editId) {
        data = await adminBannerApi.updateBanner(editId, payload);
      } else {
        data = await adminBannerApi.addBanner(payload);
      }
      if (data.success) {
        toast.success(editId ? 'Banner updated!' : 'Banner added!');
        onSaved();
      } else {
        toast.error(data.message || 'Error saving banner');
      }
    } catch (err) {
      toast.error(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const imgSrc = (fieldName, dbField) => {
    if (previews[fieldName]) return previews[fieldName];
    if (initial && initial[dbField]) return initial[dbField];
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-form-title">
        {editId ? <><FaEdit /> Edit Banner</> : <><FaPlus /> Add New Banner</>}
      </h3>
      <p className="mb-form-hint">
        All fields are optional — leave blank to skip that element on the website.
      </p>

      {/* Badge */}
      <div className="mb-sec">
        <p className="mb-sec-label"><FaTag className="mb-sec-icon" /> Badge (Green Pill)</p>
        <Field label="Badge Text" name="badgeText" value={form.badgeText} onChange={handle}
          placeholder="e.g. Mentoringminds 🏆 Trusted by 50,000+ Students"
          hint="Leave blank to hide the badge" />
      </div>

      {/* Heading */}
      <div className="mb-sec">
        <p className="mb-sec-label"><FaHeading className="mb-sec-icon" /> Heading</p>
        <div className="mb-grid-2">
          <Field label="Heading Line 1 (Normal)" name="headingLine1" value={form.headingLine1} onChange={handle}
            placeholder="e.g. Build a Career That" />
          <Field label="Heading Line 2 (Orange Color)" name="headingLine2" value={form.headingLine2} onChange={handle}
            placeholder="e.g. Companies Want to Hire" />
        </div>
      </div>

      {/* Sub Text */}
      <div className="mb-sec">
        <p className="mb-sec-label"><FaAlignLeft className="mb-sec-icon" /> Description</p>
        <div style={{ marginBottom: '12px' }}>
          <label className="mb-label">Bold Sub-text</label>
          <input className="mb-input" name="subText1" value={form.subText1} onChange={handle}
            placeholder="e.g. Master AI, Data Science, Software Development..." />
        </div>
        <div>
          <label className="mb-label">Description Paragraph</label>
          <textarea className="mb-textarea" name="subText2" value={form.subText2} onChange={handle}
            placeholder="e.g. Mentoring Minds offers industry-focused certification programs..." />
        </div>
      </div>

      {/* Buttons */}
      <div className="mb-sec">
        <p className="mb-sec-label"><FaMousePointer className="mb-sec-icon" /> Buttons (both optional)</p>
        <div className="mb-grid-2">
          <Field label="Button 1 Text" name="btn1Text" value={form.btn1Text} onChange={handle} placeholder="e.g. Book Free Counselling" />
          <Field label="Button 1 Link" name="btn1Link" value={form.btn1Link} onChange={handle} placeholder="/apply" />
          <Field label="Button 2 Text" name="btn2Text" value={form.btn2Text} onChange={handle} placeholder="e.g. Explore Courses" />
          <Field label="Button 2 Link" name="btn2Link" value={form.btn2Link} onChange={handle} placeholder="/courses" />
        </div>
      </div>

      {/* Images */}
      <div className="mb-sec">
        <p className="mb-sec-label"><FaImage className="mb-sec-icon" /> Images (optional)</p>
        <div className="mb-grid-2">
          <div>
            <label className="mb-label">Right-side Banner Image</label>
            <input className="mb-input" type="file" name="bannerImage" accept="image/*" onChange={handleFile} />
            {imgSrc('bannerImage', 'BannerImage') && (
              <img src={imgSrc('bannerImage', 'BannerImage')} alt="preview" className="mb-img-preview" />
            )}
          </div>
          <div>
            <label className="mb-label">Background Image (overrides default)</label>
            <input className="mb-input" type="file" name="bgImage" accept="image/*" onChange={handleFile} />
            {imgSrc('bgImage', 'BgImage') && (
              <img src={imgSrc('bgImage', 'BgImage')} alt="preview" className="mb-img-preview" />
            )}
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="mb-sec">
        <p className="mb-sec-label"><FaVideo className="mb-sec-icon" /> Video Popup (Watch Button) — optional</p>
        <p className="mb-form-hint">
          Leave all 3 blank to hide the Watch button on this banner.
        </p>
        <div className="mb-grid-3">
          <div className="mb-grid-full">
            <Field label="Video URL (YouTube embed or direct video link)" name="videoUrl" value={form.videoUrl} onChange={handle}
              placeholder="https://www.youtube.com/embed/xxxx" />
          </div>
          <Field label="Video Card Label (small text)" name="videoCardLabel" value={form.videoCardLabel} onChange={handle}
            placeholder="Masterclass Preview" />
          <Field label="Video Card Title (bold text)" name="videoCardTitle" value={form.videoCardTitle} onChange={handle}
            placeholder="Watch Free Session" />
        </div>
      </div>

      {/* Meta */}
      <div className="mb-meta-row">
        <div>
          <label className="mb-label">Sort Order</label>
          <input className="mb-input-sm" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
        </div>
        <div className="mb-checkbox-row">
          <input type="checkbox" id="isActiveChk" name="isActive" checked={form.isActive} onChange={handle} />
          <label htmlFor="isActiveChk" className="mb-label-inline">Active (visible on website)</label>
        </div>
      </div>

      <div className="mb-form-actions">
        <button type="submit" className="mb-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : editId ? 'Update Banner' : 'Add Banner'}
        </button>
        {onCancel && (
          <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

// ─── Main ManageBanners ─────────────────────────────────────
const ManageBanners = () => {
  const [banners, setBanners]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editBanner, setEditBanner] = useState(null);

  const fetch_ = () => {
    setLoading(true);
    adminBannerApi.getBanners()
      .then(d => { if (d.success) setBanners(d.banners || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const handleToggle = async (id) => {
    await adminBannerApi.toggleBanner(id);
    fetch_();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    const data = await adminBannerApi.deleteBanner(id);
    if (data.success) { toast.success('Banner deleted'); fetch_(); }
    else toast.error(data.message || 'Delete failed');
  };

  const startEdit = (banner) => {
    setShowForm(false);
    setEditBanner(banner);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSaved = () => { setShowForm(false); setEditBanner(null); fetch_(); };

  return (
    <div className="mb-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Form panel */}
      <div className="mb-card">
        {editBanner ? (
          <BannerForm
            editId={editBanner.Id}
            initial={{
              badgeText: editBanner.BadgeText || '', headingLine1: editBanner.HeadingLine1 || '',
              headingLine2: editBanner.HeadingLine2 || '', subText1: editBanner.SubText1 || '',
              subText2: editBanner.SubText2 || '', btn1Text: editBanner.Btn1Text || '',
              btn1Link: editBanner.Btn1Link || '', btn2Text: editBanner.Btn2Text || '',
              btn2Link: editBanner.Btn2Link || '', bannerImage: null, bgImage: null,
              videoUrl: editBanner.VideoUrl || '', videoCardLabel: editBanner.VideoCardLabel || '',
              videoCardTitle: editBanner.VideoCardTitle || '',
              sortOrder: String(editBanner.SortOrder || 0), isActive: !!editBanner.IsActive,
              BannerImage: editBanner.BannerImage, BgImage: editBanner.BgImage,
            }}
            onSaved={onSaved}
            onCancel={() => setEditBanner(null)}
          />
        ) : showForm ? (
          <BannerForm onSaved={onSaved} onCancel={() => setShowForm(false)} />
        ) : (
          <div className="mb-header-row">
            <div>
              <h2 className="mb-title">
                <FaPaintBrush style={{ color: '#F6881F', marginRight: 8 }} />
                Manage Banners
              </h2>
              <p className="mb-subtitle">Add, edit, reorder and toggle homepage carousel banners. All fields are optional.</p>
            </div>
            <button className="mb-btn-primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Add New Banner
            </button>
          </div>
        )}
      </div>

      {/* Banners list */}
      {!showForm && !editBanner && (
        <div className="mb-card">
          <h3 className="mb-list-title">
            <FaList /> All Banners ({banners.length})
          </h3>
          {loading ? (
            <PageLoader message="Loading banners..." />
          ) : banners.length === 0 ? (
            <p className="mb-empty">No banners yet. Add one above!</p>
          ) : (
            <div className="mb-list">
              {banners.map(b => (
                <div
                  key={b.Id}
                  className={`mb-item ${b.IsActive ? 'mb-item--active' : 'mb-item--inactive'}`}
                >
                  {/* Thumbnail */}
                  <div className="mb-thumb">
                    {b.BannerImage
                      ? <img
                          src={b.BannerImage.startsWith('http') ? b.BannerImage : `${BASE}${b.BannerImage}`}
                          alt=""
                        />
                      : <span className="mb-thumb-noimg">No Image</span>}
                  </div>

                  {/* Content */}
                  <div className="mb-content">
                    <div className="mb-badges">
                      {b.BadgeText && (
                        <span className="mb-badge-green">
                          {b.BadgeText.slice(0, 40)}{b.BadgeText.length > 40 ? '…' : ''}
                        </span>
                      )}
                      <span className={b.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                        {b.IsActive ? 'Active' : 'Hidden'}
                      </span>
                      {b.VideoUrl && (
                        <span className="mb-badge-video">
                          <FaVideo /> Video
                        </span>
                      )}
                    </div>
                    <p className="mb-item-title">
                      {b.HeadingLine1 || b.HeadingLine2
                        ? `${b.HeadingLine1 || ''} ${b.HeadingLine2 || ''}`.trim().slice(0, 60)
                        : <em className="mb-item-title--empty">No heading</em>}
                    </p>
                    <p className="mb-item-meta">
                      Sort: {b.SortOrder} &nbsp;|&nbsp;
                      {b.Btn1Text && `Btn1: "${b.Btn1Text}"`}{b.Btn1Text && b.Btn2Text && ' · '}
                      {b.Btn2Text && `Btn2: "${b.Btn2Text}"`}
                      {!b.Btn1Text && !b.Btn2Text && 'No buttons'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mb-item-actions">
                    <button
                      onClick={() => handleToggle(b.Id)}
                      title={b.IsActive ? 'Hide' : 'Show'}
                      className={`mb-btn-toggle ${b.IsActive ? 'mb-btn-toggle--active' : 'mb-btn-toggle--inactive'}`}
                    >
                      {b.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button onClick={() => startEdit(b)} title="Edit" className="mb-btn-edit">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(b.Id)} title="Delete" className="mb-btn-delete">
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

export default ManageBanners;
