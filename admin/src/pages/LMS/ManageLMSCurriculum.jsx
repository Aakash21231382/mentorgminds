import React, { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaVideo, 
  FaFilePdf, 
  FaBook, 
  FaTimes, 
  FaPlayCircle,
  FaLayerGroup,
  FaClock,
  FaDownload,
  FaSearch,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import "../../assets/css/lms-admin.css";

const defaultInitialCourses = [
  { id: 1, name: "Executive AI-Native Software Engineering (IIT Kharagpur)", type: "online", category: "AI & ML", source: "Online Courses" },
  { id: 2, name: "Full Stack Web & Cloud Architect", type: "online", category: "Web Development", source: "Online Courses" },
  { id: 3, name: "Data Science & Machine Learning Masterclass", type: "online", category: "Data Science", source: "Online Courses" }
];

const ManageLMSCurriculum = () => {
  const [courses, setCourses] = useState(defaultInitialCourses);
  const [selectedCourseKey, setSelectedCourseKey] = useState("online-1");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Modals
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    durationMinutes: 15,
    resourceTitle: "",
    resourceFile: "",
    isFreePreview: false
  });

  // Fetch all platform courses
  useEffect(() => {
    fetchPlatformCourses();
  }, []);

  const fetchPlatformCourses = async () => {
    try {
      setCoursesLoading(true);
      const res = await lmsAdminApi.getAllPlatformCourses();
      if (res.success && res.courses?.length > 0) {
        setCourses(res.courses);
        setSelectedCourseKey(`${res.courses[0].type}-${res.courses[0].id}`);
      }
    } catch (err) {
      console.error("Failed to load platform courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Derive current selected course object
  const currentCourse = courses.find(c => `${c.type}-${c.id}` === selectedCourseKey) || 
    courses[0] || 
    defaultInitialCourses[0];

  useEffect(() => {
    if (currentCourse?.id) {
      fetchCurriculum(currentCourse.id, currentCourse.type);
    }
  }, [selectedCourseKey, courses]);

  const fetchCurriculum = async (courseId, courseType) => {
    const cid = courseId || currentCourse.id;
    const ctype = courseType || currentCourse.type || 'online';
    try {
      setLoading(true);
      const res = await lmsAdminApi.getCurriculum(cid, ctype);
      if (res.success) {
        setModules(res.modules || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    try {
      const res = await lmsAdminApi.createModule({
        courseId: currentCourse.id,
        courseType: currentCourse.type || 'online',
        title: moduleTitle.trim(),
        description: moduleDesc.trim(),
        orderIndex: modules.length + 1
      });

      if (res.success) {
        setShowModuleModal(false);
        setModuleTitle("");
        setModuleDesc("");
        fetchCurriculum(currentCourse.id, currentCourse.type);
      }
    } catch (err) {
      alert("Failed to create module.");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module and all its lessons?")) return;
    try {
      await lmsAdminApi.deleteModule(moduleId);
      fetchCurriculum(currentCourse.id, currentCourse.type);
    } catch (err) {
      alert("Could not delete module.");
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !targetModuleId) return;

    try {
      const res = await lmsAdminApi.createLesson({
        moduleId: targetModuleId,
        ...lessonForm
      });

      if (res.success) {
        setShowLessonModal(false);
        setLessonForm({
          title: "",
          description: "",
          videoUrl: "",
          durationMinutes: 15,
          resourceTitle: "",
          resourceFile: "",
          isFreePreview: false
        });
        fetchCurriculum(currentCourse.id, currentCourse.type);
      }
    } catch (err) {
      alert("Failed to create lesson.");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      await lmsAdminApi.deleteLesson(lessonId);
      fetchCurriculum(currentCourse.id, currentCourse.type);
    } catch (err) {
      alert("Could not delete lesson.");
    }
  };

  // Metrics
  const totalModules = modules.length;
  let totalLessons = 0;
  let totalMinutes = 0;
  let totalResources = 0;

  modules.forEach(m => {
    if (m.lessons) {
      totalLessons += m.lessons.length;
      m.lessons.forEach(l => {
        totalMinutes += l.DurationMinutes || 0;
        if (l.ResourceFile) totalResources += 1;
      });
    }
  });

  // Group courses by source
  const groupedCourses = courses.reduce((acc, c) => {
    const group = c.source || c.category || "All Courses";
    if (!acc[group]) acc[group] = [];
    acc[group].push(c);
    return acc;
  }, {});

  return (
    <div className="lms-admin-container">
      
      {/* Header */}
      <div className="lms-header-row">
        <div>
          <h2><FaVideo /> Course Curriculum & Video Studio</h2>
          <p>Create and organize sections, lectures, video stream links, and downloadable resources.</p>
        </div>

        <button 
          className="btn-lms-action"
          onClick={() => setShowModuleModal(true)}
        >
          <FaPlus /> Add New Module
        </button>
      </div>

      {/* Metric Stats Cards */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaLayerGroup />
          </div>
          <div className="lms-stat-info">
            <h3>{totalModules}</h3>
            <span>Total Sections</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaPlayCircle />
          </div>
          <div className="lms-stat-info">
            <h3>{totalLessons}</h3>
            <span>Video Lectures</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaClock />
          </div>
          <div className="lms-stat-info">
            <h3>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</h3>
            <span>Total Duration</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaFilePdf />
          </div>
          <div className="lms-stat-info">
            <h3>{totalResources}</h3>
            <span>PDF CheatSheets</span>
          </div>
        </div>
      </div>

      {/* Course Selector Toolbar */}
      <div className="lms-toolbar">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <label className="fw-bold m-0" style={{ marginRight: 6, color: "var(--lms-text-title)" }}>Target Course:</label>
          <select 
            className="lms-form-control"
            style={{ width: "auto", minWidth: 360, maxWidth: "100%", padding: "8px 14px", display: "inline-block" }}
            value={selectedCourseKey}
            onChange={(e) => setSelectedCourseKey(e.target.value)}
            disabled={coursesLoading}
          >
            {coursesLoading ? (
              <option value="">Loading platform courses...</option>
            ) : (
              Object.entries(groupedCourses).map(([groupName, groupCourses]) => (
                <optgroup key={groupName} label={`📂 ${groupName} (${groupCourses.length})`}>
                  {groupCourses.map(c => (
                    <option key={`${c.type}-${c.id}`} value={`${c.type}-${c.id}`}>
                      {c.name} {c.category ? `[${c.category}]` : ''}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>

          {currentCourse && (
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-bold">
              {currentCourse.source || 'Course'} &bull; {currentCourse.category || 'General'}
            </span>
          )}
        </div>

        <span className="text-muted small fw-semibold">
          Showing {totalModules} Modules &bull; {totalLessons} Lectures
        </span>
      </div>

      {/* Curriculum Module Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : modules.length === 0 ? (
        <div className="lms-empty-state">
          <div className="lms-empty-icon">
            <FaBook />
          </div>
          <h3>No Curriculum Modules Created Yet</h3>
          <p>Click "Add New Module" to create your first course section and start adding video lectures.</p>
          <button className="btn-lms-action" onClick={() => setShowModuleModal(true)}>
            <FaPlus /> Add First Module
          </button>
        </div>
      ) : (
        modules.map((mod, idx) => (
          <div key={mod.ModuleID} className="lms-module-card">
            
            {/* Module Header */}
            <div className="lms-module-header">
              <div className="lms-module-info">
                <span className="lms-module-badge">Module {idx + 1}</span>
                <h3 className="lms-module-title">{mod.Title}</h3>
                {mod.Description && (
                  <p className="lms-module-desc">{mod.Description}</p>
                )}
              </div>

              <div className="lms-module-actions">
                <button 
                  className="btn-add-lecture"
                  onClick={() => {
                    setTargetModuleId(mod.ModuleID);
                    setShowLessonModal(true);
                  }}
                >
                  <FaPlus /> Add Lecture
                </button>
                <button 
                  className="action-icon-btn danger"
                  onClick={() => handleDeleteModule(mod.ModuleID)}
                  title="Delete Module"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Lessons Table */}
            <div className="lms-table-responsive">
              <table className="lms-modern-table" style={{ minWidth: 960 }}>
                <thead>
                  <tr>
                    <th style={{ width: 50, minWidth: 50, textAlign: "center" }}>#</th>
                    <th style={{ width: 340, minWidth: 280 }}>Lecture Title</th>
                    <th style={{ width: 220, minWidth: 180 }}>Video Link / Embed</th>
                    <th style={{ width: 130, minWidth: 120, whiteSpace: "nowrap" }}>Duration</th>
                    <th style={{ width: 180, minWidth: 160 }}>Resource</th>
                    <th style={{ width: 140, minWidth: 130, whiteSpace: "nowrap" }}>Access</th>
                    <th style={{ width: 90, minWidth: 90, textAlign: "center", whiteSpace: "nowrap" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!mod.lessons || mod.lessons.length === 0) ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No lectures added in this module yet. Click "+ Add Lecture" above.
                      </td>
                    </tr>
                  ) : (
                    mod.lessons.map((lesson, lIdx) => (
                      <tr key={lesson.LessonID}>
                        <td style={{ textAlign: "center", color: "var(--lms-text-muted)", fontWeight: 700, width: 50 }}>
                          {lIdx + 1}
                        </td>
                        <td style={{ minWidth: 280 }}>
                          <div className="lms-table-title" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                            {lesson.Title}
                          </div>
                          {lesson.Description && (
                            <small className="lms-table-subtitle" style={{ fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>
                              {lesson.Description}
                            </small>
                          )}
                        </td>
                        <td style={{ minWidth: 180 }}>
                          <a 
                            href={lesson.VideoURL} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: "#3B82F6", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={lesson.VideoURL}
                          >
                            <FaVideo size={12} /> {lesson.VideoURL || "No link"}
                          </a>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <span className="lms-duration-badge">
                            <FaClock style={{ color: "#FF6E06" }} /> {lesson.DurationMinutes} mins
                          </span>
                        </td>
                        <td style={{ minWidth: 160 }}>
                          {lesson.ResourceTitle ? (
                            <span className="badge-status pending">
                              <FaFilePdf /> {lesson.ResourceTitle}
                            </span>
                          ) : (
                            <span style={{ color: "var(--lms-text-muted)", fontSize: 13 }}>None</span>
                          )}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {lesson.IsFreePreview ? (
                            <span className="badge-status free-preview">
                              <FaCheckCircle size={10} /> Free Preview
                            </span>
                          ) : (
                            <span className="badge-status inactive">
                              <FaLock size={9} /> Locked
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "center", width: 90, minWidth: 90, whiteSpace: "nowrap" }}>
                          <button 
                            className="action-icon-btn danger"
                            onClick={() => handleDeleteLesson(lesson.LessonID)}
                            title="Delete Lecture"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        ))
      )}

      {/* Module Modal */}
      {showModuleModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowModuleModal(false)}>
          <div className="lms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Create New Course Section</h3>
              <button className="action-icon-btn" onClick={() => setShowModuleModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateModule}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Section / Module Title *</label>
                  <input 
                    type="text" 
                    className="lms-form-control"
                    placeholder="e.g. Module 1: System Design & Production Architecture"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className="lms-form-group">
                  <label>Module Description</label>
                  <textarea 
                    rows="3"
                    className="lms-form-control"
                    placeholder="Summary of skills and topics covered in this module..."
                    value={moduleDesc}
                    onChange={(e) => setModuleDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="lms-modal-footer">
                <button type="button" className="btn-lms-secondary" onClick={() => setShowModuleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowLessonModal(false)}>
          <div className="lms-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Add Video Lecture to Module</h3>
              <button className="action-icon-btn" onClick={() => setShowLessonModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateLesson}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Lecture Title *</label>
                  <input 
                    type="text" 
                    className="lms-form-control"
                    placeholder="e.g. 1.2 Event-Driven Microservices with Kafka"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    required 
                  />
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Video Stream / Embed Link (YouTube / MP4) *</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    />
                  </div>
                  <div className="lms-form-group">
                    <label>Duration (Minutes)</label>
                    <input 
                      type="number" 
                      className="lms-form-control" 
                      value={lessonForm.durationMinutes}
                      onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Resource Title (Optional)</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      placeholder="e.g. Microservices_Design_Handbook.pdf"
                      value={lessonForm.resourceTitle}
                      onChange={(e) => setLessonForm({ ...lessonForm, resourceTitle: e.target.value })}
                    />
                  </div>
                  <div className="lms-form-group">
                    <label>Resource Download URL</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      placeholder="e.g. https://example.com/files/handbook.pdf"
                      value={lessonForm.resourceFile}
                      onChange={(e) => setLessonForm({ ...lessonForm, resourceFile: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label className="lms-checkbox-label" htmlFor="previewCheck">
                    <input 
                      type="checkbox" 
                      id="previewCheck"
                      style={{ width: 16, height: 16, accentColor: "#FF6E06", cursor: "pointer" }}
                      checked={lessonForm.isFreePreview}
                      onChange={(e) => setLessonForm({ ...lessonForm, isFreePreview: e.target.checked })}
                    />
                    <span>Allow as Free Preview (Students can watch without purchasing/enrolling)</span>
                  </label>
                </div>
              </div>
              <div className="lms-modal-footer">
                <button type="button" className="btn-lms-secondary" onClick={() => setShowLessonModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSCurriculum;
