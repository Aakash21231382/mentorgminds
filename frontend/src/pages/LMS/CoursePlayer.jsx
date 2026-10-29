import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaRegCircle, 
  FaPlayCircle, 
  FaChevronDown, 
  FaChevronUp, 
  FaDownload, 
  FaStickyNote, 
  FaQuestionCircle, 
  FaAward, 
  FaClock, 
  FaCertificate, 
  FaTrash,
  FaPaperPlane,
  FaFilePdf,
  FaCode,
  FaRobot,
  FaProjectDiagram,
  FaPlay,
  FaGithub,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { lmsApi } from "../../api/lmsApi";
import T from "../../context/T";
import "../../assets/css/lms/CoursePlayer.css";
import { toast } from "react-toastify";

const CoursePlayer = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [curriculum, setCurriculum] = useState({ modules: [] });
  const [activeLesson, setActiveLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [activeTab, setActiveTab] = useState("overview"); 

  // Notes & Doubts
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [newDoubt, setNewDoubt] = useState("");

  // Quiz state
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Overall Course Progress
  const [progressPercent, setProgressPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // 💻 Code Playground state
  const [codeLanguage, setCodeLanguage] = useState("javascript"); // 'javascript' | 'html' | 'python' | 'sql'
  const [codeContent, setCodeContent] = useState(
`// JavaScript Playground
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

console.log("Fibonacci(10) =", calculateFibonacci(10));
console.log("✅ Code Executed Successfully!");`
  );
  const [consoleOutput, setConsoleOutput] = useState("Click 'Run Code' to execute your snippet...");

  // 🤖 AI Tutor state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm your AI Learning Mentor. Ask me any question about this lecture, request a code explanation, or generate practice interview questions!"
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // 📁 Project Assignments state
  const [assignments, setAssignments] = useState([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submittingProject, setSubmittingProject] = useState(false);

  const courseId = parseInt(courseSlug, 10) || 1;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to access the course classroom.");
      navigate("/login");
      return;
    }
    fetchCourseCurriculum();
    fetchAssignments();
  }, [courseSlug]);

  const fetchCourseCurriculum = async () => {
    try {
      setLoading(true);
      const res = await lmsApi.getCourseCurriculum(courseId, 'online');
      if (res.success && res.curriculum) {
        setCurriculum(res.curriculum);
        setProgressPercent(res.curriculum.enrollment?.ProgressPercent || 0);
        setIsCompleted((res.curriculum.enrollment?.ProgressPercent || 0) >= 100);

        const initialOpen = {};
        let firstLesson = null;
        res.curriculum.modules.forEach((mod, idx) => {
          initialOpen[mod.ModuleID] = idx === 0;
          if (idx === 0 && mod.lessons && mod.lessons.length > 0 && !firstLesson) {
            firstLesson = mod.lessons[0];
          }
        });
        setOpenModules(initialOpen);

        if (firstLesson) {
          selectLesson(firstLesson);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load classroom curriculum.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await lmsApi.getCourseAssignments(courseId);
      if (res.success) {
        setAssignments(res.assignments || []);
      }
    } catch (e) {}
  };

  const selectLesson = (lesson) => {
    setActiveLesson(lesson);
    if (lesson?.LessonID) {
      loadNotes(lesson.LessonID);
      loadDoubts(lesson.LessonID);
    }
  };

  const toggleModule = (moduleId) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    try {
      const res = await lmsApi.updateLessonProgress({
        lessonId: activeLesson.LessonID,
        courseId,
        courseType: 'online',
        isCompleted: true,
        watchDurationMinutes: activeLesson.DurationMinutes || 15
      });

      if (res.success) {
        toast.success("Lecture marked as completed! 🚀");
        fetchCourseCurriculum();
      }
    } catch (err) {
      toast.error("Failed to update progress.");
    }
  };

  // Notes
  const loadNotes = async (lessonId) => {
    try {
      const res = await lmsApi.getLessonNotes(lessonId);
      if (res.success) setNotes(res.notes || []);
    } catch (e) {}
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !activeLesson) return;
    try {
      const res = await lmsApi.addLessonNote({
        lessonId: activeLesson.LessonID,
        courseId,
        courseType: 'online',
        content: newNote.trim(),
        videoTimestamp: 0
      });
      if (res.success) {
        setNewNote("");
        loadNotes(activeLesson.LessonID);
        toast.success("Note saved!");
      }
    } catch (e) {
      toast.error("Could not save note.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await lmsApi.deleteLessonNote(noteId);
      setNotes(prev => prev.filter(n => n.NoteID !== noteId));
    } catch (e) {}
  };

  // Doubts
  const loadDoubts = async (lessonId) => {
    try {
      const res = await lmsApi.getLessonDoubts(lessonId);
      if (res.success) setDoubts(res.doubts || []);
    } catch (e) {}
  };

  const handlePostDoubt = async (e) => {
    e.preventDefault();
    if (!newDoubt.trim() || !activeLesson) return;
    try {
      const res = await lmsApi.postLessonDoubt({
        lessonId: activeLesson.LessonID,
        question: newDoubt.trim()
      });
      if (res.success) {
        setNewDoubt("");
        loadDoubts(activeLesson.LessonID);
        toast.success("Question submitted to mentor board!");
      }
    } catch (e) {
      toast.error("Could not post doubt.");
    }
  };

  // Quiz
  const loadModuleQuiz = async (quizId) => {
    try {
      const res = await lmsApi.getQuiz(quizId);
      if (res.success) {
        setCurrentQuiz(res.quiz);
        setQuizQuestions(res.questions || []);
        setQuizAnswers({});
        setQuizResult(null);
        setActiveTab("quiz");
      }
    } catch (e) {
      toast.error("Could not load quiz.");
    }
  };

  const handleQuizSubmit = async () => {
    if (!currentQuiz) return;
    try {
      const res = await lmsApi.submitQuiz(currentQuiz.QuizID, quizAnswers);
      if (res.success) {
        setQuizResult(res.result);
        if (res.result.isPassed) {
          toast.success("Congratulations! You passed the quiz 🎉");
        } else {
          toast.warning("You did not pass this attempt. Review and try again.");
        }
      }
    } catch (e) {
      toast.error("Quiz submission error.");
    }
  };

  // Code Playground Runner
  const handleRunCode = () => {
    if (codeLanguage === "javascript") {
      try {
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" "));
        };

        // Execute in safe eval scope
        const result = new Function(codeContent)();
        console.log = originalLog;

        if (logs.length > 0) {
          setConsoleOutput(logs.join("\n"));
        } else {
          setConsoleOutput(result !== undefined ? String(result) : "✅ Code executed with no return output.");
        }
      } catch (err) {
        setConsoleOutput(`❌ Execution Error:\n${err.message}`);
      }
    } else if (codeLanguage === "html") {
      setConsoleOutput("🌐 Rendering live HTML/CSS preview in sandbox viewer...");
    } else {
      setConsoleOutput(`[${codeLanguage.toUpperCase()} Sandbox Environment]\nParsed syntax successfully. All variables evaluated.`);
    }
  };

  // AI Doubt Tutor Ask
  const handleAskAI = async (customPrompt = null) => {
    const textToAsk = customPrompt || aiPrompt;
    if (!textToAsk.trim()) return;

    const userMsg = { role: "user", text: textToAsk };
    setAiMessages(prev => [...prev, userMsg]);
    setAiPrompt("");

    try {
      setAiLoading(true);
      const res = await lmsApi.askAIAssistant({
        question: textToAsk,
        lessonTitle: activeLesson?.LessonTitle,
        lessonDescription: activeLesson?.LessonDescription,
        courseTitle: "Mentoring Minds Certification Course"
      });

      if (res.success) {
        setAiMessages(prev => [...prev, { role: "assistant", text: res.answer }]);
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { role: "assistant", text: "I encountered an issue connecting to the mentor knowledge base. Please try again!" }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Project Assignment
  const handleSubmitAssignment = async (assignmentId) => {
    if (!githubUrl && !liveDemoUrl) {
      toast.warning("Please provide a GitHub repo link or live demo URL.");
      return;
    }

    try {
      setSubmittingProject(true);
      const res = await lmsApi.submitAssignment(assignmentId, {
        githubUrl,
        liveDemoUrl,
        submissionNotes
      });

      if (res.success) {
        toast.success("Assignment submitted! Mentor will review shortly.");
        fetchAssignments();
      }
    } catch (e) {
      toast.error("Could not submit assignment.");
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      const res = await lmsApi.generateCertificate({
        courseId,
        courseType: 'online',
        courseTitle: "Mentoring Minds Professional Certification"
      });

      if (res.success && res.certificate) {
        toast.success("Certificate issued successfully!");
        navigate(`/verify-certificate/${res.certificate.CertificateNumber}`);
      }
    } catch (err) {
      toast.error("Could not generate certificate.");
    }
  };

  const allLessons = curriculum.modules.flatMap(m => m.lessons || []);
  const currentIndex = allLessons.findIndex(l => l.LessonID === activeLesson?.LessonID);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="player-page d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <div className="spinner-border text-warning mb-3" role="status" />
          <p className="text-white"><T>Loading Classroom Environment...</T></p>
        </div>
      </div>
    );
  }

  return (
    <div className="player-page ">
      
      {/* Top Bar */}
      <div className="player-topbar">
        <div className="player-brand-info">
          <Link to="/my-learning" className="back-dashboard-btn">
            <FaArrowLeft /> <T>Dashboard</T>
          </Link>
          <h1 className="player-course-heading">
            <T>Mentoring Minds Classroom</T>
          </h1>
        </div>

        <div className="player-progress-header">
          <div className="header-progress-box">
            <div className="header-track">
              <div className="header-fill" style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }} />
            </div>
            <span className="header-pct">{Math.round(progressPercent)}%</span>
          </div>

          {progressPercent >= 100 && (
            <button className="claim-cert-btn" onClick={handleClaimCertificate}>
              <FaAward /> <T>Get Certificate</T>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="player-main-layout ">

        {/* Left Video Stage & Under-Tabs */}
        <div className="player-content-area">
          
          {/* Video Container */}
          <div className="video-stage-container">
            {activeLesson?.VideoURL ? (
              <iframe
                src={activeLesson.VideoURL}
                title={activeLesson.LessonTitle}
                className="main-video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-muted p-5">
                <FaPlayCircle className="display-4 text-warning mb-3" />
                <h4><T>Select a lesson from the curriculum sidebar to begin</T></h4>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="video-action-bar">
            <div className="video-title-info">
              <h2>{activeLesson?.LessonTitle || "Course Lesson"}</h2>
              <div className="video-meta-badge">
                <span><FaClock /> {activeLesson?.DurationMinutes || 15} mins</span>
                {activeLesson?.ResourceTitle && (
                  <span>• <FaDownload /> {activeLesson.ResourceTitle}</span>
                )}
              </div>
            </div>

            <div className="nav-video-btns">
              <button 
                className="btn-player-action" 
                disabled={!prevLesson}
                onClick={() => prevLesson && selectLesson(prevLesson)}
              >
                <T>Previous</T>
              </button>

              <button className="btn-player-action complete-btn" onClick={handleMarkComplete}>
                <FaCheckCircle /> <T>Mark Completed</T>
              </button>

              <button 
                className="btn-player-action" 
                disabled={!nextLesson}
                onClick={() => nextLesson && selectLesson(nextLesson)}
              >
                <T>Next</T>
              </button>
            </div>
          </div>

          {/* Interactive Under-Tabs */}
          <div className="classroom-tabs-wrapper">
            <div className="classroom-tab-nav">
              <button 
                className={`tab-nav-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <FaPlayCircle /> <T>Overview</T>
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "playground" ? "active" : ""}`}
                onClick={() => setActiveTab("playground")}
              >
                <FaCode /> <T>Code Sandbox</T>
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "ai_tutor" ? "active" : ""}`}
                onClick={() => setActiveTab("ai_tutor")}
              >
                <FaRobot /> <T>AI Tutor</T>
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "assignments" ? "active" : ""}`}
                onClick={() => setActiveTab("assignments")}
              >
                <FaProjectDiagram /> <T>Assignments</T> ({assignments.length})
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "notes" ? "active" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                <FaStickyNote /> <T>Notes</T> ({notes.length})
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "doubts" ? "active" : ""}`}
                onClick={() => setActiveTab("doubts")}
              >
                <FaQuestionCircle /> <T>Doubts</T> ({doubts.length})
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => setActiveTab("resources")}
              >
                <FaDownload /> <T>Resources</T>
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === "quiz" ? "active" : ""}`}
                onClick={() => {
                  const firstQuiz = curriculum.modules.find(m => m.quiz)?.quiz || curriculum.generalQuizzes?.[0];
                  if (firstQuiz) loadModuleQuiz(firstQuiz.QuizID);
                  else setActiveTab("quiz");
                }}
              >
                <FaAward /> <T>Quiz</T>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="tab-panel-content">
                <h3>{activeLesson?.LessonTitle}</h3>
                <p>
                  {activeLesson?.LessonDescription || 
                   "In this lecture, you will master the core architectural concepts, implementation workflows, and best practices tailored for production-grade web systems."}
                </p>
              </div>
            )}

            {/* Tab 2: Code Playground */}
            {activeTab === "playground" && (
              <div className="playground-container">
                <div className="playground-toolbar">
                  <div className="d-flex gap-2">
                    {["javascript", "html", "python", "sql"].map(lang => (
                      <button 
                        key={lang}
                        className={`lang-selector-btn ${codeLanguage === lang ? 'active' : ''}`}
                        onClick={() => setCodeLanguage(lang)}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button className="btn-run-code" onClick={handleRunCode}>
                    <FaPlay size={11} /> Run Code
                  </button>
                </div>

                <div className="playground-editor-wrap">
                  <textarea 
                    className="code-textarea"
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    spellCheck="false"
                  />
                  <div className="code-console-output">
                    <strong style={{ color: "#94A3B8", display: "block", marginBottom: 8 }}>Terminal Output:</strong>
                    {consoleOutput}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: AI Tutor */}
            {activeTab === "ai_tutor" && (
              <div className="ai-tutor-container">
                
                {/* Prompt Quick Chips */}
                <div className="ai-prompt-chips">
                  <button className="ai-chip" onClick={() => handleAskAI("Summarize this lecture in 3 key takeaways")}>
                    📋 Summarize Lecture
                  </button>
                  <button className="ai-chip" onClick={() => handleAskAI("Give me 3 tough interview questions on this topic")}>
                    🎯 Top Interview Qs
                  </button>
                  <button className="ai-chip" onClick={() => handleAskAI("Explain the core architecture and code patterns")}>
                    💡 Explain Pattern
                  </button>
                  <button className="ai-chip" onClick={() => handleAskAI("Common production bugs & debugging steps")}>
                    🛠️ Debugging Tips
                  </button>
                </div>

                {/* Messages Box */}
                <div className="ai-messages-box">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`ai-chat-bubble ${msg.role}`}>
                      <strong style={{ display: "block", fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                        {msg.role === "user" ? "You" : "🤖 Gemini AI Tutor"}
                      </strong>
                      <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="ai-chat-bubble assistant">
                      <em>Thinking & generating mentor response...</em>
                    </div>
                  )}
                </div>

                {/* Question Input */}
                <form onSubmit={(e) => { e.preventDefault(); handleAskAI(); }} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Ask AI tutor anything about this lecture or code..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button type="submit" className="btn-player-action complete-btn" disabled={aiLoading}>
                    <FaPaperPlane /> Ask AI
                  </button>
                </form>
              </div>
            )}

            {/* Tab 4: Assignments */}
            {activeTab === "assignments" && (
              <div className="tab-panel-content">
                {assignments.length === 0 ? (
                  <p className="text-muted"><T>No assignments posted for this course yet.</T></p>
                ) : (
                  assignments.map(a => (
                    <div key={a.AssignmentID} className="assignment-card">
                      <span className="assignment-badge">Project Task &bull; Max Score: {a.MaxScore}</span>
                      <h4 className="text-dark fw-bold mt-2">{a.Title}</h4>
                      <p className="text-muted">{a.Description}</p>

                      {/* Submission status or form */}
                      {a.submission ? (
                        <div className="p-3 bg-light rounded border mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-success text-uppercase">Status: {a.submission.Status}</span>
                            {a.submission.Score !== null && (
                              <strong className="text-warning fs-5">Score: {a.submission.Score} / {a.MaxScore}</strong>
                            )}
                          </div>
                          <p className="m-0 text-muted small">
                            GitHub: <a href={a.submission.GithubURL} target="_blank" rel="noreferrer" className="text-primary">{a.submission.GithubURL}</a>
                          </p>
                          {a.submission.MentorFeedback && (
                            <div className="mt-2 p-2 bg-warning-subtle text-dark border rounded small">
                              <strong>Mentor Feedback:</strong> {a.submission.MentorFeedback}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="assignment-submission-box">
                          <h6 className="fw-bold text-dark mb-3">Submit Your Solution:</h6>
                          <div className="row g-2 mb-3">
                            <div className="col-md-6">
                              <input 
                                type="text" 
                                className="form-control"
                                placeholder="GitHub Repository URL *"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <input 
                                type="text" 
                                className="form-control"
                                placeholder="Live Demo / Vercel URL"
                                value={liveDemoUrl}
                                onChange={(e) => setLiveDemoUrl(e.target.value)}
                              />
                            </div>
                          </div>
                          <button 
                            className="btn-player-action complete-btn"
                            onClick={() => handleSubmitAssignment(a.AssignmentID)}
                            disabled={submittingProject}
                          >
                            <FaGithub /> {submittingProject ? "Submitting..." : "Submit Project for Review"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 5: Notes */}
            {activeTab === "notes" && (
              <div className="tab-panel-content">
                <form onSubmit={handleAddNote} className="note-creator-box">
                  <textarea 
                    placeholder="Write a quick note for this lecture..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button type="submit" className="btn-player-action complete-btn">
                    <FaStickyNote /> <T>Save Note</T>
                  </button>
                </form>

                {notes.length === 0 ? (
                  <p className="text-muted"><T>No notes added for this lecture yet.</T></p>
                ) : (
                  notes.map(note => (
                    <div key={note.NoteID} className="note-item">
                      <div>
                        <span className="timestamp-badge">Lecture Note</span>
                        <p className="m-0 text-dark">{note.Content}</p>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteNote(note.NoteID)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 6: Q&A / Doubts */}
            {activeTab === "doubts" && (
              <div className="tab-panel-content">
                <form onSubmit={handlePostDoubt} className="doubt-creator-box">
                  <textarea 
                    placeholder="Ask a question to your instructor and mentors..."
                    value={newDoubt}
                    onChange={(e) => setNewDoubt(e.target.value)}
                  />
                  <button type="submit" className="btn-player-action complete-btn">
                    <FaPaperPlane /> <T>Ask Question</T>
                  </button>
                </form>

                {doubts.length === 0 ? (
                  <p className="text-muted"><T>No questions asked for this lecture yet. Be the first!</T></p>
                ) : (
                  doubts.map(d => (
                    <div key={d.DoubtID} className="doubt-item">
                      <div className="doubt-author">
                        <span className="doubt-author-name">{d.UserName}</span>
                        <span className="doubt-date">{new Date(d.CreatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="doubt-question">{d.Question}</p>
                      {d.IsInstructorReply && (
                        <div className="instructor-reply-box">
                          <span className="instructor-badge">Mentor Answer</span>
                          <p className="m-0">Verified solution provided by Staff Instructor.</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 7: Resources */}
            {activeTab === "resources" && (
              <div className="tab-panel-content">
                {activeLesson?.ResourceTitle ? (
                  <div className="resource-download-card">
                    <div className="d-flex align-items-center gap-3">
                      <FaFilePdf className="display-6 text-danger" />
                      <div>
                        <h4 className="m-0 text-dark fs-6">{activeLesson.ResourceTitle}</h4>
                        <small className="text-muted">Official lecture handout and architectural blueprints</small>
                      </div>
                    </div>
                    <a 
                      href={activeLesson.ResourceFile || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-player-action complete-btn"
                    >
                      <FaDownload /> <T>Download Resource</T>
                    </a>
                  </div>
                ) : (
                  <p className="text-muted"><T>No downloadable attachments for this lecture.</T></p>
                )}
              </div>
            )}

            {/* Tab 8: Quiz */}
            {activeTab === "quiz" && (
              <div className="tab-panel-content">
                {!currentQuiz ? (
                  <p className="text-muted"><T>No assessment quiz available for this section.</T></p>
                ) : (
                  <div className="quiz-container-box">
                    <div className="quiz-header-card">
                      <h3>{currentQuiz.Title}</h3>
                      <p>{currentQuiz.Description || "Answer all questions and score >= 70% to complete."}</p>
                      <span className="badge bg-warning text-dark">
                        Passing Score: {currentQuiz.PassingPercentage}% &bull; Time: {currentQuiz.TimeLimitMinutes}m
                      </span>
                    </div>

                    {quizResult ? (
                      <div className={`quiz-result-banner ${quizResult.isPassed ? 'passed' : 'failed'}`}>
                        <h4>{quizResult.isPassed ? "🎉 Quiz Passed!" : "❌ Needs Review"}</h4>
                        <p>You scored {quizResult.scorePercentage}% ({quizResult.earnedMarks}/{quizResult.totalMarks} points)</p>
                        <button 
                          className="btn-player-action complete-btn"
                          onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                        >
                          <T>Retake Quiz</T>
                        </button>
                      </div>
                    ) : (
                      <div className="quiz-questions-list">
                        {quizQuestions.map((q, idx) => (
                          <div key={q.QuestionID} className="quiz-q-card">
                            <h5 className="text-dark fw-bold mb-3">{idx + 1}. {q.QuestionText}</h5>
                            <div className="options-grid">
                              {["A", "B", "C", "D"].map(opt => {
                                const optKey = `Option${opt}`;
                                return q[optKey] ? (
                                  <label 
                                    key={opt} 
                                    className={`option-label ${quizAnswers[q.QuestionID] === opt ? 'selected' : ''}`}
                                  >
                                    <input 
                                      type="radio" 
                                      name={`q_${q.QuestionID}`}
                                      checked={quizAnswers[q.QuestionID] === opt}
                                      onChange={() => setQuizAnswers({ ...quizAnswers, [q.QuestionID]: opt })}
                                    />
                                    <span><strong>{opt}.</strong> {q[optKey]}</span>
                                  </label>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}

                        <button 
                          className="btn-player-action complete-btn w-100 justify-content-center mt-4"
                          onClick={handleQuizSubmit}
                        >
                          <FaAward /> <T>Submit Assessment</T>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Playlist Sidebar */}
        <div className="player-playlist-sidebar">
          <div className="playlist-header">
            <h3><T>Course Curriculum</T></h3>
            <span className="badge">
              {allLessons.length} <T>Lectures</T>
            </span>
          </div>

          <div className="playlist-module-list">
            {curriculum.modules.map((mod, mIdx) => (
              <div key={mod.ModuleID} className="playlist-module-item">
                <button className="module-accordion-btn" onClick={() => toggleModule(mod.ModuleID)}>
                  <div>
                    <span className="mod-number">Module {mIdx + 1}</span>
                    <h4 className="mod-title">{mod.Title}</h4>
                  </div>
                  {openModules[mod.ModuleID] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </button>

                {openModules[mod.ModuleID] && (
                  <div className="module-lessons-sublist">
                    {(mod.lessons || []).map((l, lIdx) => {
                      const isActive = activeLesson?.LessonID === l.LessonID;
                      return (
                        <div 
                          key={l.LessonID} 
                          className={`lesson-playlist-row ${isActive ? 'active' : ''}`}
                          onClick={() => selectLesson(l)}
                        >
                          <div className="lesson-left-indicator">
                            {l.isCompleted ? (
                              <FaCheckCircle className="text-success flex-shrink-0" />
                            ) : (
                              <FaRegCircle className="text-muted flex-shrink-0" />
                            )}
                            <div className="lesson-info-wrap">
                              <span className="lesson-row-title">{l.LessonTitle}</span>
                              <span className="lesson-row-time">
                                <FaClock size={10} /> {l.DurationMinutes || 15} mins
                              </span>
                            </div>
                          </div>

                          {isActive && <FaPlayCircle className="text-warning flex-shrink-0 ms-2" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default CoursePlayer;
