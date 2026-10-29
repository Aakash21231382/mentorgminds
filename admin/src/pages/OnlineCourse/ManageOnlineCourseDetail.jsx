import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { adminOnlineCourseApi } from "../../api/adminApi";
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
      <div
        className="mcd-section-header"
        onClick={() => setCollapsed((p) => !p)}
      >
        <div className="mcd-section-header-left">
          {emoji && <span className="mcd-section-emoji">{emoji}</span>}
          <h3 className="mcd-section-title">{title}</h3>
        </div>
        <div
          className="mcd-section-header-right"
          onClick={(e) => e.stopPropagation()}
        >
          {toggle !== undefined && (
            <div className="mcd-toggle-wrap">
              <span>Show on page</span>
              <label
                className="mcd-switch"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={toggle}
                  onChange={() => onToggle(toggleKey)}
                />
                <span className="mcd-slider"></span>
              </label>
            </div>
          )}
          <span className={`mcd-collapse-arrow ${collapsed ? "" : "open"}`}>
            ▼
          </span>
        </div>
      </div>
      {!collapsed && <div className="mcd-section-body">{children}</div>}
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
}) => (
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
const Grid3 = ({ children }) => (
  <div className="mcd-field-row-3">{children}</div>
);
const SubLabel = ({ children }) => (
  <div className="mcd-sub-label">{children}</div>
);

// ── Inline Image Upload (URL + file upload dono) ─────────────
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
      {/* URL input */}
      <input
        className="mb-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste URL ya neeche se upload karo"
      />
      {/* File upload */}
      <div className="mcd-img-upload-row">
        <label className="mcd-upload-btn">
          <FaImage style={{ marginRight: 5 }} />
          {uploading ? "Uploading..." : "Upload from system"}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
        {value && <img src={value} alt="" className="mcd-inline-preview" />}
      </div>
    </div>
  );
};

