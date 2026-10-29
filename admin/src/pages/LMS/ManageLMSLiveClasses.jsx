import React, { useState, useEffect } from "react";
import { 
  FaVideo, 
  FaPlus, 
  FaTrash, 
  FaCalendarAlt, 
  FaClock, 
  FaUserTie, 
  FaLink, 
  FaCheckCircle,
  FaTimes,
  FaBroadcastTower,
  FaExternalLinkAlt
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import { toast } from "react-toastify";
import "../../assets/css/lms-admin.css";

const ManageLMSLiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructorName: "Dr. Vivek Sengupta (IIT Kharagpur)",
    scheduledStartTime: "",
    durationMinutes: 90,
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    status: "upcoming",
    courseId: 1
  });

  useEffect(() => {
    fetchLiveClasses();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await lmsAdminApi.getAllPlatformCourses();
      if (res.success && res.courses?.length > 0) {
        setCourses(res.courses);
        setFormData(prev => ({ ...prev, courseId: res.courses[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const res = await lmsAdminApi.getAllLiveClasses();
      if (res.success) {
        setLiveClasses(res.liveClasses || []);
      }
    } catch (e) {
      toast.error("Failed to load live classes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLiveClass = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.scheduledStartTime) {
      toast.warning("Title and Scheduled Time are required.");
      return;
    }

    try {
      const res = await lmsAdminApi.createLiveClass(formData);
      if (res.success) {
        toast.success("Live class scheduled & broadcast alert sent to students!");
        setShowCreateModal(false);
        setFormData({
          title: "",
          description: "",
          instructorName: "Dr. Vivek Sengupta (IIT Kharagpur)",
          scheduledStartTime: "",
          durationMinutes: 90,
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          status: "upcoming"
        });
        fetchLiveClasses();
      }
    } catch (e) {
      toast.error("Failed to schedule live class.");
    }
  };

  const handleDeleteLiveClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this live masterclass?")) return;
    try {
      await lmsAdminApi.deleteLiveClass(id);
      toast.success("Live masterclass deleted.");
      fetchLiveClasses();
    } catch (e) {
      toast.error("Delete failed.");
    }
  };

  const handleToggleStatus = async (item, newStatus) => {
    try {
      await lmsAdminApi.updateLiveClass(item.LiveClassID, { status: newStatus });
      toast.success(`Session status set to ${newStatus}`);
      fetchLiveClasses();
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
            <span role="img" aria-label="video">🔴</span> Live Masterclasses & Webinars
          </h1>
          <p>Schedule interactive Zoom / Google Meet cohort sessions and broadcast real-time alerts to enrolled students.</p>
        </div>

        <button className="btn-lms-action" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Schedule Masterclass
        </button>
      </div>

      {/* ── 4 Modern Metric Cards ── */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaVideo />
          </div>
          <div className="lms-stat-info">
            <h3>{liveClasses.length}</h3>
            <span>Total Live Sessions</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaBroadcastTower />
          </div>
          <div className="lms-stat-info">
            <h3>{liveClasses.filter(c => c.Status === 'upcoming').length}</h3>
            <span>Upcoming Sessions</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaCalendarAlt />
          </div>
          <div className="lms-stat-info">
            <h3 className="text-danger">{liveClasses.filter(c => c.Status === 'live').length}</h3>
            <span>Streaming Live Now</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="lms-stat-info">
            <h3>{liveClasses.filter(c => c.Status === 'completed').length}</h3>
            <span>Completed & Recorded</span>
          </div>
        </div>
      </div>

      {/* ── Live Classes Grid ── */}
      {loading ? (
        <div className="lms-empty-state">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-3">Loading masterclasses...</p>
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="lms-empty-state">
          <div className="lms-empty-icon">
            <FaVideo />
          </div>
          <h3>No Live Masterclasses Scheduled</h3>
          <p>Schedule your first interactive cohort webinar or system design workshop.</p>
          <button className="btn-lms-action" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Schedule Masterclass
          </button>
        </div>
      ) : (
        <div className="lms-live-grid">
          {liveClasses.map((c) => (
            <div key={c.LiveClassID} className="lms-live-card">
              <div className="lms-live-card-header">
                <span className={`badge ${
                  c.Status === 'live' ? 'bg-danger text-white' :
                  c.Status === 'completed' ? 'bg-success text-white' :
                  'bg-warning text-dark'
                } px-3 py-2 text-uppercase fw-bold`}>
                  {c.Status === 'live' && '🔴 '}
                  {c.Status}
                </span>

                <select 
                  className="form-select form-select-sm w-auto fw-bold"
                  value={c.Status}
                  onChange={(e) => handleToggleStatus(c, e.target.value)}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live Now</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="lms-live-card-body">
                <h3 className="lms-live-title">{c.Title ? c.Title.replace(/^[?]+\s*/, '🔥 ') : 'Live Masterclass'}</h3>

                <div className="lms-live-instructor">
                  <FaUserTie className="text-warning" />
                  <span>Instructor: <strong>{c.InstructorName || "Lead Architect"}</strong></span>
                </div>

                <div className="lms-live-time-box">
                  <FaCalendarAlt />
                  <span>
                    {c.ScheduledStartTime ? new Date(c.ScheduledStartTime).toLocaleString() : "TBD"} &bull; {c.DurationMinutes || 90} mins
                  </span>
                </div>

                <p className="lms-job-desc">{c.Description}</p>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                  <a 
                    href={c.MeetingURL || "#"} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary fw-bold d-inline-flex align-items-center gap-2"
                  >
                    <FaExternalLinkAlt /> Open Room Link
                  </a>

                  <button 
                    className="btn-lms-danger"
                    onClick={() => handleDeleteLiveClass(c.LiveClassID)}
                    title="Delete Session"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Schedule Masterclass Modal ── */}
      {showCreateModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="lms-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Schedule Live Masterclass</h3>
              <button 
                className="action-icon-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateLiveClass}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Assign to Course / Program *</label>
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
                  <label>Masterclass Title *</label>
                  <input 
                    type="text" 
                    className="lms-form-control" 
                    placeholder="e.g. 🔥 Weekend Live Cohort: Microservices Scaling & Architecture Review"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Instructor Name & Title *</label>
                    <input 
                      type="text" 
                      className="lms-form-control" 
                      placeholder="e.g. Dr. Vivek Sengupta (IIT Kharagpur)"
                      value={formData.instructorName}
                      onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="lms-form-group">
                    <label>Duration (Minutes)</label>
                    <input 
                      type="number" 
                      className="lms-form-control" 
                      placeholder="90"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Scheduled Date & Start Time *</label>
                    <input 
                      type="datetime-local" 
                      className="lms-form-control" 
                      value={formData.scheduledStartTime}
                      onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="lms-form-group">
                    <label>Meeting URL (Zoom / Google Meet) *</label>
                    <input 
                      type="url" 
                      className="lms-form-control" 
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="lms-form-group">
                  <label>Session Description & Agenda</label>
                  <textarea 
                    rows={3} 
                    className="lms-form-control" 
                    placeholder="Provide overview of key concepts, hands-on teardowns, and Q&A agenda..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <FaPlus /> Broadcast & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSLiveClasses;
