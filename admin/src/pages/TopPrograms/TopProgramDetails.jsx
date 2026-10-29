import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaSave,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaImage,
  FaFilePdf,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { topProgramsApi } from "../../api/adminApi";
import "../../assets/css/ManageBanners.css";
import "../../assets/css/ManageCourseDetail.css";
import PageLoader from "../../components/PageLoader";

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

// ── Small helpers ─────────────────────────────────────────────
const Section = ({ title, emoji, children, toggle, toggleKey, onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="mcd-section-card">
      <div className="mcd-section-header" onClick={() => setCollapsed((p) => !p)}>
        <div className="mcd-section-header-left">
          {emoji && <span className="mcd-section-emoji">{emoji}</span>}
          <h3 className="mcd-section-title">{title}</h3>
        </div>
        <div className="mcd-section-header-right" onClick={(e) => e.stopPropagation()}>
          {toggle !== undefined && (
            <div className="mcd-toggle-wrap">
              <span>Show on page</span>
              <label className="mcd-switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={toggle}
                  onChange={() => onToggle(toggleKey)}
                />
                <span className="mcd-slider"></span>
              </label>
            </div>
          )}
          <span className={`mcd-collapse-arrow ${collapsed ? "" : "open"}`}>▼</span>
        </div>
      </div>
      {!collapsed && <div className="mcd-section-body">{children}</div>}
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = "text", placeholder, textarea }) => (
  <div className="mcd-field">
    <label className="mb-label">{label}</label>
    {textarea ? (
      <textarea
        className="mb-textarea"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
      />
    ) : (
      <input
        className="mb-input"
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />
    )}
  </div>
);

const Grid2 = ({ children }) => <div className="mcd-field-row">{children}</div>;
const Grid3 = ({ children }) => <div className="mcd-field-row-3">{children}</div>;

// ── Inline Image Upload ─────────────────────────────────────
const InlineImageField = ({ label, value, onChange, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCDN(file);
      onUpload(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="mcd-inline-img-field">
      <label className="mb-label">{label}</label>
      <input
        className="mb-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste URL ya neeche se upload karo"
      />
      <div className="mcd-img-upload-row">
        <label className="mcd-upload-btn">
          <FaImage style={{ marginRight: 5 }} />
          {uploading ? "Uploading..." : "Upload from system"}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} disabled={uploading} />
        </label>
        {value && <img src={value} alt="" className="mcd-inline-preview" />}
      </div>
    </div>
  );
};

