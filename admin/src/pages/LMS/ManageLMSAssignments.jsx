import React, { useState, useEffect } from "react";
import { 
  FaProjectDiagram, 
  FaPlus, 
  FaTrash, 
  FaCheck, 
  FaEye, 
  FaAward, 
  FaGithub, 
  FaExternalLinkAlt, 
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaCode
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import { toast } from "react-toastify";
import "../../assets/css/lms-admin.css";

const ManageLMSAssignments = () => {
  const [activeTab, setActiveTab] = useState("assignments"); // 'assignments' | 'submissions'
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starterCode: `// Starter Node/Express Template\nconst express = require("express");\nconst app = express();\n\napp.use(express.json());\n// Implement your routes here\n\napp.listen(5000, () => console.log("Server running on port 5000"));`,
    maxScore: 100,
    courseId: 1
  });

  // Grade Modal
  const [selectedSub, setSelectedSub] = useState(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState("Great work! Clean code structure and excellent error handling.");

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await lmsAdminApi.getAllPlatformCourses();
      if (res.success && res.courses?.length > 0) {
        setCourses(res.courses);
        setFormData(prev => ({
          ...prev,
          courseId: res.courses[0].id
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, subRes] = await Promise.allSettled([
        lmsAdminApi.getAllAssignments(),
        lmsAdminApi.getAllSubmissions()
      ]);

      if (assignRes.status === "fulfilled" && assignRes.value.success) {
        setAssignments(assignRes.value.assignments || []);
      }
      if (subRes.status === "fulfilled" && subRes.value.success) {
        setSubmissions(subRes.value.submissions || []);
      }
    } catch (e) {
      toast.error("Failed to load assignments data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.warning("Assignment Title is required.");
      return;
    }

    try {
      const res = await lmsAdminApi.createAssignment(formData);
      if (res.success) {
        toast.success("Project assignment published to classroom!");
        setShowCreateModal(false);
        setFormData({ 
          title: "", 
          description: "", 
          starterCode: `// Starter Node/Express Template\nconst express = require("express");\nconst app = express();\n\napp.use(express.json());\n// Implement your routes here\n\napp.listen(5000, () => console.log("Server running on port 5000"));`, 
          maxScore: 100, 
          courseId: 1 
        });
        fetchData();
      }
    } catch (e) {
      toast.error("Could not create assignment.");
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project assignment?")) return;
    try {
      await lmsAdminApi.deleteAssignment(id);
      toast.success("Assignment deleted.");
      fetchData();
    } catch (e) {
      toast.error("Delete failed.");
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      const res = await lmsAdminApi.gradeSubmission(selectedSub.SubmissionID, {
        score: gradeScore,
        feedback: gradeFeedback,
        status: "graded"
      });

      if (res.success) {
        toast.success("Submission graded and notification sent to student!");
        setSelectedSub(null);
        fetchData();
      }
    } catch (e) {
      toast.error("Grading failed.");
    }
  };

  return (
    <div className="lms-admin-container">
      
      {/* ── Page Header ── */}
      <div className="lms-page-header">
        <div className="lms-header-title-box">
          <h1>
            <span role="img" aria-label="project">📁</span> Project Assignments Studio
          </h1>
          <p>Publish capstone assignments, inspect student GitHub repos & live demos, and award verified mentor grades.</p>
        </div>

        <button className="btn-lms-action" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> New Project Task
        </button>
      </div>

      {/* ── 4 Modern Metric Cards ── */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaProjectDiagram />
          </div>
          <div className="lms-stat-info">
            <h3>{assignments.length}</h3>
            <span>Published Assignments</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaGithub />
          </div>
          <div className="lms-stat-info">
            <h3>{submissions.length}</h3>
            <span>Student Submissions</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaClock />
          </div>
          <div className="lms-stat-info">
            <h3 className="text-warning">{submissions.filter(s => s.Status !== 'graded').length}</h3>
            <span>Pending Reviews</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaAward />
          </div>
          <div className="lms-stat-info">
            <h3>{submissions.filter(s => s.Status === 'graded').length}</h3>
            <span>Graded & Awarded</span>
          </div>
        </div>
      </div>

      {/* ── Tabs Bar ── */}
      <div className="lms-tabs-bar">
        <button 
          className={`lms-tab-pill-btn ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <FaProjectDiagram /> Project Tasks ({assignments.length})
        </button>
        <button 
          className={`lms-tab-pill-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <FaGithub /> Student Submissions ({submissions.length})
        </button>
      </div>

      {/* ── Tab 1: Project Assignments Grid ── */}
      {activeTab === "assignments" && (
        <>
          {loading ? (
            <div className="lms-empty-state">
              <div className="spinner-border text-warning" role="status" />
              <p className="mt-3">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="lms-empty-state">
              <div className="lms-empty-icon">
                <FaProjectDiagram />
              </div>
              <h3>No Project Assignments Published</h3>
              <p>Create capstone and milestone assignments for learners to build real-world systems.</p>
              <button className="btn-lms-action" onClick={() => setShowCreateModal(true)}>
                <FaPlus /> New Project Task
              </button>
            </div>
          ) : (
            <div className="lms-assignment-grid">
              {assignments.map((a) => (
                <div key={a.AssignmentID} className="lms-assignment-card">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 fw-bold">
                        Course Track #{a.CourseID}
                      </span>
                      <span className="badge bg-success text-white px-2 py-1 fw-bold">
                        Max Score: {a.MaxScore} XP
                      </span>
                    </div>

                    <h3 className="lms-job-title">{a.Title}</h3>
                    <p className="lms-job-desc">{a.Description}</p>

                    {a.StarterCode && (
                      <div>
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1">
                          <FaCode /> Starter Code Template:
                        </span>
                        <pre className="lms-code-preview">
                          <code>{a.StarterCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-bold">
                      {submissions.filter(s => s.AssignmentID === a.AssignmentID).length} Submissions
                    </span>

                    <button 
                      className="btn-lms-danger"
                      onClick={() => handleDeleteAssignment(a.AssignmentID)}
                      title="Delete Assignment"
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

      {/* ── Tab 2: Student Submissions Table ── */}
      {activeTab === "submissions" && (
        <div className="lms-table-container">
          {submissions.length === 0 ? (
            <div className="lms-empty-state">
              <div className="lms-empty-icon">
                <FaGithub />
              </div>
              <h3>No Submissions Yet</h3>
              <p>Student project submissions will appear here for mentor code review and scoring.</p>
            </div>
          ) : (
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment Task</th>
                  <th>GitHub Repository</th>
                  <th>Live Demo</th>
                  <th>Score / Status</th>
                  <th>Grade Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.SubmissionID}>
                    <td>
                      <div className="lms-table-title">{s.StudentName || "Enrolled Student"}</div>
                      <div className="lms-table-subtitle">ID: #{s.UserID || "1"}</div>
                    </td>
                    <td>
                      <span className="lms-table-title">{s.AssignmentTitle || "Capstone Project"}</span>
                      <div className="lms-table-subtitle">
                        Submitted: {new Date(s.SubmittedAt || Date.now()).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      {s.GitHubRepoURL ? (
                        <a 
                          href={s.GitHubRepoURL} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1"
                        >
                          <FaGithub /> View Repo
                        </a>
                      ) : (
                        <span className="text-muted small">N/A</span>
                      )}
                    </td>
                    <td>
                      {s.LiveDemoURL ? (
                        <a 
                          href={s.LiveDemoURL} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                        >
                          <FaExternalLinkAlt /> Live App
                        </a>
                      ) : (
                        <span className="text-muted small">N/A</span>
                      )}
                    </td>
                    <td>
                      {s.Status === 'graded' ? (
                        <span className="badge bg-success px-3 py-2 fw-bold">
                          <FaAward className="me-1" /> {s.Score || 90} / 100 XP
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark px-3 py-2 fw-bold text-uppercase">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-warning fw-bold d-inline-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedSub(s);
                          setGradeScore(s.Score || 90);
                          setGradeFeedback(s.Feedback || "Great work! Clean architecture.");
                        }}
                      >
                        <FaAward /> {s.Status === 'graded' ? 'Update Grade' : 'Grade Project'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Create Assignment Modal ── */}
      {showCreateModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="lms-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Publish New Project Assignment</h3>
              <button 
                className="action-icon-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Assignment / Capstone Title *</label>
                  <input 
                    type="text" 
                    className="lms-form-control" 
                    placeholder="e.g. Capstone: Event-Driven Order Processing Microservice"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Assign to Course Track *</label>
                    <select 
                      className="lms-form-control" 
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                    >
                      {courses.map(c => (
                        <option key={`${c.type}-${c.id}`} value={c.id}>
                          {c.name} {c.source ? `(${c.source})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lms-form-group">
                    <label>Max Score (XP Reward)</label>
                    <input 
                      type="number" 
                      className="lms-form-control" 
                      placeholder="100"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="lms-form-group">
                  <label>Project Requirements & Description</label>
                  <textarea 
                    rows={3} 
                    className="lms-form-control" 
                    placeholder="Describe tasks, architecture expectations, containerization, and submission guidelines..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="lms-form-group">
                  <label>Starter Code Boilerplate</label>
                  <textarea 
                    rows={4} 
                    className="lms-form-control font-monospace" 
                    placeholder="// Starter Express or React code..."
                    value={formData.starterCode}
                    onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
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
                  <FaPlus /> Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Grade Submission Modal ── */}
      {selectedSub && (
        <div className="lms-modal-backdrop" onClick={() => setSelectedSub(null)}>
          <div className="lms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Mentor Project Evaluation</h3>
              <button 
                className="action-icon-btn"
                onClick={() => setSelectedSub(null)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleGradeSubmission}>
              <div className="lms-modal-body">
                <div className="p-3 rounded mb-3" style={{ background: "var(--lms-card-bg-subtle)", border: "1px solid var(--lms-border)" }}>
                  <div className="lms-table-title" style={{ fontSize: 16 }}>{selectedSub.StudentName || "Student"}</div>
                  <div className="lms-table-subtitle mb-2">{selectedSub.AssignmentTitle}</div>

                  <div className="d-flex gap-2 mt-2">
                    {selectedSub.GitHubRepoURL && (
                      <a href={selectedSub.GitHubRepoURL} target="_blank" rel="noreferrer" className="btn btn-sm btn-dark">
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {selectedSub.LiveDemoURL && (
                      <a href={selectedSub.LiveDemoURL} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <div className="lms-form-group">
                  <label>Score Awarded (out of 100 XP)</label>
                  <input 
                    type="number" 
                    className="lms-form-control" 
                    min={0}
                    max={100}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="lms-form-group">
                  <label>Mentor Feedback & Code Review Comments</label>
                  <textarea 
                    rows={4} 
                    className="lms-form-control" 
                    placeholder="Provide constructive feedback on modularity, testing, security, and styling..."
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="lms-modal-footer">
                <button 
                  type="button" 
                  className="btn-lms-secondary"
                  onClick={() => setSelectedSub(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  <FaAward /> Submit Grade & Award XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSAssignments;
