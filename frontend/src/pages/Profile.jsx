import React, { useState, useEffect, useRef } from "react";
import { 
  FaUser, FaFileAlt, FaBook, FaGlobe, FaCertificate, FaBriefcase, 
  FaCamera, FaEdit, FaChevronRight 
} from "react-icons/fa";
import T from "../context/T";
import { authApi } from "../api/authApi";
import { toast } from 'react-toastify';
import "../assets/css/Profile.css";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // ================= MODAL & FORM STATES =================
  // activeModal: null | 'personal' | 'contact' | 'permAddress' | 'currAddress' | 'parents' | 'social'
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await authApi.getProfile(); 
        
        if (response && response.user) {
           setUserData(response.user);
           // localStorage bhi update karo latest data se
           localStorage.setItem("user", JSON.stringify(response.user));
           window.dispatchEvent(new Event("userUpdated"));
        } else if (response) {
           setUserData(response);
        }
        
      } catch (err) {
        console.error("Failed to fetch profile from API:", err);
        const localUser = localStorage.getItem("user");
        
        if (localUser && localUser !== "undefined" && localUser !== "null") {
          try {
            setUserData(JSON.parse(localUser));
          } catch (parseErr) {
            console.error("Error parsing local storage data:", parseErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const nameArray = name.trim().split(" ");
    if (nameArray.length >= 2) {
      return (nameArray[0][0] + nameArray[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImg(true);

      // Step 1: External service par image upload karo
      const uploadResponse = await authApi.uploadProfileImage(file);
      const apiResult = uploadResponse.data.result;
      let newImageUrl = "";

      if (apiResult) {
        if (Array.isArray(apiResult.variants) && apiResult.variants.length > 0) {
          newImageUrl = apiResult.variants[0];
        } else if (typeof apiResult === 'string') {
          newImageUrl = apiResult;
        } else {
          newImageUrl = apiResult.url || apiResult.fileUrl || apiResult.path;
        }
      }

      if (!newImageUrl || newImageUrl === "undefined") {
        toast.error("Could not get image URL. Please try again.");
        return;
      }

      // Step 2: URL ko apne backend database mein save karo
      await authApi.updateProfileImageUrl(newImageUrl);

      // Step 3: UI aur localStorage update karo
      const updatedUser = { ...userData, profile_image: newImageUrl, ProfileImage: newImageUrl };
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      toast.success("Profile photo updated successfully!");

    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImg(false);
    }
  };

  // ================= FORM HANDLERS =================
  
  const openModal = (modalType) => {
    const d = userData || {};
    if (modalType === 'personal') {
      setFormData({
        dob: d.DOB ? d.DOB.split('T')[0] : (d.dob ? d.dob.split('T')[0] : ""),
        gender: d.Gender || d.gender || "",
        highest_qualification: d.HighestQualification || d.highest_qualification || "",
        marital_status: d.MaritalStatus || d.marital_status || "",
      });
    } else if (modalType === 'contact') {
      setFormData({
        phone: d.Phone || d.phone || "",
        whatsapp: d.WhatsApp || d.whatsapp || "",
        alt_phone: d.AltPhone || d.alt_phone || "",
        alt_email: d.AltEmail || d.alt_email || "",
      });
    } else if (modalType === 'permAddress') {
      setFormData({
        perm_house_no: d.PermHouseNo || d.perm_house_no || "",
        perm_apt_name: d.PermAptName || d.perm_apt_name || "",
        perm_locality: d.PermLocality || d.perm_locality || "",
        perm_country: d.PermCountry || d.perm_country || "",
        perm_city: d.PermCity || d.perm_city || "",
        perm_pincode: d.PermPincode || d.perm_pincode || "",
      });
    } else if (modalType === 'currAddress') {
      setFormData({
        curr_house_no: d.CurrHouseNo || d.curr_house_no || "",
        curr_apt_name: d.CurrAptName || d.curr_apt_name || "",
        curr_locality: d.CurrLocality || d.curr_locality || "",
        curr_country: d.CurrCountry || d.curr_country || "",
        curr_city: d.CurrCity || d.curr_city || "",
        curr_pincode: d.CurrPincode || d.curr_pincode || "",
      });
    } else if (modalType === 'parents') {
      setFormData({
        father_name: d.FatherName || d.father_name || "",
        father_education: d.FatherEducation || d.father_education || "",
        mother_name: d.MotherName || d.mother_name || "",
        mother_education: d.MotherEducation || d.mother_education || "",
        parent_mobile: d.ParentMobile || d.parent_mobile || "",
      });
    } else if (modalType === 'social') {
      setFormData({
        linkedin: d.LinkedIn || d.linkedin || "",
        github: d.GitHub || d.github || "",
        instagram: d.Instagram || d.instagram || "",
      });
    }
    setActiveModal(modalType);
  };

  const closeModal = () => setActiveModal(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.updateProfile(formData);
      
      if (response && response.success) {
        const updatedUser = response.user;
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userUpdated"));
        closeModal();
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMsg);
    }
  };

  if (loading) return <div className="profile-loading"><div className="loader"></div> <T>Loading Profile...</T></div>;

  const fullNameParts = (userData?.full_name || userData?.FullName || "").split(" ");
  const firstName = fullNameParts[0] || "N/A";
  const lastName = fullNameParts.slice(1).join(" ") || "N/A";

  return (
    <div className="upgrad-profile-container container">
      <div className="profile-breadcrumb">
        <span>
          <Link to="/" className="breadcrumb-home-link">
            <T>Home</T>
          </Link>
        </span> 
        <FaChevronRight className="breadcrumb-chevron" /> 
        <span className="active-crumb"><T>Profile</T></span>
      </div>

      <div className="profile-main-layout">
        
        <div className="profile-left-sidebar">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar-wrapper">
              {uploadingImg ? (
                <div className="sidebar-initials"><T>...</T></div>
              ) : userData?.profile_image || userData?.ProfileImage ? (
                <img src={userData?.profile_image || userData?.ProfileImage} alt="Profile" className="sidebar-img" />
              ) : (
                <div className="sidebar-initials">{getInitials(userData?.full_name || userData?.FullName)}</div>
              )}
              
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="sidebar-file-input"
                onChange={handleImageUpload} 
              />
              <button className="sidebar-camera-btn" onClick={handleCameraClick} disabled={uploadingImg}>
                <FaCamera />
              </button>
            </div>
            <h3 className="sidebar-name">{userData?.full_name || userData?.FullName || "User Name"}</h3>
            <p className="sidebar-email">{userData?.email || userData?.Email || "email@example.com"}</p>
          </div>

          <div className="sidebar-nav-links">
            <div 
              className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="nav-icon" /> <T>Profile</T>
            </div>
            <div className="sidebar-nav-item" onClick={() => toast.info('Coming soon! 🚀')}>
              <FaFileAlt className="nav-icon" /> <T>My applications</T>
            </div>
            <div className="sidebar-nav-item" onClick={() => toast.info('Coming soon! 🚀')}>
              <FaBook className="nav-icon" /> <T>My courses</T>
            </div>
            <div className="sidebar-nav-item" onClick={() => toast.info('Coming soon! 🚀')}>
              <FaGlobe className="nav-icon" /> <T>My external courses</T>
            </div>
            <div className="sidebar-nav-item" onClick={() => toast.info('Coming soon! 🚀')}>
              <FaCertificate className="nav-icon" /> <T>My certificates</T>
            </div>
            <div className="sidebar-nav-item" onClick={() => toast.info('Coming soon! 🚀')}>
              <FaBriefcase className="nav-icon" /> <T>Applied jobs</T>
            </div>
          </div>
        </div>

        <div className="profile-right-content">
          <h2 className="content-main-title"><T>Profile</T></h2>

          <div className="details-card-box">
            <div className="details-card-header">
              <div className="title-with-badge">
                <h3><T>Personal details</T></h3>
              </div>
              <button className="edit-icon-btn" onClick={() => openModal('personal')}><FaEdit /></button>
            </div>
            <div className="details-table">
              <div className="table-row"><span className="row-label"><T>First Name</T></span><span className="row-value">{firstName}</span></div>
              <div className="table-row"><span className="row-label"><T>Last Name</T></span><span className="row-value">{lastName}</span></div>
              <div className="table-row"><span className="row-label"><T>Date of Birth</T></span><span className="row-value">{userData?.DOB ? userData.DOB.split('T')[0] : userData?.dob ? userData.dob.split('T')[0] : <span className="add-link" onClick={() => openModal('personal')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Gender</T></span><span className="row-value">{userData?.Gender || userData?.gender || <span className="add-link" onClick={() => openModal('personal')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Highest Qualification</T></span><span className="row-value">{userData?.HighestQualification || userData?.highest_qualification || <span className="add-link" onClick={() => openModal('personal')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Marital Status</T></span><span className="row-value">{userData?.MaritalStatus || userData?.marital_status || <span className="add-link" onClick={() => openModal('personal')}><T>Add</T></span>}</span></div>
            </div>
          </div>

          <div className="details-card-box">
            <div className="details-card-header">
              <div className="title-with-badge">
                <h3><T>Contact Information</T></h3>
              </div>
              <button className="edit-icon-btn" onClick={() => openModal('contact')}><FaEdit /></button>
            </div>
            <div className="details-table">
              <div className="table-row"><span className="row-label"><T>Phone Number</T></span><span className="row-value">{userData?.Phone || userData?.phone || <span className="add-link" onClick={() => openModal('contact')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>WhatsApp Number</T></span><span className="row-value">{userData?.WhatsApp || userData?.whatsapp || <span className="add-link" onClick={() => openModal('contact')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Alt. Phone number</T></span><span className="row-value">{userData?.AltPhone || userData?.alt_phone || <span className="add-link" onClick={() => openModal('contact')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Email ID</T></span><span className="row-value">{userData?.email || userData?.Email}</span></div>
              <div className="table-row"><span className="row-label"><T>Alternate Email ID</T></span><span className="row-value">{userData?.AltEmail || userData?.alt_email || <span className="add-link" onClick={() => openModal('contact')}><T>Add</T></span>}</span></div>
            </div>
          </div>

          <div className="details-card-box">
            <div className="details-card-header">
              <div className="title-with-badge">
                <h3><T>Permanent address</T></h3>
              </div>
              <button className="edit-icon-btn" onClick={() => openModal('permAddress')}><FaEdit /></button>
            </div>
            <div className="details-table">
              <div className="table-row"><span className="row-label"><T>House Number/Street Name</T></span><span className="row-value">{userData?.PermHouseNo || userData?.perm_house_no || <span className="add-link" onClick={() => openModal('permAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Apt Name</T></span><span className="row-value">{userData?.PermAptName || userData?.perm_apt_name || <span className="add-link" onClick={() => openModal('permAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Locality/Area</T></span><span className="row-value">{userData?.PermLocality || userData?.perm_locality || <span className="add-link" onClick={() => openModal('permAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Country</T></span><span className="row-value">{userData?.PermCountry || userData?.perm_country || <span className="add-link" onClick={() => openModal('permAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>City/District</T></span><span className="row-value">{userData?.PermCity || userData?.perm_city || <span className="add-link" onClick={() => openModal('permAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Postal Code/PIN Code</T></span><span className="row-value">{userData?.PermPincode || userData?.perm_pincode || <span className="add-link" onClick={() => openModal('permAddress')}><T>Add</T></span>}</span></div>
            </div>
          </div>

          <div className="details-card-box">
            <div className="details-card-header">
              <div className="title-with-badge">
                <h3><T>Current address</T></h3>
              </div>
              <button className="edit-icon-btn" onClick={() => openModal('currAddress')}><FaEdit /></button>
            </div>
            <div className="details-table">
              <div className="table-row"><span className="row-label"><T>House Number/Street Name</T></span><span className="row-value">{userData?.CurrHouseNo || userData?.curr_house_no || <span className="add-link" onClick={() => openModal('currAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Apt Name</T></span><span className="row-value">{userData?.CurrAptName || userData?.curr_apt_name || <span className="add-link" onClick={() => openModal('currAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Locality/Area</T></span><span className="row-value">{userData?.CurrLocality || userData?.curr_locality || <span className="add-link" onClick={() => openModal('currAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Country</T></span><span className="row-value">{userData?.CurrCountry || userData?.curr_country || <span className="add-link" onClick={() => openModal('currAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>City/District</T></span><span className="row-value">{userData?.CurrCity || userData?.curr_city || <span className="add-link" onClick={() => openModal('currAddress')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Postal Code/PIN Code</T></span><span className="row-value">{userData?.CurrPincode || userData?.curr_pincode || <span className="add-link" onClick={() => openModal('currAddress')}><T>Add</T></span>}</span></div>
            </div>
          </div>

          <div className="details-card-box">
            <div className="details-card-header">
              <div className="title-with-badge">
                <h3><T>Parents details</T></h3>
              </div>
              <button className="edit-icon-btn" onClick={() => openModal('parents')}><FaEdit /></button>
            </div>
            <div className="details-table">
              <div className="table-row"><span className="row-label"><T>Father's Name</T></span><span className="row-value">{userData?.FatherName || userData?.father_name || <span className="add-link" onClick={() => openModal('parents')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Father Education</T></span><span className="row-value">{userData?.FatherEducation || userData?.father_education || <span className="add-link" onClick={() => openModal('parents')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Mother's Name</T></span><span className="row-value">{userData?.MotherName || userData?.mother_name || <span className="add-link" onClick={() => openModal('parents')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Mother Education</T></span><span className="row-value">{userData?.MotherEducation || userData?.mother_education || <span className="add-link" onClick={() => openModal('parents')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Parent Mobile Number</T></span><span className="row-value">{userData?.ParentMobile || userData?.parent_mobile || <span className="add-link" onClick={() => openModal('parents')}><T>Add</T></span>}</span></div>
            </div>
          </div>

          {/* Card 6: Social Links */}
          <div className="details-card-box">
            <div className="details-card-header">
              <div className="title-with-badge">
                <h3><T>Social Links</T></h3>
              </div>
              <button className="edit-icon-btn" onClick={() => openModal('social')}><FaEdit /></button>
            </div>
            <div className="details-table">
              <div className="table-row"><span className="row-label"><T>LinkedIn Profile</T></span><span className="row-value">{userData?.LinkedIn || userData?.linkedin || <span className="add-link" onClick={() => openModal('social')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>GitHub Profile</T></span><span className="row-value">{userData?.GitHub || userData?.github || <span className="add-link" onClick={() => openModal('social')}><T>Add</T></span>}</span></div>
              <div className="table-row"><span className="row-label"><T>Instagram Profile</T></span><span className="row-value">{userData?.Instagram || userData?.instagram || <span className="add-link" onClick={() => openModal('social')}><T>Add</T></span>}</span></div>
            </div>
          </div>

        </div>

      </div>

      {/* ================= MODALS ================= */}

      {/* Modal 1: Personal Details */}
      {activeModal === 'personal' && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h3><T>Edit Personal Details</T></h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><T>Date of Birth</T></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label><T>Gender</T></label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><T>Highest Qualification</T></label>
                  <input type="text" name="highest_qualification" value={formData.highest_qualification} onChange={handleInputChange} placeholder="e.g. B.Tech, MBA" />
                </div>
                <div className="form-group">
                  <label><T>Marital Status</T></label>
                  <select name="marital_status" value={formData.marital_status} onChange={handleInputChange}>
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}><T>Cancel</T></button>
                <button type="submit" className="save-btn"><T>Save Changes</T></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Contact Information */}
      {activeModal === 'contact' && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h3><T>Edit Contact Information</T></h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><T>Phone Number</T></label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label><T>WhatsApp Number</T></label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label><T>Alt. Phone Number</T></label>
                  <input type="text" name="alt_phone" value={formData.alt_phone} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label><T>Alternate Email ID</T></label>
                  <input type="email" name="alt_email" value={formData.alt_email} onChange={handleInputChange} placeholder="alt@example.com" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}><T>Cancel</T></button>
                <button type="submit" className="save-btn"><T>Save Changes</T></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Permanent Address */}
      {activeModal === 'permAddress' && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h3><T>Edit Permanent Address</T></h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><T>House Number/Street Name</T></label>
                  <input type="text" name="perm_house_no" value={formData.perm_house_no} onChange={handleInputChange} placeholder="e.g. 123, Main Street" />
                </div>
                <div className="form-group">
                  <label><T>Apt Name</T></label>
                  <input type="text" name="perm_apt_name" value={formData.perm_apt_name} onChange={handleInputChange} placeholder="e.g. Sunshine Apartments" />
                </div>
                <div className="form-group">
                  <label><T>Locality/Area</T></label>
                  <input type="text" name="perm_locality" value={formData.perm_locality} onChange={handleInputChange} placeholder="e.g. Sector 15" />
                </div>
                <div className="form-group">
                  <label><T>Country</T></label>
                  <input type="text" name="perm_country" value={formData.perm_country} onChange={handleInputChange} placeholder="e.g. India" />
                </div>
                <div className="form-group">
                  <label><T>City/District</T></label>
                  <input type="text" name="perm_city" value={formData.perm_city} onChange={handleInputChange} placeholder="e.g. Delhi" />
                </div>
                <div className="form-group">
                  <label><T>Postal Code/PIN Code</T></label>
                  <input type="text" name="perm_pincode" value={formData.perm_pincode} onChange={handleInputChange} placeholder="e.g. 110001" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}><T>Cancel</T></button>
                <button type="submit" className="save-btn"><T>Save Changes</T></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Current Address */}
      {activeModal === 'currAddress' && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h3><T>Edit Current Address</T></h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><T>House Number/Street Name</T></label>
                  <input type="text" name="curr_house_no" value={formData.curr_house_no} onChange={handleInputChange} placeholder="e.g. 123, Main Street" />
                </div>
                <div className="form-group">
                  <label><T>Apt Name</T></label>
                  <input type="text" name="curr_apt_name" value={formData.curr_apt_name} onChange={handleInputChange} placeholder="e.g. Sunshine Apartments" />
                </div>
                <div className="form-group">
                  <label><T>Locality/Area</T></label>
                  <input type="text" name="curr_locality" value={formData.curr_locality} onChange={handleInputChange} placeholder="e.g. Sector 15" />
                </div>
                <div className="form-group">
                  <label><T>Country</T></label>
                  <input type="text" name="curr_country" value={formData.curr_country} onChange={handleInputChange} placeholder="e.g. India" />
                </div>
                <div className="form-group">
                  <label><T>City/District</T></label>
                  <input type="text" name="curr_city" value={formData.curr_city} onChange={handleInputChange} placeholder="e.g. Delhi" />
                </div>
                <div className="form-group">
                  <label><T>Postal Code/PIN Code</T></label>
                  <input type="text" name="curr_pincode" value={formData.curr_pincode} onChange={handleInputChange} placeholder="e.g. 110001" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}><T>Cancel</T></button>
                <button type="submit" className="save-btn"><T>Save Changes</T></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Parents Details */}
      {activeModal === 'parents' && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h3><T>Edit Parents Details</T></h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><T>Father's Name</T></label>
                  <input type="text" name="father_name" value={formData.father_name} onChange={handleInputChange} placeholder="Enter father's name" />
                </div>
                <div className="form-group">
                  <label><T>Father Education</T></label>
                  <input type="text" name="father_education" value={formData.father_education} onChange={handleInputChange} placeholder="e.g. B.A., M.A." />
                </div>
                <div className="form-group">
                  <label><T>Mother's Name</T></label>
                  <input type="text" name="mother_name" value={formData.mother_name} onChange={handleInputChange} placeholder="Enter mother's name" />
                </div>
                <div className="form-group">
                  <label><T>Mother Education</T></label>
                  <input type="text" name="mother_education" value={formData.mother_education} onChange={handleInputChange} placeholder="e.g. B.Sc., M.Sc." />
                </div>
                <div className="form-group">
                  <label><T>Parent Mobile Number</T></label>
                  <input type="text" name="parent_mobile" value={formData.parent_mobile} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}><T>Cancel</T></button>
                <button type="submit" className="save-btn"><T>Save Changes</T></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Social Links */}
      {activeModal === 'social' && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h3><T>Edit Social Links</T></h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><T>LinkedIn Profile</T></label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="form-group">
                  <label><T>GitHub Profile</T></label>
                  <input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/username" />
                </div>
                <div className="form-group">
                  <label><T>Instagram Profile</T></label>
                  <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="https://instagram.com/username" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}><T>Cancel</T></button>
                <button type="submit" className="save-btn"><T>Save Changes</T></button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;