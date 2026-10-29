import React, { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaAward, 
  FaQuestionCircle, 
  FaCheck, 
  FaClock, 
  FaPercentage,
  FaTimes,
  FaCheckCircle,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import "../../assets/css/lms-admin.css";

const ManageLMSQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [targetQuizId, setTargetQuizId] = useState(null);

  // Form states
  const [quizForm, setQuizForm] = useState({
    courseId: 1,
    courseType: 'online',
    title: "",
    description: "",
    passingPercentage: 70,
    timeLimitMinutes: 15
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation: ""
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await lmsAdminApi.getAllPlatformCourses();
      if (res.success && res.courses?.length > 0) {
        setCourses(res.courses);
        setQuizForm(prev => ({
          ...prev,
          courseId: res.courses[0].id,
          courseType: res.courses[0].type
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await lmsAdminApi.getAllQuizzes();
      if (res.success) {
        setQuizzes(res.quizzes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    try {
      const res = await lmsAdminApi.createQuiz(quizForm);
      if (res.success) {
        setShowQuizModal(false);
        setQuizForm({
          courseId: courses[0]?.id || 1,
          courseType: courses[0]?.type || 'online',
          title: "",
          description: "",
          passingPercentage: 70,
          timeLimitMinutes: 15
        });
        fetchQuizzes();
      }
    } catch (err) {
      alert("Failed to create quiz.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await lmsAdminApi.deleteQuiz(quizId);
      fetchQuizzes();
    } catch (e) {
      alert("Could not delete quiz.");
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.questionText.trim() || !targetQuizId) return;

    try {
      const res = await lmsAdminApi.addQuestion(targetQuizId, questionForm);
      if (res.success) {
        setShowQuestionModal(false);
        setQuestionForm({
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctOption: "A",
          explanation: ""
        });
        fetchQuizzes();
      }
    } catch (e) {
      alert("Failed to add question.");
    }
  };

  // Metrics
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((acc, q) => acc + (q.TotalQuestions || 0), 0);
  const avgPassing = totalQuizzes > 0 
    ? Math.round(quizzes.reduce((acc, q) => acc + (q.PassingPercentage || 70), 0) / totalQuizzes)
    : 70;

  return (
    <div className="lms-admin-container">
      
      {/* Header */}
      <div className="lms-page-header">
        <div className="lms-header-title-box">
          <h1>
            <FaAward className="text-warning" /> Quizzes & Assessment Builder
          </h1>
          <p>Create quizzes, add multiple choice questions (MCQs), specify correct answers, and set passing marks.</p>
        </div>

        <button className="btn-lms-action" onClick={() => setShowQuizModal(true)}>
          <FaPlus /> Create New Quiz
        </button>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaAward />
          </div>
          <div className="lms-stat-info">
            <h3>{totalQuizzes}</h3>
            <span>Total Quizzes</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaQuestionCircle />
          </div>
          <div className="lms-stat-info">
            <h3>{totalQuestions}</h3>
            <span>Active MCQs</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaPercentage />
          </div>
          <div className="lms-stat-info">
            <h3>{avgPassing}%</h3>
            <span>Avg Passing Score</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaClock />
          </div>
          <div className="lms-stat-info">
            <h3>15 mins</h3>
            <span>Standard Timer</span>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="lms-empty-state">
          <div className="lms-empty-icon">
            <FaAward />
          </div>
          <h3>No Quizzes Created Yet</h3>
          <p>Assessments evaluate students before awarding them their verified certificate.</p>
          <button className="btn-lms-action" onClick={() => setShowQuizModal(true)}>
            <FaPlus /> Create First Quiz
          </button>
        </div>
      ) : (
        <div className="lms-grid-2">
          {quizzes.map((quiz) => (
            <div key={quiz.QuizID} className="lms-quiz-card">
              
              {/* Card Header */}
              <div className="lms-quiz-header">
                <div>
                  <span className="lms-module-badge">Course #{quiz.CourseID} &bull; {quiz.CourseType || 'online'}</span>
                  <h3 className="lms-quiz-title">{quiz.Title}</h3>
                  <p className="lms-quiz-desc">{quiz.Description || "Assessment quiz for enrolled students."}</p>
                </div>
                <button 
                  className="action-icon-btn danger"
                  onClick={() => handleDeleteQuiz(quiz.QuizID)}
                  title="Delete Quiz"
                >
                  <FaTrash />
                </button>
              </div>

              {/* 3-Box Stats Row */}
              <div className="lms-quiz-stats-row">
                <div className="lms-quiz-stat-box">
                  <span className="label">Passing Score</span>
                  <span className="val green">{quiz.PassingPercentage}%</span>
                </div>
                <div className="lms-quiz-stat-box">
                  <span className="label">Time Limit</span>
                  <span className="val orange">{quiz.TimeLimitMinutes} mins</span>
                </div>
                <div className="lms-quiz-stat-box">
                  <span className="label">Questions</span>
                  <span className="val blue">{quiz.TotalQuestions || 0} MCQs</span>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "auto" }}>
                <button 
                  className="btn-lms-action"
                  style={{ width: "100%" }}
                  onClick={() => {
                    setTargetQuizId(quiz.QuizID);
                    setShowQuestionModal(true);
                  }}
                >
                  <FaPlus /> Add MCQ Question
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowQuizModal(false)}>
          <div className="lms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Create Quiz Assessment</h3>
              <button className="action-icon-btn" onClick={() => setShowQuizModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateQuiz}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Assign to Course / Program *</label>
                  <select 
                    className="lms-form-control"
                    value={`${quizForm.courseType}-${quizForm.courseId}`}
                    onChange={(e) => {
                      const selected = courses.find(c => `${c.type}-${c.id}` === e.target.value);
                      if (selected) {
                        setQuizForm({ ...quizForm, courseId: selected.id, courseType: selected.type });
                      }
                    }}
                  >
                    {courses.map(c => (
                      <option key={`${c.type}-${c.id}`} value={`${c.type}-${c.id}`}>
                        {c.name} {c.source ? `(${c.source})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lms-form-group">
                  <label>Quiz Title *</label>
                  <input 
                    type="text" 
                    className="lms-form-control"
                    placeholder="e.g. Module 1 & 2 Comprehensive Assessment"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    required 
                  />
                </div>

                <div className="lms-form-group">
                  <label>Instructions & Description</label>
                  <textarea 
                    rows="2"
                    className="lms-form-control"
                    placeholder="Provide exam guidelines, total attempts, and scoring details..."
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  />
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Passing Score (%) *</label>
                    <input 
                      type="number"
                      className="lms-form-control"
                      value={quizForm.passingPercentage}
                      onChange={(e) => setQuizForm({ ...quizForm, passingPercentage: Number(e.target.value) })}
                    />
                  </div>
                  <div className="lms-form-group">
                    <label>Time Limit (Minutes) *</label>
                    <input 
                      type="number"
                      className="lms-form-control"
                      value={quizForm.timeLimitMinutes}
                      onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="lms-modal-footer">
                <button type="button" className="btn-lms-secondary" onClick={() => setShowQuizModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  Save Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowQuestionModal(false)}>
          <div className="lms-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Add Multiple Choice Question (MCQ)</h3>
              <button className="action-icon-btn" onClick={() => setShowQuestionModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddQuestion}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Question Statement *</label>
                  <textarea 
                    rows="2"
                    className="lms-form-control"
                    placeholder="Enter question text..."
                    value={questionForm.questionText}
                    onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                    required
                  />
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Option A *</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      value={questionForm.optionA}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="lms-form-group">
                    <label>Option B *</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      value={questionForm.optionB}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Option C *</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      value={questionForm.optionC}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="lms-form-group">
                    <label>Option D *</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      value={questionForm.optionD}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Correct Answer *</label>
                    <select 
                      className="lms-form-control"
                      value={questionForm.correctOption}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctOption: e.target.value })}
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  <div className="lms-form-group">
                    <label>Answer Explanation</label>
                    <input 
                      type="text" 
                      className="lms-form-control"
                      placeholder="Rationale explaining why this is correct..."
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="lms-modal-footer">
                <button type="button" className="btn-lms-secondary" onClick={() => setShowQuestionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  Save MCQ Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSQuizzes;
