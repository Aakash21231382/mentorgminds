import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaList,
    FaChevronDown, FaChevronUp, FaArrowLeft, FaLayerGroup, FaFileAlt,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { adminNavbarDropdownApi, navbarApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
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
    if (!url) throw new Error(`CDN response unexpected: ${JSON.stringify(d)}`);
    return url;
};

// ── Group Form ─────────────────────────────────────────────────
const GroupForm = ({ editData, navbarLinkId, onSaved, onCancel }) => {
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
        if (!form.name.trim()) return toast.error('Group name is required');
        setLoading(true);
        try {
            let imageUrl = editData?.Image || null;
            if (form.image instanceof File) imageUrl = await uploadToCDN(form.image);

            const payload = { navbarLinkId, name: form.name, image: imageUrl, sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0 };
            const data = editData ? await adminNavbarDropdownApi.updateGroup(editData.Id, payload) : await adminNavbarDropdownApi.addGroup(navbarLinkId, payload);
            if (data.success) { toast.success(editData ? 'Group updated!' : 'Group added!'); onSaved(); }
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message || 'Server error'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} className="mc-form">
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Group</> : <><FaPlus /> Add Group</>}</h3>
            <div className="mb-grid-2">
                <div>
                    <label className="mb-label">Group Name * <span style={{ fontSize: 12, color: '#a0aec0', fontWeight: 400 }}>(e.g. United States, Data Science)</span></label>
                    <input className="mb-input" name="name" value={form.name} onChange={handle} placeholder="e.g. United States" />
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div>
                    <label className="mb-label">Group Image (Flag/Icon)</label>
                    <input className="mb-input" type="file" name="image" accept="image/*" onChange={handle} />
                    {preview && <img src={preview} alt="preview" className="mb-img-preview" style={{ background: '#f5f5f5', padding: 4, maxHeight: 60 }} />}
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="grpActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="grpActive" className="mb-label-inline">Active (visible on website)</label>
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 16 }}>
                <button type="submit" className="mb-btn-primary" disabled={loading}>{loading ? 'Saving...' : editData ? 'Update' : 'Add Group'}</button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Item Form ───────────────────────────────────────────────────