// ── JSON array editor ─────────────────────────────────────────
const ArrayEditor = ({ label, value = [], onChange, fields }) => {
  const add = () => onChange([...value, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const update = (i, key, val) => {
    const copy = [...value];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  return (
    <div className="mcd-array-editor">
      <div className="mcd-array-label">{label}</div>
      {value.map((item, i) => (
        <div key={i} className="mcd-array-item">
          {fields.map((f) => (
            <div key={f.key} className="mcd-array-field">
              {f.type === "image" ? (
                <InlineImageField
                  label={f.label}
                  value={item[f.key] || ""}
                  onChange={(val) => update(i, f.key, val)}
                  onUpload={(url) => update(i, f.key, url)}
                />
              ) : f.type === "icon" ? (
                <>
                  <label className="mb-label">{f.label}</label>
                  <select
                    className="mb-input"
                    value={item[f.key] || ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                  >
                    <option value="">— Select Icon —</option>
                    {ICON_OPTS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {item[f.key] && (
                    <p className="mb-hint" style={{ marginTop: 4, color: "#F6881F", fontWeight: 600 }}>
                      Selected: {item[f.key]}
                    </p>
                  )}
                </>
              ) : f.textarea ? (
                <>
                  <label className="mb-label">{f.label}</label>
                  <textarea
                    className="mb-textarea"
                    value={item[f.key] || ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={2}
                  />
                </>
              ) : (
                <>
                  <label className="mb-label">{f.label}</label>
                  <input
                    className="mb-input"
                    value={item[f.key] || ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                </>
              )}
            </div>
          ))}
          <button type="button" className="mcd-remove-btn" onClick={() => remove(i)}>
            <FaTrash /> Remove
          </button>
        </div>
      ))}
      <button type="button" className="mcd-add-item-btn" onClick={add}>
        <FaPlus /> Add {label}
      </button>
    </div>
  );
};

// ── Image Upload Field ────────────────────────────────────────
const ImageField = ({ label, value, onUpload, hint }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCDN(file);
      onUpload(url);
      toast.success("Uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="mcd-field">
      <label className="mb-label">{label}</label>
      <input className="mb-input" type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {hint && <p className="mb-hint">{hint}</p>}
      {uploading && <p className="mb-hint">Uploading...</p>}
      {value && <img src={value} alt="" className="mb-img-preview" style={{ maxHeight: 80 }} />}
    </div>
  );
};

// ── PDF Upload Field ──────────────────────────────────────────
const PdfField = ({ label, value, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCDN(file);
      onUpload(url);
      toast.success("PDF uploaded!");
    } catch {
      toast.error("PDF upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="mcd-field">
      <label className="mb-label">
        <FaFilePdf style={{ color: "#e53e3e", marginRight: 6 }} />
        {label}
      </label>
      <input className="mb-input" type="file" accept=".pdf,application/pdf" onChange={handleFile} disabled={uploading} />
      {uploading && <p className="mb-hint">Uploading PDF...</p>}
      {value && (
        <div style={{ marginTop: 6 }}>
          <a href={value} target="_blank" rel="noreferrer" className="mcd-pdf-link">
            <FaFilePdf /> View current PDF
          </a>
        </div>
      )}
    </div>
  );
};

// ── ICON OPTIONS ─────────────────────────────────────────────
const ICON_OPTS = [
  { value: "FiZap", label: "⚡ Zap" },
  { value: "FiUsers", label: "👥 Users" },
  { value: "FiCompass", label: "🧭 Compass" },
  { value: "FiCheckCircle", label: "✅ Check Circle" },
  { value: "FiActivity", label: "📈 Activity" },
  { value: "FiShoppingCart", label: "🛒 Shopping Cart" },
  { value: "FiCpu", label: "💻 CPU" },
  { value: "FiShield", label: "🛡️ Shield" },
  { value: "FiBriefcase", label: "💼 Briefcase" },
  { value: "FiCode", label: "👨‍💻 Code" },
  { value: "FiCloud", label: "☁️ Cloud" },
  { value: "FiDatabase", label: "🗄️ Database" },
  { value: "FiTrendingUp", label: "📊 Trending Up" },
  { value: "FiGlobe", label: "🌐 Globe" },
  { value: "FiLayers", label: "🗂️ Layers" },
  { value: "FaLightbulb", label: "💡 Lightbulb" },
  { value: "FaGraduationCap", label: "🎓 Graduation" },
  { value: "FaRocket", label: "🚀 Rocket" },
  { value: "FaUsers", label: "👨‍👩‍👧 Users Group" },
  { value: "FaBolt", label: "⚡ Bolt" },
  { value: "FaChartBar", label: "📊 Chart Bar" },
  { value: "FaBrain", label: "🧠 Brain" },
  { value: "FaAward", label: "🏆 Award" },
  { value: "FaStar", label: "⭐ Star" },
  { value: "FaPlane", label: "✈️ Plane" },
  { value: "FaGlobe", label: "🌍 Globe" },
  { value: "FaUniversity", label: "🏛️ University" },
  { value: "FaPassport", label: "📕 Passport" },
  { value: "FaMapMarkerAlt", label: "📍 Location" },
  { value: "FaHandshake", label: "🤝 Handshake" },
  { value: "FaCertificate", label: "📜 Certificate" },
  { value: "FaLanguage", label: "🗣️ Language" },
  { value: "MdWork", label: "💼 Work" },
  { value: "MdSchool", label: "🏫 School" },
  { value: "MdSecurity", label: "🔒 Security" },
  { value: "BsStars", label: "✨ Stars" },
  { value: "BsPeopleFill", label: "👥 People" },
  { value: "BsGraphUp", label: "📈 Graph Up" },
];

// ── Default empty form ────────────────────────────────────────
const defaultForm = () => ({
  slug: "",
  heroBadge: "",
  university: "",
  heroTitleNormal: "",
  heroTitleOrange: "",
  heroDescription: "",
  heroDuration: "",
  heroMode: "",
  heroStarts: "",
  heroImage: "",
  heroReviewText: "",
  heroReviewAuthor: "",
  heroUrgencyText: "",
  brochureUrl: "",
  alumniCompanies: [],
  legacyTitle: "",
  legacySubtitle: "",
  legacyCards: [],
  aiSectionTitle: "",
  aiSectionSubtext: "",
  aiHighlights: [],
  aiStat1Value: "",
  aiStat1Label: "",
  aiStat2Value: "",
  aiStat2Label: "",
  aiPromoTitle: "",
  aiPromoText: "",
  quickHighlights: [],
  learningJourneyTitle: "",
  learningJourney: [],
  curriculum: [],
  tools: [],
  realWorldProjects: [],
  capstoneProjects: [],
  mentors: [],
  credentialTitle: "",
  credentialSubtitle: "",
  credentialFeatures: [],
  certificateImage: "",
  careerJourneySteps: [],
  careerStats: [],
  successStories: [],
  learningExperience: [],
  showAlumni: true,
  showLegacy: true,
  showAiSection: true,
  showQuickHighlights: true,
  showLearningJourney: true,
  showCurriculum: true,
  showTools: true,
  showRealProjects: true,
  showCapstone: true,
  showMentors: true,
  showCredential: true,
  showCareerSupport: true,
  isActive: true,
});

// ── Parse DB data into form ───────────────────────────────────
const parseDetailToForm = (d) => {
  const tryParse = (v) => {
    try { return v ? (typeof v === "string" ? JSON.parse(v) : v) : []; }
    catch { return []; }
  };
  return {
    slug: d.Slug || "",
    heroBadge: d.HeroBadge || "",
    university: d.University || "",
    heroTitleNormal: d.HeroTitleNormal || "",
    heroTitleOrange: d.HeroTitleOrange || "",
    heroDescription: d.HeroDescription || "",
    heroDuration: d.HeroDuration || "",
    heroMode: d.HeroMode || "",
    heroStarts: d.HeroStarts || "",
    heroImage: d.HeroImage || "",
    heroReviewText: d.HeroReviewText || "",
    heroReviewAuthor: d.HeroReviewAuthor || "",
    heroUrgencyText: d.HeroUrgencyText || "",
    brochureUrl: d.BrochureUrl || "",
    alumniCompanies: tryParse(d.AlumniCompanies),
    legacyTitle: d.LegacyTitle || "",
    legacySubtitle: d.LegacySubtitle || "",
    legacyCards: tryParse(d.LegacyCards),
    aiSectionTitle: d.AiSectionTitle || "",
    aiSectionSubtext: d.AiSectionSubtext || "",
    aiHighlights: tryParse(d.AiHighlights),
    aiStat1Value: d.AiStat1Value || "",
    aiStat1Label: d.AiStat1Label || "",
    aiStat2Value: d.AiStat2Value || "",
    aiStat2Label: d.AiStat2Label || "",
    aiPromoTitle: d.AiPromoTitle || "",
    aiPromoText: d.AiPromoText || "",
    quickHighlights: tryParse(d.QuickHighlights),
    learningJourneyTitle: d.LearningJourneyTitle || "",
    learningJourney: tryParse(d.LearningJourney),
    curriculum: tryParse(d.Curriculum),
    tools: tryParse(d.Tools),
    realWorldProjects: tryParse(d.RealWorldProjects),
    capstoneProjects: tryParse(d.CapstoneProjects),
    mentors: tryParse(d.Mentors),
    credentialTitle: d.CredentialTitle || "",
    credentialSubtitle: d.CredentialSubtitle || "",
    credentialFeatures: tryParse(d.CredentialFeatures),
    certificateImage: d.CertificateImage || "",
    careerJourneySteps: tryParse(d.CareerJourneySteps),
    careerStats: tryParse(d.CareerStats),
    successStories: tryParse(d.SuccessStories),
    learningExperience: tryParse(d.LearningExperience),
    showAlumni: d.ShowAlumni !== undefined ? !!d.ShowAlumni : true,
    showLegacy: d.ShowLegacy !== undefined ? !!d.ShowLegacy : true,
    showAiSection: d.ShowAiSection !== undefined ? !!d.ShowAiSection : true,
    showQuickHighlights: d.ShowQuickHighlights !== undefined ? !!d.ShowQuickHighlights : true,
    showLearningJourney: d.ShowLearningJourney !== undefined ? !!d.ShowLearningJourney : true,
    showCurriculum: d.ShowCurriculum !== undefined ? !!d.ShowCurriculum : true,
    showTools: d.ShowTools !== undefined ? !!d.ShowTools : true,
    showRealProjects: d.ShowRealProjects !== undefined ? !!d.ShowRealProjects : true,
    showCapstone: d.ShowCapstone !== undefined ? !!d.ShowCapstone : true,
    showMentors: d.ShowMentors !== undefined ? !!d.ShowMentors : true,
    showCredential: d.ShowCredential !== undefined ? !!d.ShowCredential : true,
    showCareerSupport: d.ShowCareerSupport !== undefined ? !!d.ShowCareerSupport : true,
    isActive: d.IsActive !== undefined ? !!d.IsActive : true,
  };
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const TopProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [programTitle, setProgramTitle] = useState("");

  useEffect(() => {
    // Load existing detail
    topProgramsApi.getDetail(id)
      .then((d) => {
        if (d && d.success && d.details) {
          setForm(parseDetailToForm(d.details));
          setProgramTitle(d.details.ProgramTitle || `Program ID: ${id}`);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const handle = (e) => set(e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value);
  const toggleSection = (key) => set(key, !form[key]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, programId: parseInt(id) };
      const data = await topProgramsApi.saveDetails(payload);
      if (data && data.success) toast.success(data.message || "Saved successfully!");
      else toast.error((data && data.message) || "Error saving");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader message="Loading Program Detail..." />;

  return (
    <div className="mb-page mcd-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-card mcd-header-card">
        <div className="mb-header-row">
          <div>
            <button className="mcd-back-btn" onClick={() => navigate("/admin/top-programs")}>
              <FaArrowLeft /> Back
            </button>
            <h2 className="mb-title" style={{ marginTop: 8 }}>Program Detail Page</h2>
            <p className="mb-subtitle">{programTitle}</p>
          </div>
          <button className="mb-btn-primary" onClick={handleSave} disabled={saving}>
            <FaSave /> {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* ── HERO ── */}
        <Section title="🎯 Hero Section">
          <Grid2>
            <Field label="URL Slug" name="slug" value={form.slug} onChange={handle} placeholder="e.g. mba-usa-harvard" />
            <Field label="Badge Text" name="heroBadge" value={form.heroBadge} onChange={handle} placeholder="ADMISSIONS OPEN FOR 2026" />
            <Field label="University / Institution" name="university" value={form.university} onChange={handle} placeholder="Harvard University" />
            <Field label="Duration" name="heroDuration" value={form.heroDuration} onChange={handle} placeholder="12 Months" />
            <Field label="Mode" name="heroMode" value={form.heroMode} onChange={handle} placeholder="Online / On-Campus" />
            <Field label="Starts" name="heroStarts" value={form.heroStarts} onChange={handle} placeholder="Sept 2026" />
          </Grid2>
          <Grid2>
            <Field label="Title (Normal)" name="heroTitleNormal" value={form.heroTitleNormal} onChange={handle} placeholder="Executive MBA Program" />
            <Field label="Title (Orange/Highlight)" name="heroTitleOrange" value={form.heroTitleOrange} onChange={handle} placeholder="at Harvard University" />
          </Grid2>
          <Field label="Description" name="heroDescription" value={form.heroDescription} onChange={handle} textarea placeholder="Program description..." />
          <Grid2>
            <Field label="Review Text" name="heroReviewText" value={form.heroReviewText} onChange={handle} textarea placeholder="This program changed my career..." />
            <Field label="Review Author" name="heroReviewAuthor" value={form.heroReviewAuthor} onChange={handle} placeholder="— Alumni, Class of '24" />
          </Grid2>
          <Field label="Urgency Text" name="heroUrgencyText" value={form.heroUrgencyText} onChange={handle} placeholder="Limited seats available! Apply now" />
          <Grid2>
            <ImageField label="Hero Image" value={form.heroImage} onUpload={(url) => set("heroImage", url)} hint="Right side image in hero section" />
            <PdfField label="Brochure PDF" value={form.brochureUrl} onUpload={(url) => set("brochureUrl", url)} />
          </Grid2>
          <div className="mb-checkbox-row">
            <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handle} />
            <label htmlFor="isActive" className="mb-label-inline">Page Active (visible on website)</label>
          </div>
        </Section>

        {/* ── ALUMNI ── */}
        <Section title="🏢 Partner Companies / Alumni" toggle={form.showAlumni} toggleKey="showAlumni" onToggle={toggleSection}>
          <ArrayEditor
            label="Company"
            value={form.alumniCompanies}
            onChange={(v) => set("alumniCompanies", v)}
            fields={[
              { key: "name", label: "Company Name", placeholder: "Google" },
              { key: "logo", label: "Logo Image", type: "image" },
            ]}
          />
        </Section>

        {/* ── LEGACY / ABOUT ── */}
        <Section title="🏛️ About / Legacy Section" toggle={form.showLegacy} toggleKey="showLegacy" onToggle={toggleSection}>
          <Grid2>
            <Field label="Section Title" name="legacyTitle" value={form.legacyTitle} onChange={handle} placeholder="Why Study Abroad?" />
            <Field label="Subtitle" name="legacySubtitle" value={form.legacySubtitle} onChange={handle} textarea placeholder="Gain global exposure..." />
          </Grid2>
          <ArrayEditor
            label="Card"
            value={form.legacyCards}
            onChange={(v) => set("legacyCards", v)}
            fields={[
              { key: "title", label: "Title", placeholder: "World-Class Education" },
              { key: "description", label: "Description", placeholder: "Access top-ranked universities...", textarea: true },
              { key: "icon", label: "Icon", type: "icon" },
            ]}
          />
        </Section>

        {/* ── PROGRAM HIGHLIGHTS ── */}
        <Section title="🤖 Program Highlights Section" toggle={form.showAiSection} toggleKey="showAiSection" onToggle={toggleSection}>
          <Grid2>
            <Field label="Section Title" name="aiSectionTitle" value={form.aiSectionTitle} onChange={handle} placeholder="What Makes This Program Special?" />
            <Field label="Subtext" name="aiSectionSubtext" value={form.aiSectionSubtext} onChange={handle} textarea placeholder="Designed for ambitious professionals..." />
            <Field label="Stat 1 Value" name="aiStat1Value" value={form.aiStat1Value} onChange={handle} placeholder="500+" />
            <Field label="Stat 1 Label" name="aiStat1Label" value={form.aiStat1Label} onChange={handle} placeholder="GRADUATES PLACED" />
            <Field label="Stat 2 Value" name="aiStat2Value" value={form.aiStat2Value} onChange={handle} placeholder="95%" />
            <Field label="Stat 2 Label" name="aiStat2Label" value={form.aiStat2Label} onChange={handle} placeholder="VISA SUCCESS RATE" />
            <Field label="Promo Card Title" name="aiPromoTitle" value={form.aiPromoTitle} onChange={handle} placeholder="Global Opportunity Awaits" />
            <Field label="Promo Card Text" name="aiPromoText" value={form.aiPromoText} onChange={handle} textarea placeholder="International education opens doors..." />
          </Grid2>
          <ArrayEditor
            label="Highlight"
            value={form.aiHighlights}
            onChange={(v) => set("aiHighlights", v)}
            fields={[
              { key: "title", label: "Title", placeholder: "100% Visa Support" },
              { key: "desc", label: "Description", placeholder: "End-to-end visa guidance...", textarea: true },
              { key: "icon", label: "Icon", type: "icon" },
            ]}
          />
        </Section>

        {/* ── QUICK HIGHLIGHTS ── */}
        <Section title="⚡ Quick Highlights" toggle={form.showQuickHighlights} toggleKey="showQuickHighlights" onToggle={toggleSection}>
          <ArrayEditor
            label="Highlight"
            value={form.quickHighlights}
            onChange={(v) => set("quickHighlights", v)}
            fields={[
              { key: "label", label: "Label", placeholder: "Duration" },
              { key: "value", label: "Value", placeholder: "12 Months" },
              { key: "icon", label: "Icon", type: "icon" },
            ]}
          />
        </Section>

        {/* ── LEARNING JOURNEY ── */}
        <Section title="🗺️ Program Journey / Timeline" toggle={form.showLearningJourney} toggleKey="showLearningJourney" onToggle={toggleSection}>
          <Field label="Section Title" name="learningJourneyTitle" value={form.learningJourneyTitle} onChange={handle} placeholder="Your Study Abroad Journey" />
          <ArrayEditor
            label="Phase"
            value={form.learningJourney}
            onChange={(v) => set("learningJourney", v)}
            fields={[
              { key: "month", label: "Phase/Month", placeholder: "PHASE 1" },
              { key: "title", label: "Title", placeholder: "Application & Admission" },
            ]}
          />
        </Section>

        {/* ── CURRICULUM ── */}
        <Section title="📚 Curriculum / Modules" toggle={form.showCurriculum} toggleKey="showCurriculum" onToggle={toggleSection}>
          <ArrayEditor
            label="Module"
            value={form.curriculum}
            onChange={(v) => set("curriculum", v)}
            fields={[
              { key: "moduleNumber", label: "Module No", placeholder: "Module 1" },
              { key: "title", label: "Title", placeholder: "Introduction to MBA" },
              { key: "objectives", label: "Topics (comma separated)", placeholder: "Finance, Marketing, Strategy" },
            ]}
          />
          <p className="mb-hint">Topics: comma-separated likhein, e.g. "Finance, Marketing, Strategy"</p>
        </Section>

        {/* ── TOOLS ── */}
        <Section title="🛠️ Tools & Skills" toggle={form.showTools} toggleKey="showTools" onToggle={toggleSection}>
          <ArrayEditor
            label="Tool/Skill"
            value={form.tools}
            onChange={(v) => set("tools", v)}
            fields={[
              { key: "name", label: "Name", placeholder: "English Proficiency" },
              { key: "image", label: "Icon/Image", type: "image" },
            ]}
          />
        </Section>

        {/* ── REAL WORLD PROJECTS ── */}
        <Section title="🚀 Case Studies / Projects" toggle={form.showRealProjects} toggleKey="showRealProjects" onToggle={toggleSection}>
          <ArrayEditor
            label="Case Study"
            value={form.realWorldProjects}
            onChange={(v) => set("realWorldProjects", v)}
            fields={[
              { key: "tag", label: "Tag", placeholder: "BUSINESS STRATEGY" },
              { key: "title", label: "Title", placeholder: "Global Market Expansion" },
              { key: "description", label: "Description", placeholder: "Analyze real-world...", textarea: true },
            ]}
          />
        </Section>

        {/* ── CAPSTONE ── */}
        <Section title="🏆 Capstone / Final Projects" toggle={form.showCapstone} toggleKey="showCapstone" onToggle={toggleSection}>
          <ArrayEditor
            label="Project"
            value={form.capstoneProjects}
            onChange={(v) => set("capstoneProjects", v)}
            fields={[
              { key: "category", label: "Category", placeholder: "FINANCE" },
              { key: "title", label: "Title", placeholder: "Investment Portfolio Analysis" },
              { key: "description", label: "Description", placeholder: "Build and analyze...", textarea: true },
              { key: "icon", label: "Icon", type: "icon" },
            ]}
          />
        </Section>

        {/* ── MENTORS ── */}
        <Section title="👨‍🏫 Faculty / Mentors" toggle={form.showMentors} toggleKey="showMentors" onToggle={toggleSection}>
          <ArrayEditor
            label="Mentor"
            value={form.mentors}
            onChange={(v) => set("mentors", v)}
            fields={[
              { key: "name", label: "Name", placeholder: "Prof. John Smith" },
              { key: "role", label: "Role", placeholder: "Dean of Business @ Harvard" },
              { key: "image", label: "Photo", type: "image" },
              { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
              { key: "bgColor", label: "Card BG Color", placeholder: "#F3F4FD" },
            ]}
          />
        </Section>

        {/* ── CREDENTIAL ── */}
        <Section title="🎓 Credential / Certificate" toggle={form.showCredential} toggleKey="showCredential" onToggle={toggleSection}>
          <Grid2>
            <Field label="Credential Title" name="credentialTitle" value={form.credentialTitle} onChange={handle} placeholder="A Credential Recognized Worldwide" />
            <Field label="Credential Subtitle" name="credentialSubtitle" value={form.credentialSubtitle} onChange={handle} textarea placeholder="Earn an official degree from..." />
          </Grid2>
          <ImageField label="Certificate Image" value={form.certificateImage} onUpload={(url) => set("certificateImage", url)} />
          <ArrayEditor
            label="Feature"
            value={form.credentialFeatures}
            onChange={(v) => set("credentialFeatures", v)}
            fields={[
              { key: "title", label: "Title", placeholder: "Globally Recognized Degree" },
              { key: "description", label: "Description", placeholder: "Accepted by employers worldwide...", textarea: true },
              { key: "icon", label: "Icon", type: "icon" },
            ]}
          />
        </Section>

        {/* ── CAREER SUPPORT ── */}
        <Section title="💼 Career Support" toggle={form.showCareerSupport} toggleKey="showCareerSupport" onToggle={toggleSection}>
          <p className="mb-hint">Journey Steps</p>
          <ArrayEditor
            label="Step"
            value={form.careerJourneySteps}
            onChange={(v) => set("careerJourneySteps", v)}
            fields={[
              { key: "label", label: "Step Label", placeholder: "Visa Application" },
            ]}
          />
          <p className="mb-hint" style={{ marginTop: 16 }}>Stats</p>
          <ArrayEditor
            label="Stat"
            value={form.careerStats}
            onChange={(v) => set("careerStats", v)}
            fields={[
              { key: "value", label: "Value", placeholder: "95%" },
              { key: "label", label: "Label", placeholder: "VISA SUCCESS RATE" },
            ]}
          />
          <p className="mb-hint" style={{ marginTop: 16 }}>Success Stories</p>
          <ArrayEditor
            label="Story"
            value={form.successStories}
            onChange={(v) => set("successStories", v)}
            fields={[
              { key: "name", label: "Name", placeholder: "Rahul Sharma" },
              { key: "role", label: "Role", placeholder: "Now studying at Harvard" },
              { key: "image", label: "Photo URL", placeholder: "https://..." },
              { key: "quote", label: "Quote", placeholder: '"Best decision of my life..."', textarea: true },
            ]}
          />
          <p className="mb-hint" style={{ marginTop: 16 }}>Experience Cards</p>
          <ArrayEditor
            label="Card"
            value={form.learningExperience}
            onChange={(v) => set("learningExperience", v)}
            fields={[
              { key: "title", label: "Title", placeholder: "24/7 Support" },
              { key: "description", label: "Description", placeholder: "Round-the-clock assistance...", textarea: true },
              { key: "icon", label: "Icon", type: "icon" },
            ]}
          />
        </Section>

        {/* Save bottom */}
        <div style={{ padding: "0 0 40px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="mb-btn-primary" disabled={saving} style={{ fontSize: 16, padding: "12px 32px" }}>
            <FaSave /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopProgramDetails;
