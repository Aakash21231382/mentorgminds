-- ============================================================================
-- 🎓 MENTORING MINDS - COMPLETE LMS DATABASE SCHEMA & STORED PROCEDURES
-- Database: MSSQL Server
-- Description: Full-Fledged Learning Management System (LMS)
-- Tables: Modules, Lessons, Enrollments, Progress, Quizzes, Questions, Attempts,
--         Certificates, Notes, Doubts, Reviews, Orders, Coupons
-- ============================================================================

-- 1. LMS_Modules Table (Sections inside a Course)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Modules')
BEGIN
    CREATE TABLE LMS_Modules (
        ModuleID INT IDENTITY(1,1) PRIMARY KEY,
        CourseID INT NOT NULL,                     -- Foreign Key reference to Courses/Career/OnlineCourse
        CourseType VARCHAR(50) DEFAULT 'online',   -- 'career', 'online', 'top-program', 'custom'
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        OrderIndex INT DEFAULT 1,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_LMS_Modules_Course ON LMS_Modules(CourseID, CourseType);
    PRINT '✅ Table LMS_Modules created successfully.';
END
GO

-- 2. LMS_Lessons Table (Lectures / Content inside a Module)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Lessons')
BEGIN
    CREATE TABLE LMS_Lessons (
        LessonID INT IDENTITY(1,1) PRIMARY KEY,
        ModuleID INT NOT NULL,
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        VideoURL NVARCHAR(500) NULL,               -- YouTube embed / MP4 / HLS link
        DurationMinutes INT DEFAULT 10,            -- e.g. 15 mins
        ResourceFile NVARCHAR(500) NULL,           -- PDF / ZIP link or filename
        ResourceTitle NVARCHAR(255) NULL,          -- e.g. "Lecture 1 Cheat Sheet.pdf"
        OrderIndex INT DEFAULT 1,
        IsFreePreview BIT DEFAULT 0,               -- 1 = anyone can watch without enrolling
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_LMS_Lessons_Modules FOREIGN KEY (ModuleID) REFERENCES LMS_Modules(ModuleID) ON DELETE CASCADE
    );
    CREATE INDEX IX_LMS_Lessons_Module ON LMS_Lessons(ModuleID);
    PRINT '✅ Table LMS_Lessons created successfully.';
END
GO

-- 3. LMS_Enrollments Table (User Course Subscriptions)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Enrollments')
BEGIN
    CREATE TABLE LMS_Enrollments (
        EnrollmentID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,                       -- Refers to Users table
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        EnrolledAt DATETIME DEFAULT GETDATE(),
        Status VARCHAR(30) DEFAULT 'active',       -- 'active', 'completed', 'expired', 'revoked'
        ProgressPercent DECIMAL(5,2) DEFAULT 0.00, -- 0.00 to 100.00 %
        CompletedLessons INT DEFAULT 0,
        TotalLessons INT DEFAULT 0,
        CompletedAt DATETIME NULL,
        LastAccessedAt DATETIME DEFAULT GETDATE(),
        LastLessonID INT NULL                      -- For "Resume Learning"
    );
    CREATE UNIQUE INDEX UX_LMS_User_Course ON LMS_Enrollments(UserID, CourseID, CourseType);
    PRINT '✅ Table LMS_Enrollments created successfully.';
END
GO

-- 4. LMS_LessonProgress Table (Per-Lesson Completion Tracking)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_LessonProgress')
BEGIN
    CREATE TABLE LMS_LessonProgress (
        ProgressID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        LessonID INT NOT NULL,
        IsCompleted BIT DEFAULT 0,
        WatchedSeconds INT DEFAULT 0,
        TotalDurationSeconds INT DEFAULT 0,
        CompletedAt DATETIME NULL,
        LastWatchedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_LMS_Progress_Lessons FOREIGN KEY (LessonID) REFERENCES LMS_Lessons(LessonID) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX UX_LMS_User_Lesson ON LMS_LessonProgress(UserID, LessonID);
    PRINT '✅ Table LMS_LessonProgress created successfully.';
END
GO

-- 5. LMS_Quizzes Table (Assessments)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Quizzes')
BEGIN
    CREATE TABLE LMS_Quizzes (
        QuizID INT IDENTITY(1,1) PRIMARY KEY,
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        ModuleID INT NULL,                         -- Optional: Link quiz to specific module
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        PassingPercentage INT DEFAULT 70,          -- e.g. 70% required to pass
        TimeLimitMinutes INT DEFAULT 15,           -- 15 mins
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_Quizzes created successfully.';
END
GO

-- 6. LMS_QuizQuestions Table (MCQ Questions)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_QuizQuestions')
BEGIN
    CREATE TABLE LMS_QuizQuestions (
        QuestionID INT IDENTITY(1,1) PRIMARY KEY,
        QuizID INT NOT NULL,
        QuestionText NVARCHAR(MAX) NOT NULL,
        OptionA NVARCHAR(500) NOT NULL,
        OptionB NVARCHAR(500) NOT NULL,
        OptionC NVARCHAR(500) NOT NULL,
        OptionD NVARCHAR(500) NOT NULL,
        CorrectOption CHAR(1) NOT NULL,            -- 'A', 'B', 'C', 'D'
        Explanation NVARCHAR(MAX) NULL,
        Marks INT DEFAULT 1,
        OrderIndex INT DEFAULT 1,
        CONSTRAINT FK_LMS_Questions_Quizzes FOREIGN KEY (QuizID) REFERENCES LMS_Quizzes(QuizID) ON DELETE CASCADE
    );
    PRINT '✅ Table LMS_QuizQuestions created successfully.';
END
GO

-- 7. LMS_QuizAttempts Table (Student Quiz Submissions)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_QuizAttempts')
BEGIN
    CREATE TABLE LMS_QuizAttempts (
        AttemptID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        QuizID INT NOT NULL,
        TotalQuestions INT DEFAULT 0,
        CorrectAnswers INT DEFAULT 0,
        ScorePercentage DECIMAL(5,2) DEFAULT 0.00,
        IsPassed BIT DEFAULT 0,
        AttemptedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_LMS_Attempts_Quizzes FOREIGN KEY (QuizID) REFERENCES LMS_Quizzes(QuizID) ON DELETE CASCADE
    );
    PRINT '✅ Table LMS_QuizAttempts created successfully.';
END
GO

-- 8. LMS_Certificates Table (Automated Certificates)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Certificates')
BEGIN
    CREATE TABLE LMS_Certificates (
        CertificateID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        CourseTitle NVARCHAR(255) NOT NULL,
        StudentName NVARCHAR(255) NOT NULL,
        CertificateNumber VARCHAR(50) NOT NULL UNIQUE, -- e.g. "MM-2026-REACT-8492"
        IssueDate DATETIME DEFAULT GETDATE(),
        VerificationCode VARCHAR(100) NOT NULL,
        QrCodeURL NVARCHAR(500) NULL,
        PdfURL NVARCHAR(500) NULL,
        IsActive BIT DEFAULT 1
    );
    CREATE INDEX IX_LMS_Certificates_Number ON LMS_Certificates(CertificateNumber);
    PRINT '✅ Table LMS_Certificates created successfully.';
END
GO

-- 9. LMS_CourseNotes Table (Timestamped Notes during Video Playback)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_CourseNotes')
BEGIN
    CREATE TABLE LMS_CourseNotes (
        NoteID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        LessonID INT NOT NULL,
        VideoTimestamp INT DEFAULT 0,              -- Seconds e.g. 125s (02:05)
        Content NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_LMS_Notes_Lessons FOREIGN KEY (LessonID) REFERENCES LMS_Lessons(LessonID) ON DELETE CASCADE
    );
    PRINT '✅ Table LMS_CourseNotes created successfully.';
END
GO

-- 10. LMS_LessonDoubts Table (Q&A Discussion Board)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_LessonDoubts')
BEGIN
    CREATE TABLE LMS_LessonDoubts (
        DoubtID INT IDENTITY(1,1) PRIMARY KEY,
        LessonID INT NOT NULL,
        UserID INT NOT NULL,
        UserName NVARCHAR(150) NOT NULL,
        Question NVARCHAR(MAX) NOT NULL,
        ParentDoubtID INT NULL,                    -- NULL for main doubt, ID for reply
        IsInstructorReply BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_LMS_Doubts_Lessons FOREIGN KEY (LessonID) REFERENCES LMS_Lessons(LessonID) ON DELETE CASCADE
    );
    PRINT '✅ Table LMS_LessonDoubts created successfully.';
END
GO

-- 11. LMS_CourseReviews Table (Student Star Ratings & Reviews)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_CourseReviews')
BEGIN
    CREATE TABLE LMS_CourseReviews (
        ReviewID INT IDENTITY(1,1) PRIMARY KEY,
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        UserID INT NOT NULL,
        UserName NVARCHAR(150) NOT NULL,
        Rating INT CHECK (Rating >= 1 AND Rating <= 5) NOT NULL,
        ReviewText NVARCHAR(MAX) NOT NULL,
        IsApproved BIT DEFAULT 1,                  -- Auto-approved or moderation
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_LMS_CourseReviews ON LMS_CourseReviews(CourseID, CourseType);
    PRINT '✅ Table LMS_CourseReviews created successfully.';
END
GO

-- 12. LMS_Coupons Table (Discount Codes)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Coupons')
BEGIN
    CREATE TABLE LMS_Coupons (
        CouponID INT IDENTITY(1,1) PRIMARY KEY,
        Code VARCHAR(50) NOT NULL UNIQUE,          -- e.g. "WELCOME50"
        DiscountPercent INT NOT NULL,              -- e.g. 20 (20% off)
        MaxDiscount DECIMAL(10,2) DEFAULT 2000.00,
        MinCartAmount DECIMAL(10,2) DEFAULT 0.00,
        ExpiryDate DATETIME NULL,
        UsageLimit INT DEFAULT 1000,
        UsedCount INT DEFAULT 0,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_Coupons created successfully.';
END
GO

-- 13. LMS_Orders Table (Course Payments & Transactions)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Orders')
BEGIN
    CREATE TABLE LMS_Orders (
        OrderID INT IDENTITY(1,1) PRIMARY KEY,
        OrderNumber VARCHAR(50) NOT NULL UNIQUE,   -- e.g. "ORD-20260831-9821"
        UserID INT NOT NULL,
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        CourseTitle NVARCHAR(255) NOT NULL,
        OriginalPrice DECIMAL(10,2) NOT NULL,
        DiscountAmount DECIMAL(10,2) DEFAULT 0.00,
        FinalPrice DECIMAL(10,2) NOT NULL,
        CouponCode VARCHAR(50) NULL,
        PaymentMethod VARCHAR(50) DEFAULT 'online', -- 'card', 'upi', 'netbanking', 'free'
        PaymentStatus VARCHAR(30) DEFAULT 'success',-- 'pending', 'success', 'failed'
        TransactionID VARCHAR(100) NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_Orders created successfully.';
END
GO


-- ============================================================================
-- 📦 STORED PROCEDURES
-- ============================================================================

-- Stored Procedure: sp_LMS_GetCourseCurriculum
-- Fetches modules, lessons and individual completion progress for a given user
IF OBJECT_ID('sp_LMS_GetCourseCurriculum', 'P') IS NOT NULL
    DROP PROCEDURE sp_LMS_GetCourseCurriculum;
GO

CREATE PROCEDURE sp_LMS_GetCourseCurriculum
    @CourseID INT,
    @CourseType VARCHAR(50) = 'online',
    @UserID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Fetch Modules
    SELECT 
        m.ModuleID,
        m.CourseID,
        m.CourseType,
        m.Title AS ModuleTitle,
        m.Description AS ModuleDescription,
        m.OrderIndex AS ModuleOrder,
        (SELECT COUNT(*) FROM LMS_Lessons l WHERE l.ModuleID = m.ModuleID AND l.IsActive = 1) AS TotalLessons
    FROM LMS_Modules m
    WHERE m.CourseID = @CourseID AND m.CourseType = @CourseType AND m.IsActive = 1
    ORDER BY m.OrderIndex ASC;

    -- 2. Fetch Lessons with User Progress
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
    LEFT JOIN LMS_LessonProgress p ON l.LessonID = p.LessonID AND (@UserID IS NULL OR p.UserID = @UserID)
    WHERE m.CourseID = @CourseID AND m.CourseType = @CourseType AND l.IsActive = 1
    ORDER BY m.OrderIndex ASC, l.OrderIndex ASC;

    -- 3. Fetch Course Quizzes
    SELECT 
        q.QuizID,
        q.CourseID,
        q.ModuleID,
        q.Title AS QuizTitle,
        q.Description AS QuizDescription,
        q.PassingPercentage,
        q.TimeLimitMinutes,
        (SELECT COUNT(*) FROM LMS_QuizQuestions qq WHERE qq.QuizID = q.QuizID) AS TotalQuestions,
        (SELECT TOP 1 IsPassed FROM LMS_QuizAttempts a WHERE a.QuizID = q.QuizID AND a.UserID = @UserID ORDER BY a.ScorePercentage DESC) AS HighestPassed
    FROM LMS_Quizzes q
    WHERE q.CourseID = @CourseID AND q.CourseType = @CourseType AND q.IsActive = 1;
END
GO
PRINT '✅ Stored Procedure sp_LMS_GetCourseCurriculum created.';
GO

-- Stored Procedure: sp_LMS_UpdateLessonProgress
IF OBJECT_ID('sp_LMS_UpdateLessonProgress', 'P') IS NOT NULL
    DROP PROCEDURE sp_LMS_UpdateLessonProgress;
GO

CREATE PROCEDURE sp_LMS_UpdateLessonProgress
    @UserID INT,
    @LessonID INT,
    @WatchedSeconds INT,
    @IsCompleted BIT,
    @CourseID INT,
    @CourseType VARCHAR(50) = 'online'
AS
BEGIN
    SET NOCOUNT ON;

    -- Upsert lesson progress
    IF EXISTS (SELECT 1 FROM LMS_LessonProgress WHERE UserID = @UserID AND LessonID = @LessonID)
    BEGIN
        UPDATE LMS_LessonProgress
        SET WatchedSeconds = @WatchedSeconds,
            IsCompleted = CASE WHEN @IsCompleted = 1 THEN 1 ELSE IsCompleted END,
            CompletedAt = CASE WHEN @IsCompleted = 1 AND CompletedAt IS NULL THEN GETDATE() ELSE CompletedAt END,
            LastWatchedAt = GETDATE()
        WHERE UserID = @UserID AND LessonID = @LessonID;
    END
    ELSE
    BEGIN
        INSERT INTO LMS_LessonProgress (UserID, LessonID, WatchedSeconds, IsCompleted, CompletedAt, LastWatchedAt)
        VALUES (@UserID, @LessonID, @WatchedSeconds, @IsCompleted, CASE WHEN @IsCompleted = 1 THEN GETDATE() ELSE NULL END, GETDATE());
    END

    -- Calculate total lessons and completed lessons for the course
    DECLARE @TotalLessons INT = 0;
    DECLARE @CompletedLessons INT = 0;
    DECLARE @ProgressPct DECIMAL(5,2) = 0.00;

    SELECT @TotalLessons = COUNT(l.LessonID)
    FROM LMS_Lessons l
    INNER JOIN LMS_Modules m ON l.ModuleID = m.ModuleID
    WHERE m.CourseID = @CourseID AND m.CourseType = @CourseType AND l.IsActive = 1;

    SELECT @CompletedLessons = COUNT(DISTINCT p.LessonID)
    FROM LMS_LessonProgress p
    INNER JOIN LMS_Lessons l ON p.LessonID = l.LessonID
    INNER JOIN LMS_Modules m ON l.ModuleID = m.ModuleID
    WHERE p.UserID = @UserID 
      AND p.IsCompleted = 1 
      AND m.CourseID = @CourseID 
      AND m.CourseType = @CourseType;

    IF @TotalLessons > 0
    BEGIN
        SET @ProgressPct = CAST((@CompletedLessons * 100.0) / @TotalLessons AS DECIMAL(5,2));
    END

    -- Update Enrollment Record
    UPDATE LMS_Enrollments
    SET ProgressPercent = @ProgressPct,
        CompletedLessons = @CompletedLessons,
        TotalLessons = @TotalLessons,
        LastAccessedAt = GETDATE(),
        LastLessonID = @LessonID,
        Status = CASE WHEN @ProgressPct >= 100.00 THEN 'completed' ELSE 'active' END,
        CompletedAt = CASE WHEN @ProgressPct >= 100.00 AND CompletedAt IS NULL THEN GETDATE() ELSE CompletedAt END
    WHERE UserID = @UserID AND CourseID = @CourseID AND CourseType = @CourseType;

    SELECT 
        @ProgressPct AS ProgressPercent, 
        @CompletedLessons AS CompletedLessons, 
        @TotalLessons AS TotalLessons,
        CASE WHEN @ProgressPct >= 100.00 THEN 1 ELSE 0 END AS IsCourseCompleted;
END
GO
PRINT '✅ Stored Procedure sp_LMS_UpdateLessonProgress created.';
GO


-- ============================================================================
-- 🌟 SEED DATA (SAMPLE READY-TO-USE LMS DATA)
-- ============================================================================

-- 1. Sample Coupons
IF NOT EXISTS (SELECT 1 FROM LMS_Coupons WHERE Code = 'WELCOME50')
BEGIN
    INSERT INTO LMS_Coupons (Code, DiscountPercent, MaxDiscount, MinCartAmount, ExpiryDate, UsageLimit, IsActive)
    VALUES 
    ('WELCOME50', 50, 5000, 0, DATEADD(YEAR, 1, GETDATE()), 1000, 1),
    ('LEARN2026', 20, 2000, 500, DATEADD(YEAR, 1, GETDATE()), 500, 1),
    ('FLAT10', 10, 1000, 0, DATEADD(YEAR, 1, GETDATE()), 5000, 1);
    PRINT '✅ Sample LMS_Coupons inserted.';
END
GO

-- 2. Sample Modules & Lessons for CourseID = 1
IF NOT EXISTS (SELECT 1 FROM LMS_Modules WHERE CourseID = 1 AND CourseType = 'online')
BEGIN
    -- Module 1
    INSERT INTO LMS_Modules (CourseID, CourseType, Title, Description, OrderIndex)
    VALUES (1, 'online', 'Module 1: Foundations & Architecture Setup', 'Core principles, modern development toolchains, and environment configuration.', 1);
    
    DECLARE @Mod1ID INT = SCOPE_IDENTITY();

    INSERT INTO LMS_Lessons (ModuleID, Title, Description, VideoURL, DurationMinutes, ResourceTitle, OrderIndex, IsFreePreview)
    VALUES 
    (@Mod1ID, '1.1 Welcome to the Program & Roadmap Overview', 'Introduction to the course goals, project blueprints, and community guidelines.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 12, 'Course_Syllabus_2026.pdf', 1, 1),
    (@Mod1ID, '1.2 Architecture Deep Dive & Development Environment', 'Setting up IDE, Node runtime, package managers, and production linters.', 'https://www.youtube.com/embed/ysz5S6PUM-U', 18, 'Setup_Guide_CheatSheet.pdf', 2, 1),
    (@Mod1ID, '1.3 Fundamentals Walkthrough & Core Concepts', 'Deep dive into state management, component lifecycle, and rendering pipelines.', 'https://www.youtube.com/embed/jNQXAC9IVRw', 25, 'Architecture_Diagrams.pdf', 3, 0);

    -- Module 2
    INSERT INTO LMS_Modules (CourseID, CourseType, Title, Description, OrderIndex)
    VALUES (1, 'online', 'Module 2: Advanced Engineering & Real-World Building', 'Hands-on project development, API integrations, and security practices.', 2);
    
    DECLARE @Mod2ID INT = SCOPE_IDENTITY();

    INSERT INTO LMS_Lessons (ModuleID, Title, Description, VideoURL, DurationMinutes, ResourceTitle, OrderIndex, IsFreePreview)
    VALUES 
    (@Mod2ID, '2.1 Asynchronous Data Flow & RESTful APIs', 'Mastering data fetching, optimistic updates, caching, and error resilience.', 'https://www.youtube.com/embed/kJQP7kiw5Fk', 22, 'REST_API_BestPractices.pdf', 1, 0),
    (@Mod2ID, '2.2 Building Scalable Components & Design Systems', 'Creating modular, accessible, and high-performance UI systems.', 'https://www.youtube.com/embed/L_LUpnjgPso', 30, 'Design_Tokens_Template.zip', 2, 0),
    (@Mod2ID, '2.3 Production Optimization, Testing & CI/CD Deployment', 'Lighthouse optimization, unit testing, Dockerizing, and Cloud deployment.', 'https://www.youtube.com/embed/9bZkp7q19f0', 28, 'CICD_Pipeline_Config.yaml', 3, 0);

    -- Quiz for Module 1 & 2
    INSERT INTO LMS_Quizzes (CourseID, CourseType, ModuleID, Title, Description, PassingPercentage, TimeLimitMinutes)
    VALUES (1, 'online', @Mod1ID, 'Module 1 & 2 Assessment Quiz', 'Test your understanding of core concepts, architecture, and best practices.', 70, 15);

    DECLARE @QuizID INT = SCOPE_IDENTITY();

    INSERT INTO LMS_QuizQuestions (QuizID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Explanation, Marks, OrderIndex)
    VALUES 
    (@QuizID, 'Which HTTP method should be used for idempotent partial resource updates?', 'POST', 'PUT', 'PATCH', 'GET', 'C', 'PATCH is specifically designed for partial updates to a resource.', 1, 1),
    (@QuizID, 'What is the primary benefit of using JWT for authentication?', 'It encrypts the entire database', 'It allows stateless user authentication across services', 'It replaces HTTPS requirements', 'It stores passwords securely', 'B', 'JWT is stateless and self-contained, allowing servers to verify identity without database lookups per request.', 1, 2),
    (@QuizID, 'In web performance, what does LCP stand for in Core Web Vitals?', 'Lowest Content Processing', 'Largest Contentful Paint', 'Layout Cumulative Process', 'Linear Code Parser', 'B', 'Largest Contentful Paint measures perceived load speed by timing when the main content renders.', 1, 3),
    (@QuizID, 'Which SQL constraint ensures that all values in a column are distinct?', 'NOT NULL', 'CHECK', 'UNIQUE', 'DEFAULT', 'C', 'The UNIQUE constraint ensures all values in a column are different.', 1, 4),
    (@QuizID, 'What is the purpose of CORS in web development?', 'To compress images automatically', 'To allow or restrict resources requested from another domain', 'To speed up DNS lookups', 'To encrypt server memory', 'B', 'Cross-Origin Resource Sharing controls cross-origin HTTP requests for web security.', 1, 5);

    -- Sample Reviews
    INSERT INTO LMS_CourseReviews (CourseID, CourseType, UserID, UserName, Rating, ReviewText, IsApproved)
    VALUES 
    (1, 'online', 1, 'Rahul Sharma', 5, 'Exceptional quality course! The practical project walk-through helped me clear my senior developer interview.', 1),
    (1, 'online', 2, 'Priya Patel', 5, 'The curriculum is super clear, structured, and modern. Mentors are very responsive to doubts.', 1),
    (1, 'online', 3, 'Aman Verma', 4, 'Very well explained practical concepts. Recommended for anyone looking to upskill.', 1);

    PRINT '✅ Sample LMS Modules, Lessons, Quiz, and Reviews inserted for CourseID = 1.';
END
GO

-- ============================================================================
-- 14. LMS_Assignments Table (Project Homework & Problem Statements)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Assignments')
BEGIN
    CREATE TABLE LMS_Assignments (
        AssignmentID INT IDENTITY(1,1) PRIMARY KEY,
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        ModuleID INT NULL,
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        StarterCode NVARCHAR(MAX) NULL,
        MaxScore INT DEFAULT 100,
        DueDate DATETIME NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_Assignments created successfully.';
END
GO

-- ============================================================================
-- 15. LMS_AssignmentSubmissions Table (Student Project Submissions & Grading)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_AssignmentSubmissions')
BEGIN
    CREATE TABLE LMS_AssignmentSubmissions (
        SubmissionID INT IDENTITY(1,1) PRIMARY KEY,
        AssignmentID INT NOT NULL,
        UserID INT NOT NULL,
        StudentName NVARCHAR(150) NOT NULL,
        StudentEmail NVARCHAR(200) NOT NULL,
        GithubURL NVARCHAR(500) NULL,
        LiveDemoURL NVARCHAR(500) NULL,
        SubmissionNotes NVARCHAR(MAX) NULL,
        Score INT NULL,                             -- Graded score 0-100
        Status VARCHAR(50) DEFAULT 'submitted',     -- 'submitted', 'graded', 'resubmit'
        MentorFeedback NVARCHAR(MAX) NULL,
        SubmittedAt DATETIME DEFAULT GETDATE(),
        GradedAt DATETIME NULL,
        CONSTRAINT FK_LMS_Submissions_Assignments FOREIGN KEY (AssignmentID) REFERENCES LMS_Assignments(AssignmentID) ON DELETE CASCADE
    );
    PRINT '✅ Table LMS_AssignmentSubmissions created successfully.';
END
GO

-- ============================================================================
-- 16. LMS_LiveClasses Table (Live Masterclasses, Webinars, 1-on-1 Mentorship)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_LiveClasses')
BEGIN
    CREATE TABLE LMS_LiveClasses (
        LiveClassID INT IDENTITY(1,1) PRIMARY KEY,
        CourseID INT NOT NULL,
        CourseType VARCHAR(50) DEFAULT 'online',
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        InstructorName NVARCHAR(150) NOT NULL,
        ScheduledStartTime DATETIME NOT NULL,
        DurationMinutes INT DEFAULT 60,
        MeetingURL NVARCHAR(500) NOT NULL,         -- Zoom, Google Meet, YouTube Live link
        MeetingPassword VARCHAR(100) NULL,
        Status VARCHAR(50) DEFAULT 'upcoming',     -- 'upcoming', 'live', 'completed'
        RecordingURL NVARCHAR(500) NULL,           -- Video recording link after session ends
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_LiveClasses created successfully.';
END
GO

-- ============================================================================
-- 17. LMS_UserXP & Leaderboard Table (Gamification, Streaks, XP)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_UserXP')
BEGIN
    CREATE TABLE LMS_UserXP (
        XpID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL UNIQUE,
        UserName NVARCHAR(150) NOT NULL,
        UserAvatar NVARCHAR(500) NULL,
        TotalXP INT DEFAULT 0,
        DailyStreak INT DEFAULT 1,
        LastActiveDate DATE DEFAULT CAST(GETDATE() AS DATE),
        TierBadge VARCHAR(50) DEFAULT 'Bronze',     -- 'Bronze', 'Silver', 'Gold', 'Diamond'
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_UserXP created successfully.';
END
GO

-- ============================================================================
-- 18. LMS_Notifications Table (Real-Time In-App Alerts)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Notifications')
BEGIN
    CREATE TABLE LMS_Notifications (
        NotificationID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,                        -- 0 for global broadcast, or specific UserID
        Title NVARCHAR(255) NOT NULL,
        Message NVARCHAR(MAX) NOT NULL,
        LinkURL NVARCHAR(500) NULL,
        Type VARCHAR(50) DEFAULT 'info',           -- 'info', 'live', 'grade', 'success'
        IsRead BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_Notifications created successfully.';
END
GO

-- ============================================================================
-- 19. LMS_Jobs Table (Placement & Hiring Partner Opportunities)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_Jobs')
BEGIN
    CREATE TABLE LMS_Jobs (
        JobID INT IDENTITY(1,1) PRIMARY KEY,
        Company NVARCHAR(150) NOT NULL,
        CompanyLogo NVARCHAR(500) NULL,
        RoleTitle NVARCHAR(200) NOT NULL,
        Location NVARCHAR(150) NOT NULL,
        JobType VARCHAR(50) DEFAULT 'Full-Time',   -- 'Full-Time', 'Remote', 'Internship'
        SalaryPackage NVARCHAR(100) NULL,          -- e.g. "₹8 - ₹14 LPA"
        Experience NVARCHAR(100) NULL,             -- e.g. "0-2 Years"
        Description NVARCHAR(MAX) NOT NULL,
        Requirements NVARCHAR(MAX) NULL,
        ApplyDeadline DATETIME NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Table LMS_Jobs created successfully.';
END
GO

-- ============================================================================
-- 20. LMS_JobApplications Table (Student Job Applications)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LMS_JobApplications')
BEGIN
    CREATE TABLE LMS_JobApplications (
        ApplicationID INT IDENTITY(1,1) PRIMARY KEY,
        JobID INT NOT NULL,
        UserID INT NOT NULL,
        ApplicantName NVARCHAR(150) NOT NULL,
        ApplicantEmail NVARCHAR(200) NOT NULL,
        ApplicantPhone VARCHAR(50) NULL,
        ResumeURL NVARCHAR(500) NULL,
        CertificateNumber VARCHAR(100) NULL,       -- Link verified Mentoring Minds Certificate
        Status VARCHAR(50) DEFAULT 'applied',      -- 'applied', 'shortlisted', 'rejected'
        AppliedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_LMS_JobApps_Jobs FOREIGN KEY (JobID) REFERENCES LMS_Jobs(JobID) ON DELETE CASCADE
    );
    PRINT '✅ Table LMS_JobApplications created successfully.';
END
GO

-- ============================================================================
-- SEED ENTERPRISE LMS DATA
-- ============================================================================
IF NOT EXISTS (SELECT * FROM LMS_Assignments WHERE CourseID = 1)
BEGIN
    INSERT INTO LMS_Assignments (CourseID, CourseType, Title, Description, StarterCode, MaxScore)
    VALUES 
    (1, 'online', 'Capstone Project: Event-Driven Order Processing Microservice', 'Build a production-ready REST API with JWT Auth, Docker containerization, and rate-limiting middleware. Submit your GitHub Repository and live deployment URL.', '// Starter Node/Express Template\nconst express = require("express");\nconst app = express();\n\napp.use(express.json());\n// Implement order routes here\n\napp.listen(5000, () => console.log("Server running on port 5000"));', 100);

    -- Sample Live Class
    INSERT INTO LMS_LiveClasses (CourseID, CourseType, Title, Description, InstructorName, ScheduledStartTime, DurationMinutes, MeetingURL, Status)
    VALUES 
    (1, 'online', N'🔥 Weekend Live Cohort: Microservices Scaling & Architecture Review', N'Interactive Q&A session with industry staff architects. Live system design teardown and performance debugging.', N'Dr. Vivek Sengupta (IIT Kharagpur)', DATEADD(DAY, 2, GETDATE()), 90, 'https://meet.google.com/abc-defg-hij', 'upcoming'),
    (1, 'online', N'Live Masterclass: Concurrency in Node.js & Distributed Caching', N'Deep dive into event loop internals, worker threads, and Redis pub/sub architectures.', N'Pooja Narang (Senior Architect)', DATEADD(DAY, -3, GETDATE()), 75, 'https://meet.google.com/xyz-uvwx-rst', 'completed');

    -- Sample Leaderboard XP
    INSERT INTO LMS_UserXP (UserID, UserName, TotalXP, DailyStreak, TierBadge)
    VALUES 
    (1, N'Rahul Sharma', 1450, 7, 'Gold'),
    (2, N'Priya Patel', 1280, 5, 'Silver'),
    (3, N'Aman Verma', 920, 3, 'Bronze'),
    (4, N'Sneha Joshi', 850, 4, 'Bronze'),
    (5, N'Vikram Malhotra', 650, 2, 'Bronze');

    -- Sample Tech Jobs
    INSERT INTO LMS_Jobs (Company, RoleTitle, Location, JobType, SalaryPackage, Experience, Description, Requirements)
    VALUES 
    (N'TechCorp Global', N'Associate Software Engineer - Full Stack', N'Bengaluru / Remote', 'Full-Time', N'₹8 - ₹12 LPA', '0-2 Years', N'Looking for passionate developers skilled in Node.js, React, and cloud architectures to build high-scale SaaS products.', N'Knowledge of React, Node.js, REST APIs, Git, and Problem Solving. Mentoring Minds Verified Certificate preferred.'),
    (N'InnoWave AI Systems', N'Backend Microservices Developer', N'Hyderabad / Hybrid', 'Full-Time', N'₹10 - ₹16 LPA', '1-3 Years', N'Join our core platform engineering team working on scalable distributed microservices with Redis and PostgreSQL.', N'Hands-on experience in Express/Fastify, SQL databases, Docker, and Kafka.'),
    (N'CloudScale FinTech', N'Frontend UI/UX Engineer', N'Pune / Remote', 'Full-Time', N'₹7 - ₹11 LPA', '0-2 Years', N'Create stunning, lightning-fast financial dashboards and design system components in React and TypeScript.', N'Proficiency in React, modern CSS, Web performance, and state management.');

    -- Sample Global Notification
    INSERT INTO LMS_Notifications (UserID, Title, Message, LinkURL, Type)
    VALUES 
    (0, N'Weekend Masterclass Scheduled! 🔴', N'Join Dr. Vivek Sengupta this Saturday for Microservices Scaling live session.', '/learn/1', 'live'),
    (0, N'New Capstone Project Published 🚀', N'Module 2 Capstone Assignment is now live. Complete and submit for mentor review!', '/learn/1', 'info');

    PRINT '✅ Enterprise seed data for Assignments, Live Classes, Leaderboard, Notifications, and Jobs inserted successfully.';
END
GO

PRINT '🎉 ============================================================================';
PRINT '🎉 ALL LMS TABLES, PROCEDURES, AND ENTERPRISE EXTENSIONS COMPLETED SUCCESSFULLY!';
PRINT '🎉 ============================================================================';