const ItemForm = ({ editData, groupId, onSaved, onCancel }) => {
    const [form, setForm]       = useState({ universityName: '', universityLogo: null, title: '', url: '', slug: '', sortOrder: '0', isActive: true });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                universityName: editData.UniversityName || '', universityLogo: null,
                title: editData.Title || '', url: editData.Url || '', slug: editData.Slug || '',
                sortOrder: String(editData.SortOrder || 0), isActive: !!editData.IsActive
            });
            setPreview(editData.UniversityLogo || null);
        } else {
            setForm({ universityName: '', universityLogo: null, title: '', url: '', slug: '', sortOrder: '0', isActive: true });
            setPreview(null);
        }
    }, [editData]);

    const handle = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file' && files[0]) {
            setForm(p => ({ ...p, universityLogo: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
            // Auto-generate slug when title changes (only for new items)
            if (name === 'title' && !editData) {
                const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                setForm(p => ({ ...p, slug }));
            }
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        setLoading(true);
        try {
            let logoUrl = editData?.UniversityLogo || null;
            if (form.universityLogo instanceof File) logoUrl = await uploadToCDN(form.universityLogo);

            // Auto-generate slug if empty
            const finalSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const payload = {
                groupId, universityName: form.universityName || null, universityLogo: logoUrl,
                title: form.title, url: form.url || null, slug: finalSlug,
                sortOrder: parseInt(form.sortOrder) || 0, isActive: form.isActive ? 1 : 0
            };
            const data = editData ? await adminNavbarDropdownApi.updateItem(editData.Id, payload) : await adminNavbarDropdownApi.addItem(groupId, payload);
            if (data.success) { toast.success(editData ? 'Item updated!' : 'Item added!'); onSaved(); }
            else toast.error(data.message || 'Error');
        } catch (err) { toast.error(err.message || 'Server error'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} className="mc-form">
            <h3 className="mb-form-title">{editData ? <><FaEdit /> Edit Item</> : <><FaPlus /> Add Item</>}</h3>
            <div className="mb-grid-2">
                <div className="mb-grid-full">
                    <label className="mb-label">Title * <span style={{ fontSize: 12, color: '#a0aec0', fontWeight: 400 }}>(Course/Program name)</span></label>
                    <input className="mb-input" name="title" value={form.title} onChange={handle} placeholder="e.g. Master of Business Administration" />
                </div>
                <div>
                    <label className="mb-label">Slug (URL-friendly) <span style={{ fontSize: 12, color: '#a0aec0', fontWeight: 400 }}>(auto-generated)</span></label>
                    <input className="mb-input" name="slug" value={form.slug} onChange={handle} placeholder="master-of-business-administration" />
                </div>
                <div>
                    <label className="mb-label">University/Institution Name</label>
                    <input className="mb-input" name="universityName" value={form.universityName} onChange={handle} placeholder="e.g. Northeastern University" />
                </div>
                <div>
                    <label className="mb-label">URL (optional, legacy field)</label>
                    <input className="mb-input" name="url" value={form.url} onChange={handle} placeholder="/course-detail-page" />
                </div>
                <div>
                    <label className="mb-label">University Logo</label>
                    <input className="mb-input" type="file" name="universityLogo" accept="image/*" onChange={handle} />
                    {preview && <img src={preview} alt="logo" className="mb-img-preview" style={{ background: '#f5f5f5', padding: 4, maxHeight: 50 }} />}
                </div>
                <div>
                    <label className="mb-label">Sort Order</label>
                    <input className="mb-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handle} />
                </div>
                <div className="mb-checkbox-row" style={{ alignSelf: 'end', paddingBottom: 8 }}>
                    <input type="checkbox" id="itemActive" name="isActive" checked={form.isActive} onChange={handle} />
                    <label htmlFor="itemActive" className="mb-label-inline">Active</label>
                </div>
            </div>
            <div className="mb-form-actions" style={{ marginTop: 16 }}>
                <button type="submit" className="mb-btn-primary" disabled={loading}>{loading ? 'Saving...' : editData ? 'Update Item' : 'Add Item'}</button>
                {onCancel && <button type="button" className="mb-btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

// ── Group Row with expandable items ─────────────────────────────
const GroupRow = ({ group, onEditGroup, onDeleteGroup, onToggleGroup, onRefresh, navbarLinkId }) => {
    const navigate = useNavigate();
    const [expanded, setExpanded]         = useState(false);
    const [items, setItems]               = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editItem, setEditItem]         = useState(null);

    const loadItems = async () => {
        setLoadingItems(true);
        try {
            const data = await adminNavbarDropdownApi.getItems(group.Id);
            if (data.success) setItems(data.items || []);
        } catch (err) { console.error(err); }
        finally { setLoadingItems(false); }
    };

    const handleExpand = () => {
        if (!expanded) loadItems();
        setExpanded(p => !p);
        setShowItemForm(false);
        setEditItem(null);
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        const data = await adminNavbarDropdownApi.deleteItem(id);
        if (data.success) { toast.success('Item deleted'); loadItems(); onRefresh(); }
        else toast.error(data.message || 'Delete failed');
    };

    const handleToggleItem = async (id) => {
        await adminNavbarDropdownApi.toggleItem(id);
        loadItems();
    };

    const onItemSaved = () => { setShowItemForm(false); setEditItem(null); loadItems(); onRefresh(); };

    return (
        <div className={`mc-cat-row ${group.IsActive ? 'mc-cat--active' : 'mc-cat--inactive'}`}>
            {/* Group header */}
            <div className="mc-cat-header">
                <div className="mc-cat-thumb">
                    {group.Image
                        ? <img src={group.Image} alt={group.Name} style={{ maxHeight: 40, maxWidth: 50, objectFit: 'contain' }} />
                        : <span className="mc-cat-noimg">No Img</span>}
                </div>
                <div className="mc-cat-info">
                    <span className="mc-cat-name">{group.Name}</span>
                    <span className="mc-cat-count">{group.ItemCount} item{group.ItemCount !== 1 ? 's' : ''}</span>
                    <span className={group.IsActive ? 'mb-badge-active' : 'mb-badge-inactive'}>
                        {group.IsActive ? 'Active' : 'Hidden'}
                    </span>
                </div>
                <div className="mc-cat-actions">
                    <button className="mb-btn-toggle" onClick={() => onToggleGroup(group.Id)} title="Toggle">
                        {group.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                    </button>
                    <button className="mb-btn-edit" onClick={() => onEditGroup(group)}>
                        <FaEdit /> Edit
                    </button>
                    <button className="mb-btn-delete" onClick={() => onDeleteGroup(group.Id)}>
                        <FaTrash /> Delete
                    </button>
                    <button className="mc-expand-btn" onClick={handleExpand}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />} Items
                    </button>
                </div>
            </div>

            {/* Items panel */}
            {expanded && (
                <div className="mc-courses-panel">
                    <div className="mc-courses-toolbar">
                        <span className="mc-courses-label">Items in "{group.Name}"</span>
                        <button className="mb-btn-primary mc-add-course-btn"
                            onClick={() => { setShowItemForm(true); setEditItem(null); }}>
                            <FaPlus /> Add Item
                        </button>
                    </div>

                    {(showItemForm || editItem) && (
                        <div className="mc-course-form-wrap">
                            <ItemForm
                                editData={editItem}
                                groupId={group.Id}
                                onSaved={onItemSaved}
                                onCancel={() => { setShowItemForm(false); setEditItem(null); }}
                            />
                        </div>
                    )}

                    {loadingItems ? (
                        <PageLoader message="Loading items..." />
                    ) : items.length === 0 ? (
                        <p className="mc-no-courses">No items yet. Add one above!</p>
                    ) : (
                        <div className="mc-course-list">
                            {items.map(item => (
                                <div key={item.Id} className={`mc-course-item ${item.IsActive ? '' : 'mc-course--inactive'}`}>
                                    <div className="mc-course-logo">
                                        {item.UniversityLogo
                                            ? <img src={item.UniversityLogo} alt={item.UniversityName} style={{ maxHeight: 40 }} />
                                            : <span className="mc-cat-noimg">No Logo</span>}
                                    </div>
                                    <div className="mc-course-info">
                                        <p className="mc-course-title">{item.Title}</p>
                                        <p className="mc-course-meta">{item.UniversityName || '—'} | Sort: {item.SortOrder}</p>
                                        {item.Url && <p className="mc-course-meta" style={{ fontSize: 11, color: '#a0aec0' }}>URL: {item.Url}</p>}
                                    </div>
                                    <div className="mb-item-actions">
                                        <button className="mb-btn-toggle" onClick={() => handleToggleItem(item.Id)}>
                                            {item.IsActive ? <FaToggleOn style={{ color: '#48bb78' }} /> : <FaToggleOff style={{ color: '#cbd5e0' }} />}
                                        </button>
                                        <button
                                            className="mb-btn-edit"
                                            style={{ background: '#f0fff4', color: '#276749' }}
                                            onClick={() => navigate(`/admin/navbar-dropdown-detail/${item.Slug || item.Id}`, { 
                                                state: { returnTo: `/admin/navbar-dropdown/${navbarLinkId}` }
                                            })}
                                            title="Manage Detail Page"
                                        >
                                            <FaFileAlt /> Detail Page
                                        </button>
                                        <button className="mb-btn-edit" onClick={() => { setEditItem(item); setShowItemForm(false); }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="mb-btn-delete" onClick={() => handleDeleteItem(item.Id)}>
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

// ── Main ManageNavbarDropdown ───────────────────────────────────
const ManageNavbarDropdown = () => {
    const { navbarLinkId } = useParams();
    const navigate = useNavigate();
    
    // Helper: Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const [navbarLink, setNavbarLink]     = useState(null);
    const [groups, setGroups]             = useState([]);
    const [loading, setLoading]           = useState(true);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [editGroup, setEditGroup]       = useState(null);

    const loadGroups = () => {
        setLoading(true);
        adminNavbarDropdownApi.getGroups(navbarLinkId)
            .then(d => { if (d.success) setGroups(d.groups || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        // Fetch navbar link details
        navbarApi.getNavbarLinks()
            .then(res => {
                if (res.success) {
                    const link = res.flatLinks?.find(l => l.Id === parseInt(navbarLinkId));
                    setNavbarLink(link || null);
                }
            })
            .catch(console.error);

        loadGroups();
    }, [navbarLinkId]);

    const handleToggleGroup = async (id) => {
        await adminNavbarDropdownApi.toggleGroup(id);
        loadGroups();
    };

    const handleDeleteGroup = async (id) => {
        if (!window.confirm('Delete this group and ALL its items?')) return;
        const data = await adminNavbarDropdownApi.deleteGroup(id);
        if (data.success) { toast.success('Group deleted'); loadGroups(); }
        else toast.error(data.message || 'Delete failed');
    };

    const onGroupSaved = () => { setShowGroupForm(false); setEditGroup(null); loadGroups(); };

    return (
        <div className="mb-page">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header / Form card */}
            <div className="mb-card">
                {editGroup ? (
                    <GroupForm editData={editGroup} navbarLinkId={navbarLinkId} onSaved={onGroupSaved} onCancel={() => setEditGroup(null)} />
                ) : showGroupForm ? (
                    <GroupForm navbarLinkId={navbarLinkId} onSaved={onGroupSaved} onCancel={() => setShowGroupForm(false)} />
                ) : (
                    <div className="mb-header-row">
                        <div>
                            <h2 className="mb-title">
                                <FaLayerGroup style={{ color: '#F6881F', marginRight: 8 }} />
                                Manage Mega Dropdown: <span style={{ color: '#F6881F' }}>{navbarLink?.Title || '...'}</span>
                            </h2>
                            <p className="mb-subtitle">
                                Add Groups (Countries/Categories) and Items (Courses/Programs). Frontend mein mega dropdown automatically show hogi.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="mb-btn-secondary" onClick={() => navigate('/admin/manage-navbar')}>
                                <FaArrowLeft /> Back to Navbar
                            </button>
                            <button className="mb-btn-primary" onClick={() => setShowGroupForm(true)}>
                                <FaPlus /> Add Group
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Groups list */}
            {!showGroupForm && !editGroup && (
                <div className="mb-card">
                    <h3 className="mb-list-title"><FaList /> All Groups ({groups.length})</h3>
                    {loading ? (
                        <PageLoader message="Loading groups..." />
                    ) : groups.length === 0 ? (
                        <p className="mb-empty">No groups yet. Add one above!</p>
                    ) : (
                        <div className="mc-cat-list">
                            {groups.map(grp => (
                                <GroupRow
                                    key={grp.Id}
                                    group={grp}
                                    navbarLinkId={navbarLinkId}
                                    onEditGroup={setEditGroup}
                                    onDeleteGroup={handleDeleteGroup}
                                    onToggleGroup={handleToggleGroup}
                                    onRefresh={loadGroups}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageNavbarDropdown;
