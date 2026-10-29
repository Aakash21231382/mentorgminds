const { sql, config } = require("../config/database");

/**
 * 🛠️ LMS ADMIN CONTROLLER
 */

// ── MODULES & LESSONS ──────────────────────────────────────

exports.getCourseModules = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseType = req.query.courseType || 'online';
        const pool = await sql.connect(config);

        const modulesRes = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`SELECT * FROM LMS_Modules WHERE CourseID = @courseId AND CourseType = @courseType ORDER BY OrderIndex ASC`);

        const lessonsRes = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .query(`
                SELECT l.* 
                FROM LMS_Lessons l 
                INNER JOIN LMS_Modules m ON l.ModuleID = m.ModuleID
                WHERE m.CourseID = @courseId AND m.CourseType = @courseType
                ORDER BY m.OrderIndex ASC, l.OrderIndex ASC
            `);

        const modules = modulesRes.recordset.map(mod => ({
            ...mod,
            lessons: lessonsRes.recordset.filter(l => l.ModuleID === mod.ModuleID)
        }));

        return res.status(200).json({ success: true, modules });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createModule = async (req, res) => {
    try {
        const { courseId, courseType = 'online', title, description, orderIndex = 1 } = req.body;
        if (!courseId || !title) {
            return res.status(400).json({ success: false, message: "courseId and title are required." });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('title', sql.NVarChar(255), title)
            .input('description', sql.NVarChar(sql.MAX), description || '')
            .input('orderIndex', sql.Int, orderIndex)
            .query(`
                INSERT INTO LMS_Modules (CourseID, CourseType, Title, Description, OrderIndex, IsActive, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@courseId, @courseType, @title, @description, @orderIndex, 1, GETDATE())
            `);

        return res.status(201).json({ success: true, module: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { title, description, orderIndex } = req.body;

        const pool = await sql.connect(config);
        await pool.request()
            .input('moduleId', sql.Int, moduleId)
            .input('title', sql.NVarChar(255), title)
            .input('description', sql.NVarChar(sql.MAX), description)
            .input('orderIndex', sql.Int, orderIndex)
            .query(`
                UPDATE LMS_Modules 
                SET Title = @title, Description = @description, OrderIndex = @orderIndex, UpdatedAt = GETDATE()
                WHERE ModuleID = @moduleId
            `);

        return res.status(200).json({ success: true, message: "Module updated." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('moduleId', sql.Int, moduleId)
            .query(`DELETE FROM LMS_Modules WHERE ModuleID = @moduleId`);

        return res.status(200).json({ success: true, message: "Module deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createLesson = async (req, res) => {
    try {
        const { moduleId, title, description, videoUrl, durationMinutes = 10, resourceFile = '', resourceTitle = '', orderIndex = 1, isFreePreview = false } = req.body;

        if (!moduleId || !title) {
            return res.status(400).json({ success: false, message: "moduleId and title are required." });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('moduleId', sql.Int, moduleId)
            .input('title', sql.NVarChar(255), title)
            .input('description', sql.NVarChar(sql.MAX), description || '')
            .input('videoUrl', sql.NVarChar(500), videoUrl || '')
            .input('duration', sql.Int, durationMinutes)
            .input('resourceFile', sql.NVarChar(500), resourceFile || '')
            .input('resourceTitle', sql.NVarChar(255), resourceTitle || '')
            .input('orderIndex', sql.Int, orderIndex)
            .input('isPreview', sql.Bit, isFreePreview ? 1 : 0)
            .query(`
                INSERT INTO LMS_Lessons (ModuleID, Title, Description, VideoURL, DurationMinutes, ResourceFile, ResourceTitle, OrderIndex, IsFreePreview, IsActive, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@moduleId, @title, @description, @videoUrl, @duration, @resourceFile, @resourceTitle, @orderIndex, @isPreview, 1, GETDATE())
            `);

        return res.status(201).json({ success: true, lesson: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title, description, videoUrl, durationMinutes, resourceFile, resourceTitle, orderIndex, isFreePreview } = req.body;

        const pool = await sql.connect(config);
        await pool.request()
            .input('lessonId', sql.Int, lessonId)
            .input('title', sql.NVarChar(255), title)
            .input('description', sql.NVarChar(sql.MAX), description)
            .input('videoUrl', sql.NVarChar(500), videoUrl)
            .input('duration', sql.Int, durationMinutes)
            .input('resourceFile', sql.NVarChar(500), resourceFile)
            .input('resourceTitle', sql.NVarChar(255), resourceTitle)
            .input('orderIndex', sql.Int, orderIndex)
            .input('isPreview', sql.Bit, isFreePreview ? 1 : 0)
            .query(`
                UPDATE LMS_Lessons 
                SET Title = @title, Description = @description, VideoURL = @videoUrl, DurationMinutes = @duration,
                    ResourceFile = @resourceFile, ResourceTitle = @resourceTitle, OrderIndex = @orderIndex,
                    IsFreePreview = @isPreview, UpdatedAt = GETDATE()
                WHERE LessonID = @lessonId
            `);

        return res.status(200).json({ success: true, message: "Lesson updated." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('lessonId', sql.Int, lessonId)
            .query(`DELETE FROM LMS_Lessons WHERE LessonID = @lessonId`);

        return res.status(200).json({ success: true, message: "Lesson deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── QUIZZES & QUESTIONS ────────────────────────────────────

exports.getAllQuizzes = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`
                SELECT 
                    q.*,
                    (SELECT COUNT(*) FROM LMS_QuizQuestions qq WHERE qq.QuizID = q.QuizID) AS TotalQuestions,
                    (SELECT COUNT(*) FROM LMS_QuizAttempts a WHERE a.QuizID = q.QuizID) AS TotalAttempts
                FROM LMS_Quizzes q 
                ORDER BY q.CreatedAt DESC
            `);

        return res.status(200).json({ success: true, quizzes: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const { courseId, courseType = 'online', moduleId = null, title, description = '', passingPercentage = 70, timeLimitMinutes = 15 } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('moduleId', sql.Int, moduleId)
            .input('title', sql.NVarChar(255), title)
            .input('description', sql.NVarChar(sql.MAX), description)
            .input('passing', sql.Int, passingPercentage)
            .input('timeLimit', sql.Int, timeLimitMinutes)
            .query(`
                INSERT INTO LMS_Quizzes (CourseID, CourseType, ModuleID, Title, Description, PassingPercentage, TimeLimitMinutes, IsActive, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@courseId, @courseType, @moduleId, @title, @description, @passing, @timeLimit, 1, GETDATE())
            `);

        return res.status(201).json({ success: true, quiz: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.addQuizQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questionText, optionA, optionB, optionC, optionD, correctOption, explanation = '', marks = 1 } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('quizId', sql.Int, quizId)
            .input('qText', sql.NVarChar(sql.MAX), questionText)
            .input('optA', sql.NVarChar(500), optionA)
            .input('optB', sql.NVarChar(500), optionB)
            .input('optC', sql.NVarChar(500), optionC)
            .input('optD', sql.NVarChar(500), optionD)
            .input('correct', sql.Char(1), correctOption.toUpperCase())
            .input('exp', sql.NVarChar(sql.MAX), explanation)
            .input('marks', sql.Int, marks)
            .query(`
                INSERT INTO LMS_QuizQuestions (QuizID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Explanation, Marks, OrderIndex)
                OUTPUT INSERTED.*
                VALUES (@quizId, @qText, @optA, @optB, @optC, @optD, @correct, @exp, @marks, 1)
            `);

        return res.status(201).json({ success: true, question: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteQuizQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('questionId', sql.Int, questionId)
            .query(`DELETE FROM LMS_QuizQuestions WHERE QuestionID = @questionId`);

        return res.status(200).json({ success: true, message: "Question deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`DELETE FROM LMS_Quizzes WHERE QuizID = @quizId`);

        return res.status(200).json({ success: true, message: "Quiz deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── ENROLLMENTS & ORDERS ───────────────────────────────────

exports.getAllEnrollments = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                e.*,
                u.full_name AS StudentName,
                u.email AS StudentEmail,
                u.phone AS StudentPhone,
                ISNULL(c.Title, oc.Title) AS CourseTitle
            FROM LMS_Enrollments e
            LEFT JOIN Users u ON e.UserID = u.id
            LEFT JOIN CareerCourses c ON e.CourseType = 'career' AND e.CourseID = c.Id
            LEFT JOIN OnlineCourses oc ON (e.CourseType = 'online' OR e.CourseType IS NULL) AND e.CourseID = oc.Id
            ORDER BY e.EnrolledAt DESC
        `);

        return res.status(200).json({ success: true, enrollments: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                o.*,
                u.full_name AS StudentName,
                u.email AS StudentEmail
            FROM LMS_Orders o
            LEFT JOIN Users u ON o.UserID = u.id
            ORDER BY o.CreatedAt DESC
        `);

        return res.status(200).json({ success: true, orders: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── COUPONS ────────────────────────────────────────────────

exports.getAllCoupons = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM LMS_Coupons ORDER BY CreatedAt DESC`);
        return res.status(200).json({ success: true, coupons: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const { code, discountPercent, maxDiscount = 2000, minCartAmount = 0, expiryDate = null, usageLimit = 1000 } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('code', sql.VarChar(50), code.trim().toUpperCase())
            .input('percent', sql.Int, discountPercent)
            .input('maxDisc', sql.Decimal(10, 2), maxDiscount)
            .input('minAmount', sql.Decimal(10, 2), minCartAmount)
            .input('expiry', sql.DateTime, expiryDate)
            .input('limit', sql.Int, usageLimit)
            .query(`
                INSERT INTO LMS_Coupons (Code, DiscountPercent, MaxDiscount, MinCartAmount, ExpiryDate, UsageLimit, IsActive, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@code, @percent, @maxDisc, @minAmount, @expiry, @limit, 1, GETDATE())
            `);

        return res.status(201).json({ success: true, coupon: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('couponId', sql.Int, couponId)
            .query(`DELETE FROM LMS_Coupons WHERE CouponID = @couponId`);

        return res.status(200).json({ success: true, message: "Coupon deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── REVIEWS MODERATION ─────────────────────────────────────

exports.getAllReviews = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                r.*,
                ISNULL(c.Title, oc.Title) AS CourseTitle
            FROM LMS_CourseReviews r
            LEFT JOIN CareerCourses c ON r.CourseType = 'career' AND r.CourseID = c.Id
            LEFT JOIN OnlineCourses oc ON (r.CourseType = 'online' OR r.CourseType IS NULL) AND r.CourseID = oc.Id
            ORDER BY r.CreatedAt DESC
        `);

        return res.status(200).json({ success: true, reviews: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.toggleReviewApproval = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('reviewId', sql.Int, reviewId)
            .query(`UPDATE LMS_CourseReviews SET IsApproved = ~IsApproved WHERE ReviewID = @reviewId`);

        return res.status(200).json({ success: true, message: "Review status toggled." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('reviewId', sql.Int, reviewId)
            .query(`DELETE FROM LMS_CourseReviews WHERE ReviewID = @reviewId`);

        return res.status(200).json({ success: true, message: "Review deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── ASSIGNMENTS MANAGEMENT & GRADING ───────────────────────

exports.getAllAssignments = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                a.*,
                (SELECT COUNT(*) FROM LMS_AssignmentSubmissions WHERE AssignmentID = a.AssignmentID) AS TotalSubmissions,
                (SELECT COUNT(*) FROM LMS_AssignmentSubmissions WHERE AssignmentID = a.AssignmentID AND Status = 'graded') AS GradedSubmissions
            FROM LMS_Assignments a
            ORDER BY a.CreatedAt DESC
        `);

        return res.status(200).json({ success: true, assignments: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        const { courseId = 1, courseType = 'online', title, description, starterCode, maxScore = 100 } = req.body;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('title', sql.NVarChar(255), title)
            .input('desc', sql.NVarChar(sql.MAX), description)
            .input('starter', sql.NVarChar(sql.MAX), starterCode || '')
            .input('maxScore', sql.Int, maxScore)
            .query(`
                INSERT INTO LMS_Assignments (CourseID, CourseType, Title, Description, StarterCode, MaxScore, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@courseId, @courseType, @title, @desc, @starter, @maxScore, GETDATE())
            `);

        return res.status(201).json({ success: true, assignment: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('assignId', sql.Int, assignmentId)
            .query(`DELETE FROM LMS_Assignments WHERE AssignmentID = @assignId`);

        return res.status(200).json({ success: true, message: "Assignment deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllSubmissions = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                s.*,
                a.Title AS AssignmentTitle,
                a.MaxScore
            FROM LMS_AssignmentSubmissions s
            JOIN LMS_Assignments a ON s.AssignmentID = a.AssignmentID
            ORDER BY s.SubmittedAt DESC
        `);

        return res.status(200).json({ success: true, submissions: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { score, feedback, status = 'graded' } = req.body;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('subId', sql.Int, submissionId)
            .input('score', sql.Int, score)
            .input('feedback', sql.NVarChar(sql.MAX), feedback)
            .input('status', sql.VarChar(50), status)
            .query(`
                UPDATE LMS_AssignmentSubmissions 
                SET Score = @score, MentorFeedback = @feedback, Status = @status, GradedAt = GETDATE()
                OUTPUT INSERTED.*
                WHERE SubmissionID = @subId
            `);

        const graded = result.recordset[0];
        if (graded) {
            // Send student notification
            await pool.request()
                .input('userId', sql.Int, graded.UserID)
                .input('title', sql.NVarChar(255), 'Assignment Graded! 📝')
                .input('msg', sql.NVarChar(sql.MAX), `Your project submission has been graded. Score: ${score}/100. Check feedback in classroom.`)
                .input('link', sql.NVarChar(500), '/learn/1')
                .query(`INSERT INTO LMS_Notifications (UserID, Title, Message, LinkURL, Type) VALUES (@userId, @title, @msg, @link, 'grade')`);
        }

        return res.status(200).json({ success: true, message: "Submission graded successfully!", submission: graded });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── LIVE CLASSES MANAGEMENT ────────────────────────────────

exports.getAllLiveClasses = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT * FROM LMS_LiveClasses ORDER BY ScheduledStartTime DESC
        `);

        return res.status(200).json({ success: true, liveClasses: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createLiveClass = async (req, res) => {
    try {
        const { courseId = 1, courseType = 'online', title, description, instructorName, scheduledStartTime, durationMinutes = 60, meetingUrl, status = 'upcoming' } = req.body;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('courseId', sql.Int, courseId)
            .input('courseType', sql.VarChar(50), courseType)
            .input('title', sql.NVarChar(255), title)
            .input('desc', sql.NVarChar(sql.MAX), description)
            .input('inst', sql.NVarChar(150), instructorName)
            .input('time', sql.DateTime, new Date(scheduledStartTime))
            .input('dur', sql.Int, durationMinutes)
            .input('meet', sql.NVarChar(500), meetingUrl)
            .input('status', sql.VarChar(50), status)
            .query(`
                INSERT INTO LMS_LiveClasses (CourseID, CourseType, Title, Description, InstructorName, ScheduledStartTime, DurationMinutes, MeetingURL, Status, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@courseId, @courseType, @title, @desc, @inst, @time, @dur, @meet, @status, GETDATE())
            `);

        // Global broadcast notification
        await pool.request()
            .input('title', sql.NVarChar(255), `Live Class Scheduled: ${title}`)
            .input('msg', sql.NVarChar(sql.MAX), `Join ${instructorName} for live interactive session on ${new Date(scheduledStartTime).toLocaleDateString()}.`)
            .input('link', sql.NVarChar(500), '/learn/1')
            .query(`INSERT INTO LMS_Notifications (UserID, Title, Message, LinkURL, Type) VALUES (0, @title, @msg, @link, 'live')`);

        return res.status(201).json({ success: true, liveClass: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateLiveClass = async (req, res) => {
    try {
        const { liveClassId } = req.params;
        const { status, recordingUrl } = req.body;
        const pool = await sql.connect(config);

        await pool.request()
            .input('id', sql.Int, liveClassId)
            .input('status', sql.VarChar(50), status)
            .input('rec', sql.NVarChar(500), recordingUrl)
            .query(`
                UPDATE LMS_LiveClasses 
                SET Status = ISNULL(@status, Status), RecordingURL = ISNULL(@rec, RecordingURL)
                WHERE LiveClassID = @id
            `);

        return res.status(200).json({ success: true, message: "Live class updated." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteLiveClass = async (req, res) => {
    try {
        const { liveClassId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, liveClassId)
            .query(`DELETE FROM LMS_LiveClasses WHERE LiveClassID = @id`);

        return res.status(200).json({ success: true, message: "Live class deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── JOB BOARD MANAGEMENT ───────────────────────────────────

exports.getAllJobs = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                j.*,
                (SELECT COUNT(*) FROM LMS_JobApplications WHERE JobID = j.JobID) AS TotalApplicants
            FROM LMS_Jobs j
            ORDER BY j.CreatedAt DESC
        `);

        return res.status(200).json({ success: true, jobs: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const { company, roleTitle, location, jobType = 'Full-Time', salaryPackage, experience, description, requirements } = req.body;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('comp', sql.NVarChar(150), company)
            .input('role', sql.NVarChar(200), roleTitle)
            .input('loc', sql.NVarChar(150), location)
            .input('type', sql.VarChar(50), jobType)
            .input('sal', sql.NVarChar(100), salaryPackage)
            .input('exp', sql.NVarChar(100), experience)
            .input('desc', sql.NVarChar(sql.MAX), description)
            .input('req', sql.NVarChar(sql.MAX), requirements)
            .query(`
                INSERT INTO LMS_Jobs (Company, RoleTitle, Location, JobType, SalaryPackage, Experience, Description, Requirements, IsActive, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (@comp, @role, @loc, @type, @sal, @exp, @desc, @req, 1, GETDATE())
            `);

        return res.status(201).json({ success: true, job: result.recordset[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, jobId)
            .query(`DELETE FROM LMS_Jobs WHERE JobID = @id`);

        return res.status(200).json({ success: true, message: "Job listing deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getJobApplicants = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                a.*,
                j.RoleTitle,
                j.Company
            FROM LMS_JobApplications a
            JOIN LMS_Jobs j ON a.JobID = j.JobID
            ORDER BY a.AppliedAt DESC
        `);

        return res.status(200).json({ success: true, applicants: result.recordset });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const pool = await sql.connect(config);

        await pool.request()
            .input('id', sql.Int, applicationId)
            .input('status', sql.VarChar(50), status)
            .query(`UPDATE LMS_JobApplications SET Status = @status WHERE ApplicationID = @id`);

        return res.status(200).json({ success: true, message: "Applicant status updated." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET ALL PLATFORM COURSES (All Tables & Sources) ─────────
exports.getAllPlatformCourses = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const courses = [];
        const seenKeys = new Set();

        const addCourseSafe = (course) => {
            if (!course || !course.id || !course.name) return;
            const key = `${course.type}-${course.id}`;
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                courses.push(course);
            }
        };

        // 1. Online Courses
        try {
            const ocRes = await pool.request().query(`
                SELECT 
                    c.Id, 
                    c.Title, 
                    'online' AS CourseType, 
                    COALESCE(cat.Name, 'Online Courses') AS CategoryName,
                    c.IsActive
                FROM OnlineCourses c
                LEFT JOIN OnlineCourseCategories cat ON c.CategoryId = cat.Id
                ORDER BY c.SortOrder ASC, c.Id DESC
            `);
            ocRes.recordset.forEach(r => {
                addCourseSafe({
                    id: r.Id,
                    name: r.Title,
                    type: 'online',
                    category: r.CategoryName,
                    source: 'Online Courses',
                    isActive: r.IsActive
                });
            });
        } catch (e) {
            console.warn("Could not query OnlineCourses:", e.message);
        }

        // 2. Career Courses
        try {
            const ccRes = await pool.request().query(`
                SELECT 
                    c.Id, 
                    c.Title, 
                    'career' AS CourseType, 
                    COALESCE(cat.Name, 'Career Programs') AS CategoryName,
                    c.IsActive
                FROM CareerCourses c
                LEFT JOIN CareerCategories cat ON c.CategoryId = cat.Id
                ORDER BY c.SortOrder ASC, c.Id DESC
            `);
            ccRes.recordset.forEach(r => {
                addCourseSafe({
                    id: r.Id,
                    name: r.Title,
                    type: 'career',
                    category: r.CategoryName,
                    source: 'Career Programs',
                    isActive: r.IsActive
                });
            });
        } catch (e) {
            console.warn("Could not query CareerCourses:", e.message);
        }

        // 3. Top Programs (Study Abroad)
        try {
            const tpRes = await pool.request().query(`
                SELECT 
                    p.Id, 
                    p.Title, 
                    'top-program' AS CourseType, 
                    COALESCE(c.Name, 'Study Abroad') AS CategoryName,
                    p.IsActive
                FROM TopPrograms p
                LEFT JOIN TopProgramCategories c ON p.CategoryId = c.Id
                ORDER BY p.Id DESC
            `);
            tpRes.recordset.forEach(r => {
                addCourseSafe({
                    id: r.Id,
                    name: r.Title,
                    type: 'top-program',
                    category: r.CategoryName,
                    source: 'Top Programs (Study Abroad)',
                    isActive: r.IsActive
                });
            });
        } catch (e) {
            console.warn("Could not query TopPrograms:", e.message);
        }

        // 4. Free Courses
        try {
            const fcRes = await pool.request().query(`
                SELECT 
                    Id, 
                    Title, 
                    'free' AS CourseType, 
                    'Free Learning' AS CategoryName,
                    IsActive
                FROM FreeCourses
                ORDER BY SortOrder ASC, Id DESC
            `);
            fcRes.recordset.forEach(r => {
                addCourseSafe({
                    id: r.Id,
                    name: r.Title,
                    type: 'free',
                    category: r.CategoryName,
                    source: 'Free Courses',
                    isActive: r.IsActive
                });
            });
        } catch (e) {
            console.warn("Could not query FreeCourses:", e.message);
        }

        // 5. Navbar Dropdown Items (Degrees & Certifications)
        try {
            const niRes = await pool.request().query(`
                SELECT 
                    i.Id, 
                    i.Title, 
                    'navbar' AS CourseType, 
                    COALESCE(g.Name, 'Navbar Programs') AS CategoryName,
                    i.IsActive
                FROM NavbarDropdownItems i
                LEFT JOIN NavbarDropdownGroups g ON i.GroupId = g.Id
                ORDER BY i.Id DESC
            `);
            niRes.recordset.forEach(r => {
                addCourseSafe({
                    id: r.Id,
                    name: r.Title,
                    type: 'navbar',
                    category: r.CategoryName,
                    source: 'Navbar Degree / Certifications',
                    isActive: r.IsActive
                });
            });
        } catch (e) {
            console.warn("Could not query NavbarDropdownItems:", e.message);
        }

        // 6. CourseDetails (Old Navbar Courses)
        try {
            const cdRes = await pool.request().query(`
                SELECT 
                    cd.Id, 
                    COALESCE(cd.HeroTitle, nl.Title) AS Title, 
                    'custom' AS CourseType, 
                    cd.Category AS CategoryName,
                    cd.IsActive
                FROM CourseDetails cd
                LEFT JOIN NavbarLinks nl ON cd.NavbarLinkId = nl.Id
            `);
            cdRes.recordset.forEach(r => {
                if (r.Title) {
                    addCourseSafe({
                        id: r.Id,
                        name: r.Title,
                        type: 'custom',
                        category: r.CategoryName || 'General Courses',
                        source: 'Course Details',
                        isActive: r.IsActive
                    });
                }
            });
        } catch (e) {
            console.warn("Could not query CourseDetails:", e.message);
        }

        // Fallback default courses if database happens to have no records yet
        if (courses.length === 0) {
            courses.push(
                { id: 1, name: "Executive AI-Native Software Engineering (IIT Kharagpur)", type: "online", category: "AI & ML", source: "Online Courses", isActive: 1 },
                { id: 2, name: "Full Stack Web & Cloud Architect", type: "online", category: "Web Development", source: "Online Courses", isActive: 1 },
                { id: 3, name: "Data Science & Machine Learning Masterclass", type: "online", category: "Data Science", source: "Online Courses", isActive: 1 }
            );
        }

        return res.status(200).json({ success: true, courses, count: courses.length });
    } catch (err) {
        console.error("getAllPlatformCourses Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

