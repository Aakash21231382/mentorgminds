import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaList,
  FaSave,
  FaImage,
  FaTrophy,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { adminAwardsApi } from "../../api/adminApi";
import PageLoader from "../../components/PageLoader";
import "../../assets/css/ManageBanners.css";
import "../../assets/css/ManageCareer.css";

const CDN_URL = "https://host0008-001-site1.qtempurl.com/api/uploadfile";

const uploadToCDN = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await axios.post(CDN_URL, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const d = res.data;
  let url = null;
  if (Array.isArray(d?.result))
    url = d.result[0]?.variants?.[0] || d.result[0]?.url;
  else if (d?.result?.variants)
    url = Array.isArray(d.result.variants)
      ? d.result.variants[0]
      : d.result.variants;
  else if (d?.url) url = d.url;
  else if (typeof d?.result === "string") url = d.result;
  if (!url) throw new Error("CDN upload failed");
  return url;
};

// ── Image Upload Field (reusable) ─────────────────────────────
const ImageField = ({ label, preview, onFileChange, hint }) => (
  <div>
    <label className="mb-label">
      <FaImage style={{ marginRight: 6 }} />
      {label}
    </label>
    <input
      className="mb-input"
      type="file"
      accept="image/*"
      onChange={onFileChange}
    />
    {preview && (
      <img
        src={preview}
        alt="preview"
        className="mb-img-preview"
        style={{
          maxHeight: 80,
          maxWidth: 160,
          marginTop: 6,
          borderRadius: 8,
          objectFit: "contain",
          background: "#f0f0f0",
        }}
      />
    )}
    {hint && <p className="mb-hint">{hint}</p>}
  </div>
);

// ── Config Form ───────────────────────────────────────────────
const ConfigForm = ({ config, onSaved }) => {
  const [form, setForm] = useState({
    headingNormal: "",
    headingOrange: "",
    supportHeadingBold: "",
    supportHeadingNormal: "",
    supportDesc: "",
    isActive: true,
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [card1File, setCard1File] = useState(null);
  const [card1Preview, setCard1Preview] = useState(null);
  const [card2File, setCard2File] = useState(null);
  const [card2Preview, setCard2Preview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        headingNormal: config.HeadingNormal || "",
        headingOrange: config.HeadingOrange || "",
        supportHeadingBold: config.SupportHeadingBold || "",
        supportHeadingNormal: config.SupportHeadingNormal || "",
        supportDesc: config.SupportDesc || "",
        isActive: config.IsActive !== undefined ? !!config.IsActive : true,
      });
      setMainImagePreview(config.MainImage || null);
      setCard1Preview(config.SupportCard1Image || null);
      setCard2Preview(config.SupportCard2Image || null);
    }
  }, [config]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let mainImage = mainImagePreview && !mainImageFile ? mainImagePreview : null;
      let card1Image = card1Preview && !card1File ? card1Preview : null;
      let card2Image = card2Preview && !card2File ? card2Preview : null;

      if (mainImageFile instanceof File) mainImage = await uploadToCDN(mainImageFile);
      if (card1File instanceof File) card1Image = await uploadToCDN(card1File);
      if (card2File instanceof File) card2Image = await uploadToCDN(card2File);

      const payload = {
        headingNormal: form.headingNormal || null,
        headingOrange: form.headingOrange || null,
        mainImage,
        supportHeadingBold: form.supportHeadingBold || null,
        supportHeadingNormal: form.supportHeadingNormal || null,
        supportDesc: form.supportDesc || null,
        supportCard1Image: card1Image,
        supportCard2Image: card2Image,
        isActive: form.isActive ? 1 : 0,
      };

      const data = await adminAwardsApi.saveConfig(payload);
      if (data.success) { toast.success("Config saved!"); onSaved(); }
      else toast.error(data.message || "Error");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mc-form">
      <h3 className="mb-form-title">Section Config</h3>

      <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <legend style={{ fontWeight: 700, padding: "0 8px" }}>Awards Heading</legend>
        <div className="mb-grid-2">
          <div>
            <label className="mb-label">Heading Normal (white)</label>
            <input className="mb-input" name="headingNormal" value={form.headingNormal} onChange={handle} placeholder="Awards &" />
          </div>
          <div>
            <label className="mb-label">Heading Orange</label>
            <input className="mb-input" name="headingOrange" value={form.headingOrange} onChange={handle} placeholder="Accomplishments" />
          </div>
        </div>
      </fieldset>

      <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <legend style={{ fontWeight: 700, padding: "0 8px" }}>Main Left Image</legend>
        <ImageField
          label="Award Section Left Image"
          preview={mainImagePreview}
          onFileChange={handleFile(setMainImageFile, setMainImagePreview)}
          hint="Dark background section mein left side dikhne wali badi image"
        />
      </fieldset>

      <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <legend style={{ fontWeight: 700, padding: "0 8px" }}>Learner Support Section</legend>
        <div className="mb-grid-2">
          <div>
            <label className="mb-label">Heading Bold (orange)</label>
            <input className="mb-input" name="supportHeadingBold" value={form.supportHeadingBold} onChange={handle} placeholder="MENTORINGMINDS" />
          </div>
          <div>
            <label className="mb-label">Heading Normal (black)</label>
            <input className="mb-input" name="supportHeadingNormal" value={form.supportHeadingNormal} onChange={handle} placeholder="Learner Support" />
          </div>
          <div className="mb-grid-full">
            <label className="mb-label">Description</label>
            <input className="mb-input" name="supportDesc" value={form.supportDesc} onChange={handle} placeholder="Talk to our experts. We are available 7 days a week..." />
          </div>
          <ImageField label="Support Card 1 (Orange card image)" preview={card1Preview} onFileChange={handleFile(setCard1File, setCard1Preview)} hint="Left orange support card" />
          <ImageField label="Support Card 2 (Blue card image)" preview={card2Preview} onFileChange={handleFile(setCard2File, setCard2Preview)} hint="Right blue support card" />
          <div className="mb-checkbox-row" style={{ alignSelf: "end", paddingBottom: 8 }}>
            <input type="checkbox" id="awardsActive" name="isActive" checked={form.isActive} onChange={handle} />
            <label htmlFor="awardsActive" className="mb-label-inline">Active (section visible)</label>
          </div>
        </div>
      </fieldset>

      <div className="mb-form-actions">
        <button type="submit" className="mb-btn-primary" disabled={saving}>
          <FaSave /> {saving ? "Saving..." : "Save Config"}
        </button>
      </div>
    </form>
  );
};