// ── JSON array editor ─────────────────────────────────────────
const ArrayEditor = ({ label, value = [], onChange, fields }) => {
  const add = () =>
    onChange([...value, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
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
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {item[f.key] && (
                    <p
                      className="mb-hint"
                      style={{
                        marginTop: 4,
                        color: "#F6881F",
                        fontWeight: 600,
                      }}
                    >
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
          <button
            type="button"
            className="mcd-remove-btn"
            onClick={() => remove(i)}
          >
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
      <input
        className="mb-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
      />
      {hint && <p className="mb-hint">{hint}</p>}
      {uploading && <p className="mb-hint">Uploading...</p>}
      {value && (
        <img
          src={value}
          alt=""
          className="mb-img-preview"
          style={{ maxHeight: 80 }}
        />
      )}
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
      <input
        className="mb-input"
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFile}
        disabled={uploading}
      />
      {uploading && <p className="mb-hint">Uploading PDF...</p>}
      {value && (
        <div style={{ marginTop: 6 }}>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mcd-pdf-link"
          >
            <FaFilePdf /> View current PDF
          </a>
        </div>
      )}
    </div>
  );
};

// ── ICON OPTIONS — Admin dropdown ─────────────────────────────
// Frontend ke ICON_MAP se exact match karna zaroori hai
const ICON_OPTS = [
  // Feather Icons
  { value: "FiZap", label: "⚡ Zap (Energy)" },
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
  { value: "FiBox", label: "📦 Box" },
  { value: "FiGlobe", label: "🌐 Globe" },
  { value: "FiLayers", label: "🗂️ Layers" },
  // Font Awesome
  { value: "FaLightbulb", label: "💡 Lightbulb" },
  { value: "FaHourglassHalf", label: "⏳ Hourglass" },
  { value: "FaLaptop", label: "💻 Laptop" },
  { value: "FaTools", label: "🔧 Tools" },
  { value: "FaHandsHelping", label: "🤝 Helping Hands" },
  { value: "FaWrench", label: "🔩 Wrench" },
  { value: "FaUserTie", label: "👔 Professional" },
  { value: "FaGraduationCap", label: "🎓 Graduation" },
  { value: "FaRocket", label: "🚀 Rocket" },
  { value: "FaShieldAlt", label: "🛡️ Shield Alt" },
  { value: "FaUsers", label: "👨‍👩‍👧 Users Group" },
  { value: "FaBolt", label: "⚡ Bolt" },
  { value: "FaCode", label: "{ } Code" },
  { value: "FaChartBar", label: "📊 Chart Bar" },
  { value: "FaDatabase", label: "🗄️ Database" },
  { value: "FaCloud", label: "☁️ Cloud" },
  { value: "FaMicrochip", label: "🔬 Microchip" },
  { value: "FaBrain", label: "🧠 Brain" },
  { value: "FaLayerGroup", label: "🗂️ Layer Group" },
  { value: "FaFlask", label: "🧪 Flask" },
  { value: "FaAward", label: "🏆 Award" },
  { value: "FaUsersCog", label: "⚙️ Users Cog" },
  { value: "FaStar", label: "⭐ Star" },
  // IO5
  { value: "IoTimerOutline", label: "⏱️ Timer" },
  // Ant Design
  { value: "AiOutlineFileProtect", label: "📄 File Protect" },
  { value: "AiOutlineRobot", label: "🤖 Robot" },
  { value: "AiOutlineExperiment", label: "🧪 Experiment" },
  // Bootstrap
  { value: "BsStars", label: "✨ Stars" },
  { value: "BsLightningCharge", label: "⚡ Lightning" },
  { value: "BsPeopleFill", label: "👥 People" },
  { value: "BsGraphUp", label: "📈 Graph Up" },
  { value: "BsCpu", label: "💾 CPU" },
  { value: "BsCodeSlash", label: "</> Code Slash" },
  // Material Design
  { value: "MdWork", label: "💼 Work" },
  { value: "MdSchool", label: "🏫 School" },
  { value: "MdSpeed", label: "⚡ Speed" },
  { value: "MdAutoGraph", label: "📉 Auto Graph" },
  { value: "MdSecurity", label: "🔒 Security" },
  { value: "MdDeveloperMode", label: "👨‍💻 Developer Mode" },
  // Game Icons
  { value: "GiArtificialIntelligence", label: "🤖 AI" },
  { value: "GiBrain", label: "🧠 Brain" },
  { value: "GiProcessor", label: "⚙️ Processor" },
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
  price: "",
  originalPrice: "",
  scholarshipText: "",
  emiOptionsText: "",
  showPricing: true,
  isActive: true,
});

// ── Parse existing DB data into form ─────────────────────────
const parseDetailToForm = (d) => {
  const tryParse = (v) => {
    try {
      return v ? (typeof v === "string" ? JSON.parse(v) : v) : [];
    } catch {
      return [];
    }
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
    showAlumni: !!d.ShowAlumni,
    showLegacy: !!d.ShowLegacy,
    showAiSection: !!d.ShowAiSection,
    showQuickHighlights: !!d.ShowQuickHighlights,
    showLearningJourney: !!d.ShowLearningJourney,
    showCurriculum: !!d.ShowCurriculum,
    showTools: !!d.ShowTools,
    showRealProjects: !!d.ShowRealProjects,
    showCapstone: !!d.ShowCapstone,
    showMentors: !!d.ShowMentors,
    showCredential: !!d.ShowCredential,
    showCareerSupport: !!d.ShowCareerSupport,
    price: d.Price || "",
    originalPrice: d.OriginalPrice || "",
    scholarshipText: d.ScholarshipText || "",
    emiOptionsText: d.EmiOptionsText || "",
    showPricing: d.ShowPricing !== undefined ? !!d.ShowPricing : true,
    isActive: !!d.IsActive,
  };
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const ManageCourseDetail = () => {
  const { onlineCourseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");

  // Load existing detail if present
  useEffect(() => {
    // First get course name
    adminOnlineCourseApi.getCourseById(onlineCourseId)
      .then((d) => {
        if (d.success) setCourseTitle(d.course?.Title || "");
      })
      .catch(() => {});

    // Then load existing detail
    adminOnlineCourseApi.getDetail(onlineCourseId)
      .then((d) => {
        if (d.success && d.exists) setForm(parseDetailToForm(d.detail));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [onlineCourseId]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const handle = (e) =>
    set(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value,
    );
  const toggleSection = (key) => set(key, !form[key]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.slug.trim()) return toast.error("Slug is required");
    setSaving(true);
    try {
      const payload = { ...form, onlineCourseId: parseInt(onlineCourseId) };
      const data = await adminOnlineCourseApi.saveDetail(payload);
      if (data.success) toast.success(data.message);
      else toast.error(data.message || "Error saving");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader message="Loading Course Detail..." />;
    // return (
    //   <div className="mb-page">
    //     <p style={{ padding: 40, color: "#aaa" }}>Loading...</p>
    //   </div>
    // );

  return (
    <div className="mb-page mcd-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-card mcd-header-card">
        <div className="mb-header-row">
          <div>
            <button
              className="mcd-back-btn"
              onClick={() => navigate("/admin/online-courses")}
            >
              <FaArrowLeft /> Back
            </button>
            <h2 className="mb-title" style={{ marginTop: 8 }}>
              Course Detail Page
            </h2>
            <p className="mb-subtitle">
              {courseTitle || `Course ID: ${onlineCourseId}`}
            </p>
          </div>
          <button
            className="mb-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave /> {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* ── HERO SECTION ── */}
        <div>
          <Section title="🎯 Hero Section" >
            <Grid2>
              <Field
                label="URL Slug *"
                name="slug"
                value={form.slug}
                onChange={handle}
                placeholder="e.g. executive-ai-iit-kharagpur"
              />
              <Field
                label="Badge Text"
                name="heroBadge"
                value={form.heroBadge}
                onChange={handle}
                placeholder="ADMISSIONS OPEN FOR 2026"
              />
              <Field
                label="University / Institution"
                name="university"
                value={form.university}
                onChange={handle}
                placeholder="IIT Kharagpur"
              />
              <Field
                label="Hero Duration"
                name="heroDuration"
                value={form.heroDuration}
                onChange={handle}
                placeholder="8 Months"
              />
              <Field
                label="Mode"
                name="heroMode"
                value={form.heroMode}
                onChange={handle}
                placeholder="100% Live Online"
              />
              <Field
                label="Starts"
                name="heroStarts"
                value={form.heroStarts}
                onChange={handle}
                placeholder="Dec 15, 2026"
              />
            </Grid2>
            <Grid2>
              <Field
                label="Title (Normal)"
                name="heroTitleNormal"
                value={form.heroTitleNormal}
                onChange={handle}
                placeholder="Executive Post Graduate Certificate"
              />
              <Field
                label="Title (Orange)"
                name="heroTitleOrange"
                value={form.heroTitleOrange}
                onChange={handle}
                placeholder="in AI-Native Software Engineering"
              />
            </Grid2>
            <Field
              label="Description"
              name="heroDescription"
              value={form.heroDescription}
              onChange={handle}
              textarea
              placeholder="Program description..."
            />
            <Grid2>
              <Field
                label="Review Text"
                name="heroReviewText"
                value={form.heroReviewText}
                onChange={handle}
                textarea
                placeholder="This program bridged the gap..."
              />
              <Field
                label="Review Author"
                name="heroReviewAuthor"
                value={form.heroReviewAuthor}
                onChange={handle}
                placeholder="— Alumni, Class of '23"
              />
            </Grid2>
            <Field
              label="Urgency Text"
              name="heroUrgencyText"
              value={form.heroUrgencyText}
              onChange={handle}
              placeholder="Hurry! 441 people have already applied..."
            />
            <Grid2>
              <ImageField
                label="Hero Image"
                value={form.heroImage}
                onUpload={(url) => set("heroImage", url)}
                hint="Right side image in hero section"
              />
              <PdfField
                label="Brochure PDF"
                value={form.brochureUrl}
                onUpload={(url) => set("brochureUrl", url)}
              />
            </Grid2>
            <div className="mb-checkbox-row">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handle}
              />
              <label htmlFor="isActive" className="mb-label-inline">
                Page Active (visible on website)
              </label>
            </div>
          </Section>
        </div>

        {/* ── ALUMNI ── */}
        <div>
          <Section
            title="🏢 Alumni Companies"
      
            toggle={form.showAlumni}
            toggleKey="showAlumni"
            onToggle={toggleSection}
          >
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
        </div>

        {/* ── LEGACY ── */}
        <div>
          <Section
            title="🏛️ Legacy Section"
     
            toggle={form.showLegacy}
            toggleKey="showLegacy"
            onToggle={toggleSection}
          >
            <Grid2>
              <Field
                label="Section Title"
                name="legacyTitle"
                value={form.legacyTitle}
                onChange={handle}
                placeholder="Legacy That Nurtures Excellence"
              />
              <Field
                label="Subtitle"
                name="legacySubtitle"
                value={form.legacySubtitle}
                onChange={handle}
                textarea
                placeholder="Established in 1951..."
              />
            </Grid2>
            <ArrayEditor
              label="Legacy Card"
              value={form.legacyCards}
              onChange={(v) => set("legacyCards", v)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  placeholder: "India's First IIT",
                },
                {
                  key: "description",
                  label: "Description",
                  placeholder: "For over seven decades...",
                  textarea: true,
                },
                { key: "icon", label: "Icon", type: "icon" },
              ]}
            />
          </Section>
        </div>

        {/* ── AI SECTION ── */}
        <div>
          <Section
            title="🤖 AI Systems Section"
   
            toggle={form.showAiSection}
            toggleKey="showAiSection"
            onToggle={toggleSection}
          >
            <Grid2>
              <Field
                label="Section Title"
                name="aiSectionTitle"
                value={form.aiSectionTitle}
                onChange={handle}
                placeholder="From Full Stack to AI-Native Systems"
              />
              <Field
                label="Subtext"
                name="aiSectionSubtext"
                value={form.aiSectionSubtext}
                onChange={handle}
                textarea
                placeholder="Led by the prestigious..."
              />
              <Field
                label="Stat 1 Value"
                name="aiStat1Value"
                value={form.aiStat1Value}
                onChange={handle}
                placeholder="50+"
              />
              <Field
                label="Stat 1 Label"
                name="aiStat1Label"
                value={form.aiStat1Label}
                onChange={handle}
                placeholder="AI SYSTEMS BUILT"
              />
              <Field
                label="Stat 2 Value"
                name="aiStat2Value"
                value={form.aiStat2Value}
                onChange={handle}
                placeholder="85%"
              />
              <Field
                label="Stat 2 Label"
                name="aiStat2Label"
                value={form.aiStat2Label}
                onChange={handle}
                placeholder="TRANSITION RATE"
              />
              <Field
                label="Promo Card Title"
                name="aiPromoTitle"
                value={form.aiPromoTitle}
                onChange={handle}
                placeholder="The AI Shift is Here"
              />
              <Field
                label="Promo Card Text"
                name="aiPromoText"
                value={form.aiPromoText}
                onChange={handle}
                textarea
                placeholder="By 2026, over 75%..."
              />
            </Grid2>
            <ArrayEditor
              label="Highlight"
              value={form.aiHighlights}
              onChange={(v) => set("aiHighlights", v)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  placeholder: "100% Live Online Sessions",
                },
                {
                  key: "desc",
                  label: "Description",
                  placeholder: "Interactive faculty-led...",
                  textarea: true,
                },
                { key: "icon", label: "Icon", type: "icon" },
              ]}
            />
          </Section>
        </div>

        {/* ── QUICK HIGHLIGHTS ── */}
        <div>
          <Section
            title="⚡ Quick Highlights"
  
            toggle={form.showQuickHighlights}
            toggleKey="showQuickHighlights"
            onToggle={toggleSection}
          >
            <ArrayEditor
              label="Highlight"
              value={form.quickHighlights}
              onChange={(v) => set("quickHighlights", v)}
              fields={[
                { key: "label", label: "Label", placeholder: "Duration" },
                { key: "value", label: "Value", placeholder: "11 Months" },
                { key: "icon", label: "Icon", type: "icon" },
              ]}
            />
          </Section>
        </div>

        {/* ── LEARNING JOURNEY ── */}
        <div>
          <Section
            title="🗺️ Learning Journey"
        
            toggle={form.showLearningJourney}
            toggleKey="showLearningJourney"
            onToggle={toggleSection}
          >
            <Field
              label="Section Title"
              name="learningJourneyTitle"
              value={form.learningJourneyTitle}
              onChange={handle}
              placeholder="Your 11-Month Learning Journey"
            />
            <ArrayEditor
              label="Month"
              value={form.learningJourney}
              onChange={(v) => set("learningJourney", v)}
              fields={[
                { key: "month", label: "Month", placeholder: "MONTH 1" },
                {
                  key: "title",
                  label: "Title",
                  placeholder: "Programming & Python Fundamentals",
                },
              ]}
            />
          </Section>
        </div>

        {/* ── CURRICULUM ── */}
        <div>
          <Section
            title="📚 Curriculum"
      
            toggle={form.showCurriculum}
            toggleKey="showCurriculum"
            onToggle={toggleSection}
          >
            <ArrayEditor
              label="Module"
              value={form.curriculum}
              onChange={(v) => set("curriculum", v)}
              fields={[
                {
                  key: "moduleNumber",
                  label: "Module No",
                  placeholder: "Module 1",
                },
                {
                  key: "title",
                  label: "Title",
                  placeholder: "Python for Data Science",
                },
                {
                  key: "objectives",
                  label: "Topics (comma separated)",
                  placeholder: "Pandas, NumPy, Matplotlib",
                },
              ]}
            />
            <p className="mb-hint">
              Topics: comma-separated likhein, e.g. "Pandas, NumPy, Matplotlib"
            </p>
          </Section>
        </div>

        {/* ── TOOLS ── */}
        <div>
          <Section
            title="🛠️ Tools & Technologies"

            toggle={form.showTools}
            toggleKey="showTools"
            onToggle={toggleSection}
          >
            <ArrayEditor
              label="Tool"
              value={form.tools}
              onChange={(v) => set("tools", v)}
              fields={[
                { key: "name", label: "Tool Name", placeholder: "Python" },
                { key: "image", label: "Tool Logo", type: "image" },
              ]}
            />
          </Section>
        </div>

        {/* ── REAL WORLD PROJECTS ── */}
        <div>
          <Section
            title="🚀 Real World Projects"

            toggle={form.showRealProjects}
            toggleKey="showRealProjects"
            onToggle={toggleSection}
          >
            <ArrayEditor
              label="Project"
              value={form.realWorldProjects}
              onChange={(v) => set("realWorldProjects", v)}
              fields={[
                { key: "tag", label: "Tag", placeholder: "NLP & GENAI" },
                {
                  key: "title",
                  label: "Title",
                  placeholder: "AI Resume Builder",
                },
                {
                  key: "description",
                  label: "Description",
                  placeholder: "Build an automated...",
                  textarea: true,
                },
              ]}
            />
          </Section>
        </div>

        {/* ── CAPSTONE ── */}
        <div>
          <Section
            title="🏆 Capstone Projects"
          
            toggle={form.showCapstone}
            toggleKey="showCapstone"
            onToggle={toggleSection}
          >
            <ArrayEditor
              label="Capstone"
              value={form.capstoneProjects}
              onChange={(v) => set("capstoneProjects", v)}
              fields={[
                {
                  key: "category",
                  label: "Category",
                  placeholder: "HEALTHCARE",
                },
                {
                  key: "title",
                  label: "Title",
                  placeholder: "Hospital AI System",
                },
                {
                  key: "description",
                  label: "Description",
                  placeholder: "Patient outcome...",
                  textarea: true,
                },
                { key: "icon", label: "Icon", type: "icon" },
              ]}
            />
          </Section>
        </div>

        {/* ── MENTORS ── */}
        <div>
          <Section
            title="👨‍🏫 Mentors"
          
            toggle={form.showMentors}
            toggleKey="showMentors"
            onToggle={toggleSection}
          >
            <ArrayEditor
              label="Mentor"
              value={form.mentors}
              onChange={(v) => set("mentors", v)}
              fields={[
                { key: "name", label: "Name", placeholder: "Dr. Sarah Chen" },
                {
                  key: "role",
                  label: "Role",
                  placeholder: "Head of AI Research @ Google",
                },
                { key: "image", label: "Photo", type: "image" },
                {
                  key: "linkedinUrl",
                  label: "LinkedIn URL",
                  placeholder: "https://linkedin.com/in/...",
                },
                {
                  key: "bgColor",
                  label: "Card BG Color",
                  placeholder: "#F3F4FD",
                },
              ]}
            />
          </Section>
        </div>

        {/* ── CREDENTIAL ── */}
        <div>
          <Section
            title="🎓 Credential Section"
            
            toggle={form.showCredential}
            toggleKey="showCredential"
            onToggle={toggleSection}
          >
            <Grid2>
              <Field
                label="Credential Title"
                name="credentialTitle"
                value={form.credentialTitle}
                onChange={handle}
                placeholder="A Credential That Carries Weight"
              />
              <Field
                label="Credential Subtitle"
                name="credentialSubtitle"
                value={form.credentialSubtitle}
                onChange={handle}
                textarea
                placeholder="Earn a formal certificate..."
              />
            </Grid2>
            <ImageField
              label="Certificate Image"
              value={form.certificateImage}
              onUpload={(url) => set("certificateImage", url)}
            />
            <ArrayEditor
              label="Feature"
              value={form.credentialFeatures}
              onChange={(v) => set("credentialFeatures", v)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  placeholder: "Recognised Academic Credential",
                },
                {
                  key: "description",
                  label: "Description",
                  placeholder: "Earn an official certificate...",
                  textarea: true,
                },
                { key: "icon", label: "Icon", type: "icon" },
              ]}
            />
          </Section>
        </div>

        {/* ── CAREER SUPPORT ── */}
        <div>
          <Section
            title="💼 Career Support"
     
            toggle={form.showCareerSupport}
            toggleKey="showCareerSupport"
            onToggle={toggleSection}
          >
            <p className="mb-hint">Journey Steps</p>
            <ArrayEditor
              label="Step"
              value={form.careerJourneySteps}
              onChange={(v) => set("careerJourneySteps", v)}
              fields={[
                {
                  key: "label",
                  label: "Label",
                  placeholder: "Resume Building",
                },
              ]}
            />
            <p className="mb-hint" style={{ marginTop: 16 }}>
              Stats
            </p>
            <ArrayEditor
              label="Stat"
              value={form.careerStats}
              onChange={(v) => set("careerStats", v)}
              fields={[
                { key: "value", label: "Value", placeholder: "92%" },
                {
                  key: "label",
                  label: "Label",
                  placeholder: "PLACEMENT SUPPORT",
                },
              ]}
            />
            <p className="mb-hint" style={{ marginTop: 16 }}>
              Success Stories
            </p>
            <ArrayEditor
              label="Story"
              value={form.successStories}
              onChange={(v) => set("successStories", v)}
              fields={[
                { key: "name", label: "Name", placeholder: "Vikram Singh" },
                { key: "role", label: "Role", placeholder: "Now at Amazon" },
                {
                  key: "image",
                  label: "Photo URL",
                  placeholder: "https://...",
                },
                {
                  key: "quote",
                  label: "Quote",
                  placeholder: '"The hands-on projects..."',
                  textarea: true,
                },
              ]}
            />
            <p className="mb-hint" style={{ marginTop: 16 }}>
              Learning Experience Cards
            </p>
            <ArrayEditor
              label="Card"
              value={form.learningExperience}
              onChange={(v) => set("learningExperience", v)}
              fields={[
                {
                  key: "title",
                  label: "Title",
                  placeholder: "Cohorts, Not Just Classes",
                },
                {
                  key: "description",
                  label: "Description",
                  placeholder: "Collaborate with peers...",
                  textarea: true,
                },
                { key: "icon", label: "Icon", type: "icon" },
              ]}
            />
          </Section>
        </div>

        {/* ── PROGRAM PRICING & ADMISSION FEES ── */}
        <div>
          <Section
            title="💰 Program Pricing & Admission Fees"
            toggle={form.showPricing}
            toggleKey="showPricing"
            onToggle={toggleSection}
          >
            <Grid2>
              <Field
                label="Selling Price (₹)"
                name="price"
                type="number"
                value={form.price}
                onChange={handle}
                placeholder="4999"
              />
              <Field
                label="Original Price / Strikethrough (₹)"
                name="originalPrice"
                type="number"
                value={form.originalPrice}
                onChange={handle}
                placeholder="9999"
              />
            </Grid2>
            <Grid2>
              <Field
                label="Scholarship / Offer Badge Text"
                name="scholarshipText"
                value={form.scholarshipText}
                onChange={handle}
                placeholder="Early Bird Scholarship Active"
              />
              <Field
                label="EMI Option Text"
                name="emiOptionsText"
                value={form.emiOptionsText}
                onChange={handle}
                placeholder="Or pay in flexible installments starting at ₹833/mo with 0% No-Cost EMI"
              />
            </Grid2>
          </Section>
        </div>

        {/* Save bottom */}
        <div
          style={{
            padding: "0 0 40px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="submit"
            className="mb-btn-primary"
            disabled={saving}
            style={{ fontSize: 16, padding: "12px 32px" }}
          >
            <FaSave /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageCourseDetail;

