import React, { useState, useEffect } from 'react';
import { FaSave, FaImage, FaStar, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminSubscriptionBannerApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageBanners.css';

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

// Available icon options for features
const ICON_OPTIONS = [
    { value: 'BsStars',     label: '✨ Stars' },
    { value: 'FaTrophy',    label: '🏆 Trophy' },
    { value: 'TiMessages',  label: '💬 Messages' },
    { value: 'FaLightbulb', label: '💡 Lightbulb' },
    { value: 'FaStar',      label: '⭐ Star' },
    { value: 'FaRocket',    label: '🚀 Rocket' },
    { value: 'FaGraduationCap', label: '🎓 Graduation' },
    { value: 'FaUsers',     label: '👥 Users' },
    { value: 'FaChartBar',  label: '📊 Chart' },
    { value: 'FaCode',      label: '💻 Code' },
];

const defaultForm = {
    heading: 'Build your career with a Personal Plan subscription',
    description: 'Subscribers save an average of ₹4,000+ in their first month, stop paying per course. Join 5 lakh+ learners, starting at ₹500/month.',
    feature1Label: 'Learn AI and more',         feature1Icon: 'BsStars',    feature1Color: '#deeae5',
    feature2Label: 'Prep for a certification',  feature2Icon: 'FaTrophy',   feature2Color: '#BBE7D3',
    feature3Label: 'Practice with AI coaching', feature3Icon: 'TiMessages', feature3Color: '#efd99e',
    feature4Label: 'Advance your career',       feature4Icon: 'FaLightbulb',feature4Color: '#BBE7D3',
    btnText: 'Register Now',
    btnLink: '/signup',
    image: null,
    isActive: true,
};

const ManageSubscriptionBanner = () => {
    const [form, setForm]         = useState(defaultForm);
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    // Load existing data
    useEffect(() => {
        adminSubscriptionBannerApi.get()
            .then(d => {
                if (d.success && d.data) {
                    const x = d.data;
                    setForm({
                        heading:      x.Heading      || defaultForm.heading,
                        description:  x.Description  || defaultForm.description,
                        feature1Label: x.Feature1Label || '', feature1Icon: x.Feature1Icon || 'BsStars',    feature1Color: x.Feature1Color || '#deeae5',
                        feature2Label: x.Feature2Label || '', feature2Icon: x.Feature2Icon || 'FaTrophy',   feature2Color: x.Feature2Color || '#BBE7D3',
                        feature3Label: x.Feature3Label || '', feature3Icon: x.Feature3Icon || 'TiMessages', feature3Color: x.Feature3Color || '#efd99e',
                        feature4Label: x.Feature4Label || '', feature4Icon: x.Feature4Icon || 'FaLightbulb',feature4Color: x.Feature4Color || '#BBE7D3',
                        btnText:  x.BtnText  || 'Register Now',
                        btnLink:  x.BtnLink  || '/signup',
                        image:    null,
                        isActive: x.IsActive !== undefined ? !!x.IsActive : true,
                    });
                    setImgPreview(x.Image || null);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handle = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file' && files[0]) {
            setForm(p => ({ ...p, image: files[0] }));
            setImgPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let imageUrl = imgPreview && !form.image ? imgPreview : null;
            if (form.image instanceof File) imageUrl = await uploadToCDN(form.image);

            const payload = {
                heading:      form.heading,
                description:  form.description,
                feature1Label: form.feature1Label, feature1Icon: form.feature1Icon, feature1Color: form.feature1Color,
                feature2Label: form.feature2Label, feature2Icon: form.feature2Icon, feature2Color: form.feature2Color,
                feature3Label: form.feature3Label, feature3Icon: form.feature3Icon, feature3Color: form.feature3Color,
                feature4Label: form.feature4Label, feature4Icon: form.feature4Icon, feature4Color: form.feature4Color,
                btnText:  form.btnText,
                btnLink:  form.btnLink,
                image:    imageUrl,
                isActive: form.isActive ? 1 : 0,
            };

            const data = await adminSubscriptionBannerApi.save(payload);
            if (data.success) toast.success('Subscription Banner saved!');
            else toast.error(data.message || 'Error saving');
        } catch (err) {
            toast.error(err.message || 'Server error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader message="Loading..." />;

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            <form onSubmit={handleSave}>
                {/* Header */}
                <div className="mb-card">
                    <div className="mb-header-row">
                        <div>
                            <h2 className="mb-title">
                                <FaStar style={{ color: '#F6881F', marginRight: 8 }} />
                                Manage Subscription Banner
                            </h2>
                            <p className="mb-subtitle">Homepage mein jo dark subscription section hai usse manage karo.</p>
                        </div>
                        <button type="submit" className="mb-btn-primary" disabled={saving}>
                            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Main Content & Description */}
                <div className="mb-card">
                    <h3 className="mb-list-title">📝 Heading & Description</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label className="mb-label">Main Heading</label>
                            <input className="mb-input" name="heading" value={form.heading} onChange={handle}
                                placeholder="Build your career with a Personal Plan subscription" />
                        </div>
                        <div>
                            <label className="mb-label">Description</label>
                            <textarea className="mb-textarea" name="description" value={form.description} onChange={handle}
                                placeholder="Subscribers save an average of..." rows={3} />
                        </div>
                    </div>
                </div>

                {/* Feature Items */}
                <div className="mb-card">
                    <h3 className="mb-list-title">✨ Feature Items (4 items)</h3>
                    <div className="mb-grid-2">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} style={{ background: '#f8fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
                                <p style={{ fontWeight: 700, marginBottom: 12, color: '#1a202c' }}>Feature {n}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div>
                                        <label className="mb-label">Label Text</label>
                                        <input className="mb-input" name={`feature${n}Label`} value={form[`feature${n}Label`]} onChange={handle} placeholder="e.g. Learn AI and more" />
                                    </div>
                                    <div>
                                        <label className="mb-label">Icon</label>
                                        <select className="mb-input" name={`feature${n}Icon`} value={form[`feature${n}Icon`]} onChange={handle}>
                                            {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-label">Icon Background Color</label>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <input type="color" name={`feature${n}Color`} value={form[`feature${n}Color`]} onChange={handle}
                                                style={{ width: 44, height: 36, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                                            <input className="mb-input" name={`feature${n}Color`} value={form[`feature${n}Color`]} onChange={handle}
                                                placeholder="#deeae5" style={{ flex: 1 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Button & Image */}
                <div className="mb-card">
                    <h3 className="mb-list-title">🔗 Button & Image</h3>
                    <div className="mb-grid-2">
                        <div>
                            <label className="mb-label">Button Text</label>
                            <input className="mb-input" name="btnText" value={form.btnText} onChange={handle} placeholder="Register Now" />
                        </div>
                        <div>
                            <label className="mb-label">Button Link (URL or path)</label>
                            <input className="mb-input" name="btnLink" value={form.btnLink} onChange={handle} placeholder="/signup" />
                        </div>
                        <div>
                            <label className="mb-label"><FaImage style={{ marginRight: 6 }} /> Right Side Image (Girl/Person)</label>
                            <input className="mb-input" type="file" name="image" accept="image/*" onChange={handle} />
                            {imgPreview && (
                                <img src={imgPreview} alt="preview" className="mb-img-preview" style={{ maxHeight: 100, marginTop: 8 }} />
                            )}
                        </div>
                        <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                            <input type="checkbox" id="subActive" name="isActive" checked={form.isActive} onChange={handle} />
                            <label htmlFor="subActive" className="mb-label-inline">Active (visible on website)</label>
                        </div>
                    </div>
                </div>

                {/* Save bottom */}
                <div style={{ padding: '0 0 40px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="mb-btn-primary" disabled={saving} style={{ fontSize: 16, padding: '12px 32px' }}>
                        <FaSave /> {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageSubscriptionBanner;