// ── Award Card Form ───────────────────────────────────────────
const CardForm = ({ editData, onSaved, onCancel }) => {
  const [form, setForm] = useState({ dataText: "", title: "", description: "", sortOrder: "0", isActive: true });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ dataText: editData.DataText || "", title: editData.Title || "", description: editData.Description || "", sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive });
      setImgPreview(editData.CardImage || null);
      setImgFile(null);
    } else {
      setForm({ dataText: "", title: "", description: "", sortOrder: "0", isActive: true });
      setImgPreview(null);
      setImgFile(null);
    }
  }, [editData]);

  const handle = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files[0]) { setImgFile(files[0]); setImgPreview(URL.createObjectURL(files[0])); }
    else setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let cardImage = imgPreview && !imgFile ? imgPreview : null;
      if (imgFile instanceof File) cardImage = await uploadToCDN(imgFile);

      const payload = { cardImage, dataText: form.dataText || null, title: form.title || null, description: form.description || null, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0 };

      let data;
      if (editData) data = await adminAwardsApi.updateCard(editData.Id, payload);
      else data = await adminAwardsApi.addCard(payload);

      if (data.success) { toast.success(editData ? "Updated!" : "Added!"); onSaved(); }
      else toast.error(data.message || "Error");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mc-form">
      <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Award Card</> : <><FaPlus /> Add Award Card</>}</h3>
      <div className="mb-grid-2">
        <div>
          <label className="mb-label"><FaImage style={{ marginRight: 6 }} /> Card Image (Award logo)</label>
          <input className="mb-input" type="file" name="cardImage" accept="image/*" onChange={handle} />
          {imgPreview && <img src={imgPreview} alt="preview" style={{ width: 80, height: 80, objectFit: "contain", marginTop: 6, borderRadius: 8, background: "#f0f0f0", padding: 4 }} />}
        </div>
        <div>
          <label className="mb-label">Data Text (orange subheading)</label>
          <input className="mb-input" name="dataText" value={form.dataText} onChange={handle} placeholder="FT/IFC transformational Business Conference..." />
        </div>
        <div>
          <label className="mb-label">Title</label>
          <input className="mb-input" name="title" value={form.title} onChange={handle} placeholder="Special Commendation" />
        </div>
        <div>
          <label className="mb-label">Sort Order</label>
          <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
        </div>
        <div className="mb-grid-full">
          <label className="mb-label">Description</label>
          <textarea className="mb-textarea" name="description" value={form.description} onChange={handle} rows={3} placeholder="UG's DS Program wins Special Commendation..." />
        </div>
        <div className="mb-checkbox-row" style={{ alignSelf: "end", paddingBottom: 8 }}>
          <input type="checkbox" id="cardActive" name="isActive" checked={form.isActive} onChange={handle} />
          <label htmlFor="cardActive" className="mb-label-inline">Active</label>
        </div>
      </div>
      <div className="mb-form-actions" style={{ marginTop: 16 }}>
        <button type="submit" className="mb-btn-primary" disabled={loading}>{loading ? "Saving..." : editData ? "Update Card" : "Add Card"}</button>
        {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

// ── Main Component ────────────────────────────────────────────
const ManageAwardsSection = () => {
  const [config, setConfig] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [cfgRes, cardsRes] = await Promise.all([
        adminAwardsApi.getConfig(),
        adminAwardsApi.getCards(),
      ]);
      if (cfgRes.success) setConfig(cfgRes.config || null);
      if (cardsRes.success) setCards(cardsRes.cards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    await adminAwardsApi.toggleCard(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this award card?")) return;
    const d = await adminAwardsApi.deleteCard(id);
    if (d.success) { toast.success("Deleted"); load(); }
    else toast.error(d.message || "Delete failed");
  };

  const onSaved = () => { setShowForm(false); setEditItem(null); load(); };

  return (
    <div className="mb-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {!loading && (
        <div className="mb-card">
          <div className="mb-header-row" style={{ marginBottom: 20 }}>
            <div>
              <h2 className="mb-title"><FaTrophy style={{ color: "#F6881F", marginRight: 8 }} /> Manage Awards Section</h2>
              <p className="mb-subtitle">Awards section aur Learner Support section manage karo.</p>
            </div>
          </div>
          <ConfigForm config={config} onSaved={load} />
        </div>
      )}

      <div className="mb-card">
        {showForm || editItem ? (
          <CardForm editData={editItem} onSaved={onSaved} onCancel={() => { setShowForm(false); setEditItem(null); }} />
        ) : (
          <div className="mb-header-row">
            <div>
              <h2 className="mb-title"><FaTrophy style={{ color: "#F6881F", marginRight: 8 }} /> Award Cards</h2>
              <p className="mb-subtitle">Individual award cards manage karo (image, title, description).</p>
            </div>
            <button className="mb-btn-primary" onClick={() => setShowForm(true)}><FaPlus /> Add Card</button>
          </div>
        )}
      </div>

      {!showForm && !editItem && (
        <div className="mb-card">
          <h3 className="mb-list-title"><FaList /> All Award Cards ({cards.length})</h3>
          {loading ? <PageLoader message="Loading..." /> : cards.length === 0 ? (
            <p className="mb-empty">No cards yet. Add one above!</p>
          ) : (
            <div className="mc-course-list">
              {cards.map((item) => (
                <div key={item.Id} className={`mc-course-item ${item.IsActive ? "" : "mc-course--inactive"}`}>
                  <div className="mc-course-logo">
                    {item.CardImage ? (
                      <img src={item.CardImage} alt={item.Title} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 6, background: "#f5f5f5", padding: 4 }} />
                    ) : (
                      <span className="mc-cat-noimg">No Img</span>
                    )}
                  </div>
                  <div className="mc-course-info">
                    <p className="mc-course-title">{item.Title || "—"}</p>
                    <p className="mc-course-meta">{item.DataText || "—"} | Sort: {item.SortOrder}</p>
                  </div>
                  <div className="mb-item-actions">
                    <button className="mb-btn-toggle" onClick={() => handleToggle(item.Id)}>
                      {item.IsActive ? <FaToggleOn style={{ color: "#48bb78" }} /> : <FaToggleOff style={{ color: "#cbd5e0" }} />}
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

export default ManageAwardsSection;
