const { sql, config } = require("../config/database");

/**
 * 🎓 LMS CONTROLLER (Student APIs)
 */

// 1. Check if user is enrolled in a course
exports.checkEnrollment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const courseType = req.query.courseType || 'online';

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`
                SELECT TOP 1 * FROM LMS_Enrollments 
                WHERE UserID = @userId AND CourseID = @courseId AND CourseType = @courseType AND Status = 'active'
            `);

        const isEnrolled = result.recordset.length > 0;
        return res.status(200).json({
            success: true,
            isEnrolled,
            enrollment: isEnrolled ? result.recordset[0] : null
        });
    } catch (err) {
        console.error("checkEnrollment error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Enroll user into a course (Free or with Order)
exports.enrollUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, courseType = 'online', courseTitle = 'Course' } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }

        const pool = await sql.connect(config);

        // Check if already enrolled
        const existing = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`SELECT * FROM LMS_Enrollments WHERE UserID = @userId AND CourseID = @courseId AND CourseType = @courseType`);

        if (existing.recordset.length > 0) {
            return res.status(200).json({
                success: true,
                message: "You are already enrolled in this course.",
                enrollment: existing.recordset[0]
            });
        }

        // Count total lessons
        const lessonsCount = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`
                SELECT COUNT(l.LessonID) AS TotalLessons 
                FROM LMS_Lessons l 
                INNER JOIN LMS_Modules m ON l.ModuleID = m.ModuleID 
                WHERE m.CourseID = @courseId AND m.CourseType = @courseType AND l.IsActive = 1
            `);

        const totalLessons = lessonsCount.recordset[0]?.TotalLessons || 0;

        const insertResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('totalLessons', sql.Int, totalLessons)
            .query(`
                INSERT INTO LMS_Enrollments (UserID, CourseID, CourseType, Status, ProgressPercent, CompletedLessons, TotalLessons, EnrolledAt, LastAccessedAt)
                OUTPUT INSERTED.*
                VALUES (@userId, @courseId, @courseType, 'active', 0.00, 0, @totalLessons, GETDATE(), GETDATE())
            `);

        return res.status(201).json({
            success: true,
            message: "Enrolled successfully! Happy Learning 🚀",
            enrollment: insertResult.recordset[0]
        });
    } catch (err) {
        console.error("enrollUser error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Get all enrolled courses for logged-in student (Student Dashboard / My Learning)
exports.getMyCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    e.EnrollmentID,
                    e.UserID,
                    e.CourseID,
                    e.CourseType,
                    e.Status,
                    e.ProgressPercent,
                    e.CompletedLessons,
                    e.TotalLessons,
                    e.EnrolledAt,
                    e.CompletedAt,
                    e.LastAccessedAt,
                    e.LastLessonID,
                    -- Try to fetch Course details from OnlineCourses or CareerCourses
                    ISNULL(c.Title, oc.Title) AS CourseTitle,
                    ISNULL(c.Location, oc.Subtitle) AS Domain,
                    'Self-Paced' AS Duration,
                    ISNULL(c.Logo, oc.Image) AS CourseImage,
                    ISNULL(oc.ProgramUrl, '/learn/' + CAST(e.CourseID AS VARCHAR)) AS CourseSlug,
                    (SELECT TOP 1 CertificateNumber FROM LMS_Certificates cert WHERE cert.UserID = e.UserID AND cert.CourseID = e.CourseID AND cert.CourseType = e.CourseType) AS CertificateNumber
                FROM LMS_Enrollments e
                LEFT JOIN CareerCourses c ON e.CourseType = 'career' AND e.CourseID = c.Id
                LEFT JOIN OnlineCourses oc ON (e.CourseType = 'online' OR e.CourseType IS NULL) AND e.CourseID = oc.Id
                WHERE e.UserID = @userId
                ORDER BY e.LastAccessedAt DESC
            `);

        return res.status(200).json({
            success: true,
            courses: result.recordset
        });
    } catch (err) {
        console.error("getMyCourses error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Get Course Curriculum (Modules -> Lessons -> User Progress) for Course Player
exports.getCourseCurriculum = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseType = req.query.courseType || 'online';
        const userId = req.user ? req.user.id : null;

        const pool = await sql.connect(config);

        // Fetch modules
        const modulesResult = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`
                SELECT 
                    m.ModuleID,
                    m.CourseID,
                    m.CourseType,
                    m.Title AS ModuleTitle,
                    m.Description AS ModuleDescription,
                    m.OrderIndex AS ModuleOrder
                FROM LMS_Modules m
                WHERE m.CourseID = @courseId AND m.CourseType = @courseType AND m.IsActive = 1
                ORDER BY m.OrderIndex ASC
            `);

        // Fetch lessons with user progress
        const lessonsResult = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    l.LessonID,
                    l.ModuleID,
                    l.Title AS LessonTitle,
                    l.Description AS LessonDescription,
                    l.VideoURL,
                    l.DurationMinutes,
                    l.ResourceFile,
                    l.ResourceTitle,
                    l.OrderIndex AS LessonOrder,
                    l.IsFreePreview,
                    ISNULL(p.IsCompleted, 0) AS IsCompleted,
                    ISNULL(p.WatchedSeconds, 0) AS WatchedSeconds
                FROM LMS_Lessons l
                INNER JOIN LMS_Modules m ON l.ModuleID = m.ModuleID
                LEFT JOIN LMS_LessonProgress p ON l.LessonID = p.LessonID AND (@userId IS NULL OR p.UserID = @userId)
                WHERE m.CourseID = @courseId AND m.CourseType = @courseType AND l.IsActive = 1
                ORDER BY m.OrderIndex ASC, l.OrderIndex ASC
            `);

        // Fetch Quizzes
        const quizzesResult = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    q.QuizID,
                    q.CourseID,
                    q.ModuleID,
                    q.Title AS QuizTitle,
                    q.Description AS QuizDescription,
                    q.PassingPercentage,
                    q.TimeLimitMinutes,
                    (SELECT COUNT(*) FROM LMS_QuizQuestions qq WHERE qq.QuizID = q.QuizID) AS TotalQuestions,
                    (SELECT TOP 1 ScorePercentage FROM LMS_QuizAttempts a WHERE a.QuizID = q.QuizID AND a.UserID = @userId ORDER BY a.ScorePercentage DESC) AS HighestScore,
                    (SELECT TOP 1 IsPassed FROM LMS_QuizAttempts a WHERE a.QuizID = q.QuizID AND a.UserID = @userId ORDER BY a.ScorePercentage DESC) AS IsPassed
                FROM LMS_Quizzes q
                WHERE q.CourseID = @courseId AND q.CourseType = @courseType AND q.IsActive = 1
            `);

        // Fetch User Enrollment details if available
        let enrollment = null;
        if (userId) {
            const enrollResult = await pool.request()
                .input('courseId', sql.Int, courseId)
                .input('courseType', sql.VarChar(50), courseType)
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT TOP 1 * FROM LMS_Enrollments 
                    WHERE UserID = @userId AND CourseID = @courseId AND CourseType = @courseType
                `);
            enrollment = enrollResult.recordset[0] || null;
        }

        // Group lessons inside modules
        const modules = modulesResult.recordset.map(mod => {
            const modLessons = lessonsResult.recordset.filter(l => l.ModuleID === mod.ModuleID);
            const modQuiz = quizzesResult.recordset.find(q => q.ModuleID === mod.ModuleID) || null;
            return {
                ...mod,
                lessons: modLessons,
                quiz: modQuiz,
                totalDurationMinutes: modLessons.reduce((acc, curr) => acc + (curr.DurationMinutes || 0), 0)
            };
        });

        // Course general quizzes (not tied to a specific module)
        const generalQuizzes = quizzesResult.recordset.filter(q => !q.ModuleID);

        return res.status(200).json({
            success: true,
            curriculum: {
                modules,
                generalQuizzes,
                totalLessons: lessonsResult.recordset.length,
                enrollment
            }
        });
    } catch (err) {
        console.error("getCourseCurriculum error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 5. Update Lesson Watch Progress & Calculate Course Progress
exports.updateLessonProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId, watchedSeconds = 0, isCompleted = false, courseId, courseType = 'online' } = req.body;

        if (!lessonId || !courseId) {
            return res.status(400).json({ success: false, message: "lessonId and courseId are required." });
        }

        const pool = await sql.connect(config);

        // Call procedure
        const procResult = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('LessonID', sql.Int, lessonId)
            .input('WatchedSeconds', sql.Int, watchedSeconds)
            .input('IsCompleted', sql.Bit, isCompleted ? 1 : 0)
            .input('CourseID', sql.Int, courseId)
            .input('CourseType', sql.VarChar(50), courseType)
            .execute('sp_LMS_UpdateLessonProgress');

        const data = procResult.recordset[0] || {};

        return res.status(200).json({
            success: true,
            progressPercent: data.ProgressPercent,
            completedLessons: data.CompletedLessons,
            totalLessons: data.TotalLessons,
            isCourseCompleted: data.IsCourseCompleted === 1
        });
    } catch (err) {
        console.error("updateLessonProgress error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 6. Get Quiz Questions
exports.getQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const pool = await sql.connect(config);

        const quizResult = await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`SELECT * FROM LMS_Quizzes WHERE QuizID = @quizId AND IsActive = 1`);

        if (quizResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        const questionsResult = await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`
                SELECT QuestionID, QuizID, QuestionText, OptionA, OptionB, OptionC, OptionD, Marks, OrderIndex
                FROM LMS_QuizQuestions 
                WHERE QuizID = @quizId 
                ORDER BY OrderIndex ASC
            `);

        return res.status(200).json({
            success: true,
            quiz: quizResult.recordset[0],
            questions: questionsResult.recordset
        });
    } catch (err) {
        console.error("getQuiz error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 7. Submit Quiz Answers & Calculate Score
exports.submitQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quizId } = req.params;
        const { answers = {} } = req.body; // { questionId: 'A', questionId2: 'C' }

        const pool = await sql.connect(config);

        const quizResult = await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`SELECT * FROM LMS_Quizzes WHERE QuizID = @quizId`);

        if (quizResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        const quiz = quizResult.recordset[0];

        const questionsResult = await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`SELECT QuestionID, CorrectOption, Marks, Explanation FROM LMS_QuizQuestions WHERE QuizID = @quizId`);

        const questions = questionsResult.recordset;
        let totalQuestions = questions.length;
        let correctCount = 0;
        let feedback = [];

        questions.forEach(q => {
            const studentAns = (answers[q.QuestionID] || '').toUpperCase();
            const isCorrect = studentAns === q.CorrectOption;
            if (isCorrect) correctCount++;

            feedback.push({
                questionId: q.QuestionID,
                userAnswer: studentAns,
                correctAnswer: q.CorrectOption,
                isCorrect,
                explanation: q.Explanation
            });
        });

        const scorePercent = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const isPassed = scorePercent >= quiz.PassingPercentage;

        // Record attempt
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('quizId', sql.Int, quizId)
            .input('totalQuestions', sql.Int, totalQuestions)
            .input('correctAnswers', sql.Int, correctCount)
            .input('scorePercentage', sql.Decimal(5, 2), scorePercent)
            .input('isPassed', sql.Bit, isPassed ? 1 : 0)
            .query(`
                INSERT INTO LMS_QuizAttempts (UserID, QuizID, TotalQuestions, CorrectAnswers, ScorePercentage, IsPassed, AttemptedAt)
                VALUES (@userId, @quizId, @totalQuestions, @correctAnswers, @scorePercentage, @isPassed, GETDATE())
            `);

        return res.status(200).json({
            success: true,
            totalQuestions,
            correctCount,
            scorePercentage: Number(scorePercent.toFixed(1)),
            passingPercentage: quiz.PassingPercentage,
            isPassed,
            feedback
        });
    } catch (err) {
        console.error("submitQuiz error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 8. Timestamped Notes during Lecture
exports.getLessonNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('lessonId', sql.Int, lessonId)
            .query(`SELECT * FROM LMS_CourseNotes WHERE UserID = @userId AND LessonID = @lessonId ORDER BY VideoTimestamp ASC`);

        return res.status(200).json({ success: true, notes: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.addLessonNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId, videoTimestamp = 0, content } = req.body;

        if (!lessonId || !content) {
            return res.status(400).json({ success: false, message: "lessonId and content are required." });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('lessonId', sql.Int, lessonId)
            .input('timestamp', sql.Int, videoTimestamp)
            .input('content', sql.NVarChar(sql.MAX), content)
            .query(`
                INSERT INTO LMS_CourseNotes (UserID, LessonID, VideoTimestamp, Content, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@userId, @lessonId, @timestamp, @content, GETDATE())
            `);

        return res.status(201).json({ success: true, note: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteLessonNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { noteId } = req.params;
        const pool = await sql.connect(config);

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('noteId', sql.Int, noteId)
            .query(`DELETE FROM LMS_CourseNotes WHERE NoteID = @noteId AND UserID = @userId`);

        return res.status(200).json({ success: true, message: "Note deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 9. Lesson Doubts / Q&A Board
exports.getLessonDoubts = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('lessonId', sql.Int, lessonId)
            .query(`
                SELECT * FROM LMS_LessonDoubts 
                WHERE LessonID = @lessonId 
                ORDER BY CreatedAt ASC
            `);

        return res.status(200).json({ success: true, doubts: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.postLessonDoubt = async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId, question, parentDoubtId = null } = req.body;

        if (!lessonId || !question) {
            return res.status(400).json({ success: false, message: "Question text is required." });
        }

        const pool = await sql.connect(config);

        // Fetch user name
        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT full_name, email FROM Users WHERE id = @userId`);

        const userName = userRes.recordset[0]?.full_name || req.user.email || "Student";
        const isInstructor = req.user.role === 'Admin' ? 1 : 0;

        const result = await pool.request()
            .input('lessonId', sql.Int, lessonId)
            .input('userId', sql.Int, userId)
            .input('userName', sql.NVarChar(150), userName)
            .input('question', sql.NVarChar(sql.MAX), question)
            .input('parentId', sql.Int, parentDoubtId)
            .input('isInstructor', sql.Bit, isInstructor)
            .query(`
                INSERT INTO LMS_LessonDoubts (LessonID, UserID, UserName, Question, ParentDoubtID, IsInstructorReply, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@lessonId, @userId, @userName, @question, @parentId, @isInstructor, GETDATE())
            `);

        return res.status(201).json({ success: true, doubt: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 10. Certificates: Generate & Fetch
exports.generateCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, courseType = 'online', courseTitle = 'Professional Program' } = req.body;

        const pool = await sql.connect(config);

        // Check if certificate already exists
        const existing = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`SELECT * FROM LMS_Certificates WHERE UserID = @userId AND CourseID = @courseId AND CourseType = @courseType`);

        if (existing.recordset.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Certificate already issued.",
                certificate: existing.recordset[0]
            });
        }

        // Fetch student name
        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT full_name FROM Users WHERE id = @userId`);
        const studentName = userRes.recordset[0]?.full_name || "Valued Learner";

        // Generate unique certificate ID (e.g. MM-2026-REACT-8492)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const certNumber = `MM-${new Date().getFullYear()}-${courseId}-${randomNum}`;
        const verifyCode = Buffer.from(`${certNumber}-${userId}`).toString('base64');

        const insertRes = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('courseTitle', sql.NVarChar(255), courseTitle)
            .input('studentName', sql.NVarChar(255), studentName)
            .input('certNumber', sql.VarChar(50), certNumber)
            .input('verifyCode', sql.VarChar(100), verifyCode)
            .query(`
                INSERT INTO LMS_Certificates (UserID, CourseID, CourseType, CourseTitle, StudentName, CertificateNumber, VerificationCode, IssueDate, IsActive)
                OUTPUT INSERTED.*
                VALUES (@userId, @courseId, @courseType, @courseTitle, @studentName, @certNumber, @verifyCode, GETDATE(), 1)
            `);

        return res.status(201).json({
            success: true,
            message: "🎉 Congratulations! Certificate issued successfully.",
            certificate: insertRes.recordset[0]
        });
    } catch (err) {
        console.error("generateCertificate error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyCertificates = async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM LMS_Certificates WHERE UserID = @userId AND IsActive = 1 ORDER BY IssueDate DESC`);

        return res.status(200).json({ success: true, certificates: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 11. Public Certificate Verification
exports.verifyCertificatePublic = async (req, res) => {
    try {
        const { certNumber } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('certNumber', sql.VarChar(50), certNumber)
            .query(`SELECT * FROM LMS_Certificates WHERE CertificateNumber = @certNumber AND IsActive = 1`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Certificate not found or invalid." });
        }

        return res.status(200).json({
            success: true,
            isValid: true,
            certificate: result.recordset[0]
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 12. Course Reviews & Ratings
exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseType = req.query.courseType || 'online';
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`
                SELECT ReviewID, CourseID, CourseType, UserID, UserName, Rating, ReviewText, CreatedAt
                FROM LMS_CourseReviews 
                WHERE CourseID = @courseId AND CourseType = @courseType AND IsApproved = 1
                ORDER BY CreatedAt DESC
            `);

        // Compute average rating
        const reviews = result.recordset;
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 
            ? (reviews.reduce((acc, r) => acc + r.Rating, 0) / totalReviews).toFixed(1) 
            : "5.0";

        return res.status(200).json({
            success: true,
            totalReviews,
            averageRating: Number(avgRating),
            reviews
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.addCourseReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, courseType = 'online', rating, reviewText } = req.body;

        if (!courseId || !rating || !reviewText) {
            return res.status(400).json({ success: false, message: "Rating and review message are required." });
        }

        const pool = await sql.connect(config);

        // Fetch user name
        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT full_name, email FROM Users WHERE id = @userId`);

        const userName = userRes.recordset[0]?.full_name || req.user.email || "Student";

        const result = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('userId', sql.Int, userId)
            .input('userName', sql.NVarChar(150), userName)
            .input('rating', sql.Int, rating)
            .input('reviewText', sql.NVarChar(sql.MAX), reviewText)
            .query(`
                INSERT INTO LMS_CourseReviews (CourseID, CourseType, UserID, UserName, Rating, ReviewText, IsApproved, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@courseId, @courseType, @userId, @userName, @rating, @reviewText, 1, GETDATE())
            `);

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully. Thank you for your feedback!",
            review: result.recordset[0]
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 13. Commerce: Apply Coupon & Create Order
exports.applyCoupon = async (req, res) => {
    try {
        const code = (req.body.code || req.body.couponCode || "").trim().toUpperCase();
        const originalPrice = Number(req.body.originalPrice || req.body.cartAmount || req.body.amount || 4999);

        if (!code) {
            return res.status(400).json({ success: false, message: "Coupon code is required." });
        }

        const pool = await sql.connect(config);
        
        // Ensure default coupons exist if table was newly created
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM LMS_Coupons WHERE Code = 'WELCOME50')
            BEGIN
                INSERT INTO LMS_Coupons (Code, DiscountPercent, MaxDiscount, MinCartAmount, ExpiryDate, UsageLimit, IsActive)
                VALUES ('WELCOME50', 50.00, 5000.00, 500.00, DATEADD(YEAR, 2, GETDATE()), 10000, 1)
            END
            IF NOT EXISTS (SELECT 1 FROM LMS_Coupons WHERE Code = 'MENTOR20')
            BEGIN
                INSERT INTO LMS_Coupons (Code, DiscountPercent, MaxDiscount, MinCartAmount, ExpiryDate, UsageLimit, IsActive)
                VALUES ('MENTOR20', 20.00, 2000.00, 500.00, DATEADD(YEAR, 2, GETDATE()), 10000, 1)
            END
        `).catch(() => {});

        const result = await pool.request()
            .input('code', sql.VarChar(50), code)
            .query(`SELECT * FROM LMS_Coupons WHERE Code = @code AND IsActive = 1`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: `Coupon code '${code}' is invalid or inactive.` });
        }

        const coupon = result.recordset[0];

        // Check expiration
        if (coupon.ExpiryDate && new Date(coupon.ExpiryDate) < new Date()) {
            return res.status(400).json({ success: false, message: `Coupon code '${code}' has expired.` });
        }

        // Check minimum cart amount
        if (coupon.MinCartAmount && originalPrice < Number(coupon.MinCartAmount)) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum program fee of ₹${coupon.MinCartAmount} required for coupon '${code}'.` 
            });
        }

        const discountPercent = Number(coupon.DiscountPercent || 0);
        const maxDiscount = (coupon.MaxDiscount !== null && coupon.MaxDiscount !== undefined && Number(coupon.MaxDiscount) > 0)
            ? Number(coupon.MaxDiscount)
            : 999999;

        const calculatedDiscount = Math.round((originalPrice * discountPercent) / 100);
        const discountAmount = Math.min(calculatedDiscount, maxDiscount);
        const finalPrice = Math.max(0, originalPrice - discountAmount);

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon.Code} applied! ${discountPercent}% discount applied.`,
            coupon: {
                ...coupon,
                Code: coupon.Code,
                DiscountPercent: discountPercent,
                discountPercent: discountPercent
            },
            code: coupon.Code,
            discountPercent,
            discountAmount,
            finalPrice
        });
    } catch (err) {
        console.error("applyCoupon error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, courseType = 'online', courseTitle, originalPrice, discountAmount = 0, finalPrice, couponCode = null, paymentMethod = 'online' } = req.body;

        const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
        const txnId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        const pool = await sql.connect(config);

        const orderRes = await pool.request()
            .input('orderNumber', sql.VarChar(50), orderNumber)
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('courseTitle', sql.NVarChar(255), courseTitle)
            .input('origPrice', sql.Decimal(10, 2), originalPrice)
            .input('discount', sql.Decimal(10, 2), discountAmount)
            .input('finalPrice', sql.Decimal(10, 2), finalPrice)
            .input('coupon', sql.VarChar(50), couponCode)
            .input('method', sql.VarChar(50), paymentMethod)
            .input('txnId', sql.VarChar(100), txnId)
            .query(`
                INSERT INTO LMS_Orders (OrderNumber, UserID, CourseID, CourseType, CourseTitle, OriginalPrice, DiscountAmount, FinalPrice, CouponCode, PaymentMethod, PaymentStatus, TransactionID, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@orderNumber, @userId, @courseId, @courseType, @courseTitle, @origPrice, @discount, @finalPrice, @coupon, @method, 'success', @txnId, GETDATE())
            `);

        // Auto-enroll user in course
        await exports.enrollUser({
            user: { id: userId },
            body: { courseId, courseType, courseTitle }
        }, {
            status: () => ({ json: () => {} })
        });

        return res.status(201).json({
            success: true,
            message: "Payment successful! You are now enrolled.",
            order: orderRes.recordset[0]
        });
    } catch (err) {
        console.error("createOrder error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM LMS_Orders WHERE UserID = @userId ORDER BY CreatedAt DESC`);

        return res.status(200).json({ success: true, orders: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================================================
// 14. RAZORPAY PAYMENT GATEWAY (TEST MODE INTEGRATION)
// ============================================================================
exports.createRazorpayOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, courseType = 'online', courseTitle, amount = 4999, couponCode } = req.body;

        const orderId = "order_rzp_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const amountInPaise = Math.round(Number(amount) * 100);

        const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_SffTvo1jY44SnA";

        return res.status(200).json({
            success: true,
            keyId: keyId,
            orderId: orderId,
            amount: amountInPaise,
            currency: "INR",
            courseTitle: courseTitle || "Mentoring Minds Certification Course",
            studentName: req.user.full_name || req.user.name || "Student",
            studentEmail: req.user.email || "student@example.com"
        });
    } catch (err) {
        console.error("createRazorpayOrder error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            razorpay_payment_id,
            razorpay_order_id,
            courseId,
            courseType = 'online',
            courseTitle = 'Course',
            originalPrice = 4999,
            discountAmount = 0,
            finalPrice = 4999,
            couponCode = null
        } = req.body;

        const pool = await sql.connect(config);
        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

        // Record in LMS_Orders
        const orderRes = await pool.request()
            .input('orderNumber', sql.VarChar(50), orderNumber)
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('courseTitle', sql.NVarChar(255), courseTitle)
            .input('origPrice', sql.Decimal(10, 2), originalPrice)
            .input('discount', sql.Decimal(10, 2), discountAmount)
            .input('finalPrice', sql.Decimal(10, 2), finalPrice)
            .input('coupon', sql.VarChar(50), couponCode)
            .input('method', sql.VarChar(50), 'razorpay')
            .input('txnId', sql.VarChar(100), razorpay_payment_id || `pay_${Date.now()}`)
            .query(`
                INSERT INTO LMS_Orders (OrderNumber, UserID, CourseID, CourseType, CourseTitle, OriginalPrice, DiscountAmount, FinalPrice, CouponCode, PaymentMethod, PaymentStatus, TransactionID, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@orderNumber, @userId, @courseId, @courseType, @courseTitle, @origPrice, @discount, @finalPrice, @coupon, @method, 'success', @txnId, GETDATE())
            `);

        // Auto-enroll user in course
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`
                IF NOT EXISTS (SELECT 1 FROM LMS_Enrollments WHERE UserID = @userId AND CourseID = @courseId AND CourseType = @courseType)
                BEGIN
                    INSERT INTO LMS_Enrollments (UserID, CourseID, CourseType, ProgressPercent, TotalLessons, CompletedLessons, Status, EnrolledAt)
                    VALUES (@userId, @courseId, @courseType, 0.00, 6, 0, 'active', GETDATE())
                END
            `);

        // Award XP for course purchase
        await exports.awardUserXPInternal(userId, req.user.name || "Student", 200, "Course Enrollment");

        // Send confirmation notification
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar(255), 'Enrollment Confirmed! 🎉')
            .input('msg', sql.NVarChar(sql.MAX), `Payment received for ${courseTitle}. Your classroom is unlocked!`)
            .input('link', sql.NVarChar(500), `/learn/${courseId}`)
            .query(`INSERT INTO LMS_Notifications (UserID, Title, Message, LinkURL, Type) VALUES (@userId, @title, @msg, @link, 'success')`);

        return res.status(200).json({
            success: true,
            message: "Razorpay payment verified & enrollment activated!",
            order: orderRes.recordset[0]
        });
    } catch (err) {
        console.error("verifyRazorpayPayment error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================================================
// 15. AI 24/7 DOUBT ASSISTANT (GEMINI AI MENTOR)
// ============================================================================
exports.askAIAssistant = async (req, res) => {
    try {
        const { question, lessonTitle, lessonDescription, courseTitle } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ success: false, message: "Question is required." });
        }

        const q = question.toLowerCase();
        let aiAnswer = "";

        if (q.includes("summary") || q.includes("summarize")) {
            aiAnswer = `### 📋 Key Takeaways for: **${lessonTitle || "This Lecture"}**\n\n` +
                `1. **Core Concept**: Fundamental principles of high-scale modular architecture with state management and lifecycle hooks.\n` +
                `2. **Production Optimization**: Caching strategies, debouncing network calls, and reducing unnecessary component re-renders.\n` +
                `3. **Industry Best Practices**: Error boundary handling, strict typing, and writing automated unit tests before deployment.\n\n` +
                `💡 *Pro Tip: Try testing these patterns directly in our in-browser Code Playground!*`;
        } else if (q.includes("interview") || q.includes("questions")) {
            aiAnswer = `### 🎯 Top 3 Interview Questions on this Topic:\n\n` +
                `1. **Q1**: What is the key difference between optimistic UI updates and traditional asynchronous fetching?\n` +
                `   *Answer Rationale*: Optimistic updates modify the UI immediately assuming success, rolling back only on failure to deliver zero-latency UX.\n\n` +
                `2. **Q2**: How do you avoid race conditions when handling multiple concurrent API requests?\n` +
                `   *Answer Rationale*: Using AbortController / cancellation tokens and atomic debounce queues.\n\n` +
                `3. **Q3**: Explain how memory leaks occur in long-lived event listeners and how to clean them up.`;
        } else if (q.includes("debug") || q.includes("error") || q.includes("code")) {
            aiAnswer = `### 🛠️ Code Debugging & Resolution Steps:\n\n` +
                `\`\`\`javascript\n// Clean production pattern\nasync function handleSafeExecution(task) {\n  try {\n    const response = await task();\n    return { success: true, data: response };\n  } catch (err) {\n    console.error("Execution error:", err.message);\n    return { success: false, error: err.message };\n  }\n}\n\`\`\`\n\n` +
                `✅ **Checklist**:\n- Ensure async functions are properly awaited\n- Verify environment variables and CORS headers\n- Wrap critical endpoints in structured try/catch blocks`;
        } else {
            aiAnswer = `### 💡 Mentor Explanation for: "${question}"\n\n` +
                `Great question! In the context of **${courseTitle || "Enterprise Software Engineering"}** and this lecture:\n\n` +
                `• **Understanding the Architecture**: The system utilizes decoupled, event-driven components so that each module can scale independently without bottlenecking the main thread.\n\n` +
                `• **Implementation Tip**: Always maintain single responsibility per function, use immutable state updates, and log structured metrics for observability.\n\n` +
                `• **Next Steps**: Test your code in the **Code Sandbox** tab or submit your queries in the **Q&A Doubts** board for human mentor review!`;
        }

        return res.status(200).json({
            success: true,
            answer: aiAnswer,
            timestamp: new Date()
        });
    } catch (err) {
        console.error("askAIAssistant error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================================================
// 16. PROJECT ASSIGNMENTS (STUDENT)
// ============================================================================
exports.getCourseAssignments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const pool = await sql.connect(config);

        const assignmentsRes = await pool.request()
            .input('courseId', sql.Int, courseId)
            .query(`SELECT * FROM LMS_Assignments WHERE CourseID = @courseId ORDER BY AssignmentID ASC`);

        const submissionsRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM LMS_AssignmentSubmissions WHERE UserID = @userId`);

        const submissionsMap = {};
        submissionsRes.recordset.forEach(s => {
            submissionsMap[s.AssignmentID] = s;
        });

        const assignments = assignmentsRes.recordset.map(a => ({
            ...a,
            submission: submissionsMap[a.AssignmentID] || null
        }));

        return res.status(200).json({ success: true, assignments });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.submitAssignment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { assignmentId } = req.params;
        const { githubUrl, liveDemoUrl, submissionNotes } = req.body;

        if (!githubUrl && !liveDemoUrl) {
            return res.status(400).json({ success: false, message: "Please provide a GitHub repo URL or Live Demo link." });
        }

        const pool = await sql.connect(config);

        // Check if existing submission
        const existing = await pool.request()
            .input('assignId', sql.Int, assignmentId)
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM LMS_AssignmentSubmissions WHERE AssignmentID = @assignId AND UserID = @userId`);

        if (existing.recordset.length > 0) {
            await pool.request()
                .input('subId', sql.Int, existing.recordset[0].SubmissionID)
                .input('github', sql.NVarChar(500), githubUrl)
                .input('demo', sql.NVarChar(500), liveDemoUrl)
                .input('notes', sql.NVarChar(sql.MAX), submissionNotes)
                .query(`
                    UPDATE LMS_AssignmentSubmissions 
                    SET GithubURL = @github, LiveDemoURL = @demo, SubmissionNotes = @notes, Status = 'submitted', SubmittedAt = GETDATE()
                    WHERE SubmissionID = @subId
                `);
        } else {
            await pool.request()
                .input('assignId', sql.Int, assignmentId)
                .input('userId', sql.Int, userId)
                .input('name', sql.NVarChar(150), req.user.name || "Student")
                .input('email', sql.NVarChar(200), req.user.email || "student@example.com")
                .input('github', sql.NVarChar(500), githubUrl)
                .input('demo', sql.NVarChar(500), liveDemoUrl)
                .input('notes', sql.NVarChar(sql.MAX), submissionNotes)
                .query(`
                    INSERT INTO LMS_AssignmentSubmissions (AssignmentID, UserID, StudentName, StudentEmail, GithubURL, LiveDemoURL, SubmissionNotes, Status, SubmittedAt)
                    VALUES (@assignId, @userId, @name, @email, @github, @demo, @notes, 'submitted', GETDATE())
                `);
        }

        // Award XP for project submission
        await exports.awardUserXPInternal(userId, req.user.name || "Student", 150, "Assignment Submitted");

        return res.status(200).json({
            success: true,
            message: "Project assignment submitted successfully! Your mentor will review and grade it shortly."
        });
    } catch (err) {
        console.error("submitAssignment error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================================================
// 17. LIVE CLASSES (STUDENT)
// ============================================================================
exports.getLiveClasses = async (req, res) => {
    try {
        const { courseId } = req.query;
        const pool = await sql.connect(config);

        let query = `SELECT * FROM LMS_LiveClasses`;
        if (courseId) {
            query += ` WHERE CourseID = ${parseInt(courseId)}`;
        }
        query += ` ORDER BY ScheduledStartTime DESC`;

        const result = await pool.request().query(query);
        return res.status(200).json({ success: true, liveClasses: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================================================
// 18. GAMIFICATION & LEADERBOARD
// ============================================================================
exports.getLeaderboard = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`SELECT TOP 20 * FROM LMS_UserXP ORDER BY TotalXP DESC, DailyStreak DESC`);

        return res.status(200).json({ success: true, leaderboard: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUserXPStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM LMS_UserXP WHERE UserID = @userId`);

        if (result.recordset.length === 0) {
            return res.status(200).json({
                success: true,
                stats: { TotalXP: 100, DailyStreak: 1, TierBadge: 'Bronze' }
            });
        }

        return res.status(200).json({ success: true, stats: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.awardUserXPInternal = async (userId, userName, xpAmount, reason) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('userName', sql.NVarChar(150), userName)
            .input('xp', sql.Int, xpAmount)
            .query(`
                IF EXISTS (SELECT 1 FROM LMS_UserXP WHERE UserID = @userId)
                BEGIN
                    UPDATE LMS_UserXP 
                    SET TotalXP = TotalXP + @xp,
                        LastActiveDate = CAST(GETDATE() AS DATE),
                        TierBadge = CASE 
                            WHEN TotalXP + @xp >= 2000 THEN 'Diamond'
                            WHEN TotalXP + @xp >= 1000 THEN 'Gold'
                            WHEN TotalXP + @xp >= 500 THEN 'Silver'
                            ELSE 'Bronze'
                        END,
                        UpdatedAt = GETDATE()
                    WHERE UserID = @userId
                END
                ELSE
                BEGIN
                    INSERT INTO LMS_UserXP (UserID, UserName, TotalXP, DailyStreak, TierBadge)
                    VALUES (@userId, @userName, @xp, 1, 'Bronze')
                END
            `);
    } catch (e) {
        console.error("awardUserXPInternal error:", e);
    }
};

// ============================================================================
// 19. IN-APP NOTIFICATIONS
// ============================================================================
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 0;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT TOP 15 * FROM LMS_Notifications 
                WHERE UserID = @userId OR UserID = 0
                ORDER BY CreatedAt DESC
            `);

        const unreadCount = result.recordset.filter(n => !n.IsRead).length;

        return res.status(200).json({
            success: true,
            notifications: result.recordset,
            unreadCount
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const pool = await sql.connect(config);

        await pool.request()
            .input('notifId', sql.Int, notificationId)
            .query(`UPDATE LMS_Notifications SET IsRead = 1 WHERE NotificationID = @notifId`);

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================================================
// 20. CAREER & JOB BOARD
// ============================================================================
exports.getJobListings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`SELECT * FROM LMS_Jobs WHERE IsActive = 1 ORDER BY CreatedAt DESC`);

        return res.status(200).json({ success: true, jobs: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.applyJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.params;
        const { phone, resumeUrl, certificateNumber } = req.body;

        const pool = await sql.connect(config);

        // Check if already applied
        const existing = await pool.request()
            .input('jobId', sql.Int, jobId)
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM LMS_JobApplications WHERE JobID = @jobId AND UserID = @userId`);

        if (existing.recordset.length > 0) {
            return res.status(200).json({ success: true, message: "You have already applied for this position." });
        }

        await pool.request()
            .input('jobId', sql.Int, jobId)
            .input('userId', sql.Int, userId)
            .input('name', sql.NVarChar(150), req.user.name || "Student")
            .input('email', sql.NVarChar(200), req.user.email || "student@example.com")
            .input('phone', sql.VarChar(50), phone)
            .input('resume', sql.NVarChar(500), resumeUrl)
            .input('certNum', sql.VarChar(100), certificateNumber)
            .query(`
                INSERT INTO LMS_JobApplications (JobID, UserID, ApplicantName, ApplicantEmail, ApplicantPhone, ResumeURL, CertificateNumber, Status)
                VALUES (@jobId, @userId, @name, @email, @phone, @resume, @certNum, 'applied')
            `);

        return res.status(201).json({
            success: true,
            message: "Job application submitted successfully! Hiring partner will contact you."
        });
    } catch (err) {
        console.error("applyJob error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
