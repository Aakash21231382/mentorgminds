import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaList,
  FaTrophy, FaSave, FaVideo, FaImage,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminSuccessSectionApi } from '../../api/adminApi';
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

const defaultStoryForm = {
  quote: '', descStrong: '', descRest: '', name: '', program: '',
  roleText: '', imageFile: null, imageUrl: '', videoLink: '',
  sortOrder: '0', isActive: true,
};

// ── Config Form (Heading, Stats, Banner) ──────────────────────
const ConfigForm = ({ config, onSaved }) => {
  const [form, setForm] = useState({
    tagText: '', headingNormal: '', headingOrange: '',
    stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '',
    stat3Value: '', stat3Label: '', stat4Value: '', stat4Label: '',
    bannerTopLabel: '', bannerHeading: '', bannerDesc: '', bannerBtnText: '', bannerBtnLink: '',
    isActive: true,
  });
  // learner images: up to 4, each can be a File or existing URL string
  const [learnerSlots, setLearnerSlots] = useState(['', '', '', '']);
  const [learnerFiles, setLearnerFiles] = useState([null, null, null, null]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        tagText:        config.TagText        || '',
        headingNormal:  config.HeadingNormal  || '',
        headingOrange:  config.HeadingOrange  || '',
        stat1Value:     config.Stat1Value     || '',
        stat1Label:     config.Stat1Label     || '',
        stat2Value:     config.Stat2Value     || '',
        stat2Label:     config.Stat2Label     || '',
        stat3Value:     config.Stat3Value     || '',
        stat3Label:     config.Stat3Label     || '',
        stat4Value:     config.Stat4Value     || '',
        stat4Label:     config.Stat4Label     || '',
        bannerTopLabel: config.BannerTopLabel || '',
        bannerHeading:  config.BannerHeading  || '',
        bannerDesc:     config.BannerDesc     || '',
        bannerBtnText:  config.BannerBtnText  || '',
        bannerBtnLink:  config.BannerBtnLink  || '',
        isActive:       config.IsActive !== undefined ? !!config.IsActive : true,
      });
      // Parse existing learner images
      const existing = config.LearnerImages
        ? config.LearnerImages.split(',').map(s => s.trim())
        : [];
      const slots = ['', '', '', ''];
      existing.slice(0, 4).forEach((url, i) => { slots[i] = url; });
      setLearnerSlots(slots);
      setLearnerFiles([null, null, null, null]);
    }
  }, [config]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLearnerFile = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newFiles = [...learnerFiles];
    newFiles[idx] = file;
    setLearnerFiles(newFiles);
    // Show local preview
    const newSlots = [...learnerSlots];
    newSlots[idx] = URL.createObjectURL(file);
    setLearnerSlots(newSlots);
  };

  const removeLearnerSlot = (idx) => {
    const newSlots = [...learnerSlots];
    const newFiles = [...learnerFiles];
    newSlots[idx] = '';
    newFiles[idx] = null;
    setLearnerSlots(newSlots);
    setLearnerFiles(newFiles);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upload any new files to CDN
      const finalUrls = await Promise.all(
        learnerSlots.map(async (slot, idx) => {
          if (learnerFiles[idx] instanceof File) {
            return await uploadToCDN(learnerFiles[idx]);
          }
          // Keep existing URL (not a blob preview)
          return slot && !slot.startsWith('blob:') ? slot : '';
        })
      );
      const learnerImages = finalUrls.filter(Boolean).join(',') || null;

      const payload = {
        tagText:        form.tagText        || null,
        headingNormal:  form.headingNormal  || null,
        headingOrange:  form.headingOrange  || null,
        stat1Value:     form.stat1Value     || null,
        stat1Label:     form.stat1Label     || null,
        stat2Value:     form.stat2Value     || null,
        stat2Label:     form.stat2Label     || null,
        stat3Value:     form.stat3Value     || null,
        stat3Label:     form.stat3Label     || null,
        stat4Value:     form.stat4Value     || null,
        stat4Label:     form.stat4Label     || null,
        bannerTopLabel: form.bannerTopLabel || null,
        bannerHeading:  form.bannerHeading  || null,
        bannerDesc:     form.bannerDesc     || null,
        bannerBtnText:  form.bannerBtnText  || null,
        bannerBtnLink:  form.bannerBtnLink  || null,
        learnerImages,
        isActive:       form.isActive ? 1 : 0,
      };
      const data = await adminSuccessSectionApi.saveConfig(payload);
      if (data.success) { toast.success('Config saved!'); onSaved(); }
      else toast.error(data.message || 'Error');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} className="mc-form">
      <h3 className="mb-form-title">Section Config (Heading, Stats, Banner)</h3>

      {/* Heading */}
      <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <legend style={{ fontWeight: 700, padding: '0 8px' }}>Top Heading</legend>
        <div className="mb-grid-2">
          <div>
            <label className="mb-label">Tag Text (green pill)</label>
            <input className="mb-input" name="tagText" value={form.tagText} onChange={handle} placeholder="YOUR GOALS ARE OUR GOALS" />
          </div>
          <div>
            <label className="mb-label">Heading Normal (black)</label>
            <input className="mb-input" name="headingNormal" value={form.headingNormal} onChange={handle} placeholder="Invest in yourself today. Unlock" />
          </div>
          <div>
            <label className="mb-label">Heading Orange</label>
            <input className="mb-input" name="headingOrange" value={form.headingOrange} onChange={handle} placeholder="success for a lifetime." />
          </div>
        </div>
      </fieldset>

      {/* Stats */}
      <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <legend style={{ fontWeight: 700, padding: '0 8px' }}>4 Stats</legend>
        <div className="mb-grid-2">
          <div>
            <label className="mb-label">Stat 1 Value</label>
            <input className="mb-input" name="stat1Value" value={form.stat1Value} onChange={handle} placeholder="15 Million" />
          </div>
          <div>
            <label className="mb-label">Stat 1 Label</label>
            <input className="mb-input" name="stat1Label" value={form.stat1Label} onChange={handle} placeholder="STUDENTS AND ALUMNI" />
          </div>
          <div>
            <label className="mb-label">Stat 2 Value</label>
            <input className="mb-input" name="stat2Value" value={form.stat2Value} onChange={handle} placeholder="4.6/5" />
          </div>
          <div>
            <label className="mb-label">Stat 2 Label</label>
            <input className="mb-input" name="stat2Label" value={form.stat2Label} onChange={handle} placeholder="PROGRAM RATING" />
          </div>
          <div>
            <label className="mb-label">Stat 3 Value</label>
            <input className="mb-input" name="stat3Value" value={form.stat3Value} onChange={handle} placeholder="50%" />
          </div>
          <div>
            <label className="mb-label">Stat 3 Label</label>
            <input className="mb-input" name="stat3Label" value={form.stat3Label} onChange={handle} placeholder="AVG. HIKE POST PROGRAM*" />
          </div>
          <div>
            <label className="mb-label">Stat 4 Value</label>
            <input className="mb-input" name="stat4Value" value={form.stat4Value} onChange={handle} placeholder="4500+" />
          </div>
          <div>
            <label className="mb-label">Stat 4 Label</label>
            <input className="mb-input" name="stat4Label" value={form.stat4Label} onChange={handle} placeholder="HIRING COMPANIES*" />
          </div>
        </div>
      </fieldset>

      {/* Bottom Banner */}
      <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <legend style={{ fontWeight: 700, padding: '0 8px' }}>Bottom Learners Banner</legend>
        <div className="mb-grid-2">
          <div>
            <label className="mb-label">Banner Top Label</label>
            <input className="mb-input" name="bannerTopLabel" value={form.bannerTopLabel} onChange={handle} placeholder="WHAT OUR LEARNERS SAY" />
          </div>
          <div>
            <label className="mb-label">Banner Heading</label>
            <input className="mb-input" name="bannerHeading" value={form.bannerHeading} onChange={handle} placeholder="From promotions to transitions..." />
          </div>
          <div className="mb-grid-full">
            <label className="mb-label">Banner Description</label>
            <textarea className="mb-textarea" name="bannerDesc" value={form.bannerDesc} onChange={handle} rows={2} placeholder="Our learners share their experiences..." />
          </div>
          <div>
            <label className="mb-label">Button Text</label>
            <input className="mb-input" name="bannerBtnText" value={form.bannerBtnText} onChange={handle} placeholder="Watch Testimonials" />
          </div>
          <div>
            <label className="mb-label">Button Link / Video URL</label>
            <input className="mb-input" name="bannerBtnLink" value={form.bannerBtnLink} onChange={handle} placeholder="https://youtube.com/..." />
          </div>
          <div className="mb-grid-full">
            <label className="mb-label"><FaImage style={{ marginRight: 6 }} /> Learner Avatar Images (max 4)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 6 }}>
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} style={{ border: '1px dashed #cbd5e0', borderRadius: 10, padding: 10, textAlign: 'center', background: '#f8fafc' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#718096', marginBottom: 6 }}>Image {idx + 1}</p>
                  {learnerSlots[idx] ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={learnerSlots[idx]}
                        alt={`learner-${idx + 1}`}
                        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F6881F', display: 'block', margin: '0 auto 6px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeLearnerSlot(idx)}
                        style={{ fontSize: 11, background: '#fed7d7', color: '#c53030', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
                      >Remove</button>
                    </div>
                  ) : (
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaImage style={{ color: '#a0aec0', fontSize: 20 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#F6881F', fontWeight: 600 }}>Upload</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLearnerFile(idx, e)} />
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="mb-hint" style={{ marginTop: 6 }}>Yeh images bottom banner mein overlapping circles ki tarah dikhti hain</p>
          </div>
          <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
            <input type="checkbox" id="configActive" name="isActive" checked={form.isActive} onChange={handle} />
            <label htmlFor="configActive" className="mb-label-inline">Active (section visible)</label>
          </div>
        </div>
      </fieldset>

      <div className="mb-form-actions">
        <button type="submit" className="mb-btn-primary" disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save Config'}
        </button>
      </div>
    </form>
  );
};

// ── Story Form ────────────────────────────────────────────────
const StoryForm = ({ editData, onSaved, onCancel }) => {
  const [form, setForm]         = useState(defaultStoryForm);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        quote:      editData.Quote      || '',
        descStrong: editData.DescStrong || '',
        descRest:   editData.DescRest   || '',
        name:       editData.Name       || '',
        program:    editData.Program    || '',
        roleText:   editData.RoleText   || '',
        imageFile:  null,
        imageUrl:   editData.Image      || '',
        videoLink:  editData.VideoLink  || '',
        sortOrder:  String(editData.SortOrder || 0),
        isActive:   !!editData.IsActive,
      });
      setImgPreview(editData.Image || null);
    } else {
      setForm(defaultStoryForm);
      setImgPreview(null);
    }
  }, [editData]);

  const handle = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files[0]) {
      setForm(p => ({ ...p, imageFile: files[0] }));
      setImgPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.imageUrl || null;
      if (form.imageFile instanceof File) imageUrl = await uploadToCDN(form.imageFile);

      const payload = {
        quote:      form.quote      || null,
        descStrong: form.descStrong || null,
        descRest:   form.descRest   || null,
        name:       form.name       || null,
        program:    form.program    || null,
        roleText:   form.roleText   || null,
        image:      imageUrl,
        videoLink:  form.videoLink  || null,
        sortOrder:  parseInt(form.sortOrder) || 0,
        isActive:   form.isActive ? 1 : 0,
      };

      let data;
      if (editData) data = await adminSuccessSectionApi.updateStory(editData.Id, payload);
      else data = await adminSuccessSectionApi.addStory(payload);
      if (data.success) { toast.success(editData ? 'Updated!' : 'Added!'); onSaved(); }
      else toast.error(data.message || 'Error');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="mc-form">
      <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Story</> : <><FaPlus /> Add Success Story</>}</h3>
      <div className="mb-grid-2">
        <div className="mb-grid-full">
          <label className="mb-label">Quote (main heading)</label>
          <input className="mb-input" name="quote" value={form.quote} onChange={handle} placeholder="'I was able to restart my career...'" />
        </div>
        <div>
          <label className="mb-label">Description Strong (bold part)</label>
          <input className="mb-input" name="descStrong" value={form.descStrong} onChange={handle} placeholder="MENTORINGMINDS" />
        </div>
        <div>
          <label className="mb-label">Description Rest (normal text)</label>
          <textarea className="mb-textarea" name="descRest" value={form.descRest} onChange={handle} rows={2} placeholder="Academy helped me put together..." />
        </div>
        <div>
          <label className="mb-label">Name</label>
          <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="Alfred Elver" />
        </div>
        <div>
          <label className="mb-label">Program</label>
          <input className="mb-input" name="program" value={form.program} onChange={handle} placeholder="Post Graduate Program in Data Science" />
        </div>
        <div>
          <label className="mb-label">Role Text (current job)</label>
          <input className="mb-input" name="roleText" value={form.roleText} onChange={handle} placeholder="ML Engineer, Aviso AI" />
        </div>
        <div>
          <label className="mb-label"><FaImage /> Photo</label>
          <input className="mb-input" type="file" name="imageFile" accept="image/*" onChange={handle} />
          {imgPreview && <img src={imgPreview} alt="preview" className="mb-img-preview" style={{ maxHeight: 80, marginTop: 6 }} />}
        </div>
        <div>
          <label className="mb-label"><FaVideo /> Video Link (Watch story button)</label>
          <input className="mb-input" name="videoLink" value={form.videoLink} onChange={handle} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label className="mb-label">Sort Order</label>
          <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
        </div>
        <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
          <input type="checkbox" id="storyActive" name="isActive" checked={form.isActive} onChange={handle} />
          <label htmlFor="storyActive" className="mb-label-inline">Active</label>
        </div>
      </div>
      <div className="mb-form-actions" style={{ marginTop: 16 }}>
        <button type="submit" className="mb-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : editData ? 'Update Story' : 'Add Story'}
        </button>
        {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

// ── Main Component ────────────────────────────────────────────
const ManageSuccessSection = () => {
  const [config, setConfig]     = useState(null);
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        adminSuccessSectionApi.getConfig(),
        adminSuccessSectionApi.getStories(),
      ]);
      if (cRes.success) setConfig(cRes.config || null);
      if (sRes.success) setStories(sRes.stories || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    await adminSuccessSectionApi.toggleStory(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    const d = await adminSuccessSectionApi.deleteStory(id);
    if (d.success) { toast.success('Deleted'); load(); }
    else toast.error(d.message || 'Delete failed');
  };

  const onSaved = () => { setShowForm(false); setEditItem(null); load(); };

  return (
    <div className="mb-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Config card */}
      {!loading && (
        <div className="mb-card">
          <ConfigForm config={config} onSaved={load} />
        </div>
      )}

      {/* Story Form */}
      <div className="mb-card">
        {(showForm || editItem) ? (
          <StoryForm editData={editItem} onSaved={onSaved} onCancel={() => { setShowForm(false); setEditItem(null); }} />
        ) : (
          <div className="mb-header-row">
            <div>
              <h2 className="mb-title"><FaTrophy style={{ color: '#F6881F', marginRight: 8 }} /> Manage Success Stories</h2>
              <p className="mb-subtitle">Success stories carousel cards manage karo.</p>
            </div>
            <button className="mb-btn-primary" onClick={() => setShowForm(true)}><FaPlus /> Add Story</button>
          </div>
        )}
      </div>

      {/* Stories list */}
      {!showForm && !editItem && (
        <div className="mb-card">
          <h3 className="mb-list-title"><FaList /> All Success Stories ({stories.length})</h3>
          {loading ? <PageLoader message="Loading..." /> : stories.length === 0 ? (
            <p className="mb-empty">No stories yet. Add one above!</p>
          ) : (
            <div className="mc-course-list">
              {stories.map(item => (
                <div key={item.Id} className={`mc-course-item ${item.IsActive ? '' : 'mc-course--inactive'}`}>
                  <div className="mc-course-logo">
                    {item.Image
                      ? <img src={item.Image} alt={item.Name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                      : <span className="mc-cat-noimg">No Photo</span>}
                  </div>
                  <div className="mc-course-info">
                    <p className="mc-course-title">{item.Name || '—'}</p>
                    <p className="mc-course-meta">{item.RoleText || '—'} | Sort: {item.SortOrder}</p>
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

export default ManageSuccessSection;
