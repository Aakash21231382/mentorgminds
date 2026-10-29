import React, { useState, useEffect } from "react";
import { 
  FaBriefcase, 
  FaPlus, 
  FaTrash, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaUserGraduate,
  FaTimes,
  FaFileAlt,
  FaExternalLinkAlt,
  FaFilter
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import { toast } from "react-toastify";
import "../../assets/css/lms-admin.css";

const ManageLMSJobs = () => {
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' | 'applicants'
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Job Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    roleTitle: "",
    location: "Bengaluru / Remote",
    jobType: "Full-Time",
    salaryPackage: "₹10 - ₹16 LPA",
    experience: "0 - 2 Years",
    description: "",
    requirements: "React, Node.js, REST APIs, SQL, Problem Solving"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.allSettled([
        lmsAdminApi.getAllJobs(),
        lmsAdminApi.getJobApplicants()
      ]);

      if (jobsRes.status === "fulfilled" && jobsRes.value.success) {
        setJobs(jobsRes.value.jobs || []);
      }
      if (appsRes.status === "fulfilled" && appsRes.value.success) {
        setApplicants(appsRes.value.applicants || []);
      }
    } catch (e) {
      toast.error("Failed to load jobs data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.roleTitle) {
      toast.warning("Company and Role Title are required.");
      return;
    }

    try {
      const res = await lmsAdminApi.createJob(formData);
      if (res.success) {
        toast.success("Hiring opportunity published on student portal!");
        setShowCreateModal(false);
        setFormData({
          company: "",
          roleTitle: "",
          location: "Bengaluru / Remote",
          jobType: "Full-Time",
          salaryPackage: "₹10 - ₹16 LPA",
          experience: "0 - 2 Years",
          description: "",
          requirements: "React, Node.js, REST APIs, SQL, Problem Solving"
        });
        fetchData();
      }
    } catch (e) {
      toast.error("Could not create job.");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await lmsAdminApi.deleteJob(id);
      toast.success("Job deleted successfully.");
      fetchData();
    } catch (e) {
      toast.error("Delete failed.");
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await lmsAdminApi.updateApplicantStatus(appId, status);
      toast.success(`Candidate status updated to ${status}`);
      fetchData();
    } catch (e) {
      toast.error("Status update failed.");
    }
  };

  return (
    <div className="lms-admin-container">
      
      {/* ── Page Header ── */}
      <div className="lms-page-header">
        <div className="lms-header-title-box">
          <h1>
            <span role="img" aria-label="briefcase">💼</span> Career & Placement Assistance Portal
          </h1>
          <p>Publish hiring partner requirements and review verified student certificate job applications.</p>
        </div>

        <button className="btn-lms-action" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Post Job Opportunity
        </button>
      </div>

      {/* ── 4 Modern Metric Cards ── */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaBriefcase />
          </div>
          <div className="lms-stat-info">
            <h3>{jobs.length}</h3>
            <span>Active Job Openings</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaUserGraduate />
          </div>
          <div className="lms-stat-info">
            <h3>{applicants.length}</h3>
            <span>Total Student Applications</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="lms-stat-info">
            <h3>{applicants.filter(a => a.Status === 'shortlisted').length}</h3>
            <span>Shortlisted for Interview</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaMoneyBillWave />
          </div>
          <div className="lms-stat-info">
            <h3>₹14.5 LPA</h3>
            <span>Avg Partner CTC</span>
          </div>
        </div>
      </div>

      {/* ── Tabs Bar ── */}
      <div className="lms-tabs-bar">
        <button 
          className={`lms-tab-pill-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <FaBriefcase /> Job Postings ({jobs.length})
        </button>
        <button 
          className={`lms-tab-pill-btn ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          <FaUserGraduate /> Candidate Applications ({applicants.length})
        </button>
      </div>

      {/* ── Tab 1: Job Postings Grid ── */}
      {activeTab === "jobs" && (
        <>
          {loading ? (
            <div className="lms-empty-state">
              <div className="spinner-border text-warning" role="status" />
              <p className="mt-3">Loading job openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="lms-empty-state">
              <div className="lms-empty-icon">
                <FaBriefcase />
              </div>
              <h3>No Job Openings Published</h3>
              <p>Post your first hiring partner requirement for certified learners.</p>
              <button className="btn-lms-action" onClick={() => setShowCreateModal(true)}>
                <FaPlus /> Post Job Opportunity
              </button>
            </div>
          ) : (
            <div className="lms-job-grid">
              {jobs.map((j) => (
                <div key={j.JobID} className="lms-job-card">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="lms-job-company-row">
                        <FaBuilding /> {j.Company}
                      </div>
                      <span className="lms-job-package-badge">
                        {(j.SalaryPackage || "").replace(/\?/g, "₹")}
                      </span>
                    </div>

                    <h3 className="lms-job-title">{j.RoleTitle}</h3>

                    <div className="lms-job-meta-row">
                      <span><FaMapMarkerAlt className="me-1 text-danger" /> {j.Location}</span>
                      <span>&bull; {j.JobType}</span>
                      <span>&bull; Exp: {j.Experience}</span>
                    </div>

                    <p className="lms-job-desc">{j.Description}</p>

                    {j.Requirements && (
                      <div className="lms-job-req-box">
                        <strong>Requirements:</strong> {j.Requirements}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-bold">
                      {applicants.filter(a => a.JobID === j.JobID).length} Applicants
                    </span>

                    <button 
                      className="btn-lms-danger"
                      onClick={() => handleDeleteJob(j.JobID)}
                      title="Delete Job"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Tab 2: Candidate Applications Table ── */}
      {activeTab === "applicants" && (
        <div className="lms-table-container">
          {applicants.length === 0 ? (
            <div className="lms-empty-state">
              <div className="lms-empty-icon">
                <FaUserGraduate />
              </div>
              <h3>No Applications Yet</h3>
              <p>Student job applications will appear here when learners apply with their verified certificates.</p>
            </div>
          ) : (
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Applied Role & Company</th>
                  <th>Applied On</th>
                  <th>Certificate / Profile</th>
                  <th>Status</th>
                  <th>Change Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a.ApplicationID}>
                    <td>
                      <div className="lms-table-title">{a.StudentName || "Enrolled Student"}</div>
                      <div className="lms-table-subtitle">{a.Email || "student@mentoringminds.com"}</div>
                    </td>
                    <td>
                      <div className="lms-table-title">{a.RoleTitle || "Full Stack Developer"}</div>
                      <div className="lms-table-subtitle">{a.Company || "Partner Company"}</div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(a.AppliedAt || Date.now()).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle px-2 py-1">
                        <FaCheckCircle className="me-1" /> Verified Learner
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        a.Status === 'shortlisted' ? 'bg-success' :
                        a.Status === 'rejected' ? 'bg-danger' :
                        'bg-warning text-dark'
                      } px-3 py-2 text-uppercase fw-bold`}>
                        {a.Status || 'applied'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-success fw-bold"
                          onClick={() => handleUpdateStatus(a.ApplicationID, 'shortlisted')}
                        >
                          Shortlist
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger fw-bold"
                          onClick={() => handleUpdateStatus(a.ApplicationID, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Create Job Modal ── */}
      {showCreateModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="lms-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Post Hiring Partner Job Opening</h3>
              <button 
                className="action-icon-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateJob}>
              <div className="lms-modal-body">
                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Hiring Company Name *</label>
                    <input 
                      type="text" 
                      className="lms-form-control" 
                      placeholder="e.g. InnovateX Technologies"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>

                  <div className="lms-form-group">
                    <label>Role / Designation Title *</label>
                    <input 
                      type="text" 
                      className="lms-form-control" 
                      placeholder="e.g. Associate Full Stack Engineer"
                      value={formData.roleTitle}
                      onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Salary Package (CTC)</label>
                    <input 
                      type="text" 
                      className="lms-form-control" 
                      placeholder="e.g. ₹10 - ₹15 LPA"
                      value={formData.salaryPackage}
                      onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                    />
                  </div>

                  <div className="lms-form-group">
                    <label>Work Location</label>
                    <input 
                      type="text" 
                      className="lms-form-control" 
                      placeholder="e.g. Bengaluru / Remote / Hybrid"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Employment Type</label>
                    <select 
                      className="lms-form-control"
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div className="lms-form-group">
                    <label>Experience Level</label>
                    <input 
                      type="text" 
                      className="lms-form-control" 
                      placeholder="e.g. 0 - 2 Years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="lms-form-group">
                  <label>Role Description & Summary</label>
                  <textarea 
                    rows={3} 
                    className="lms-form-control" 
                    placeholder="Describe role responsibilities and growth opportunities..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="lms-form-group">
                  <label>Skills & Qualifications Requirements</label>
                  <input 
                    type="text" 
                    className="lms-form-control" 
                    placeholder="e.g. React, Node.js, SQL, REST APIs, Git"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>
              </div>

              <div className="lms-modal-footer">
                <button 
                  type="button" 
                  className="btn-lms-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  <FaPlus /> Publish Job Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSJobs;
