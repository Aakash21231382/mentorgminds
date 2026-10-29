-- =============================================
-- Study Abroad Advisor Leads Table & Stored Procedures
-- =============================================

-- Drop existing procedures if they exist
IF OBJECT_ID('sp_DeleteStudyAbroadLead', 'P') IS NOT NULL
    DROP PROCEDURE sp_DeleteStudyAbroadLead;
GO

IF OBJECT_ID('sp_UpdateStudyAbroadLeadStatus', 'P') IS NOT NULL
    DROP PROCEDURE sp_UpdateStudyAbroadLeadStatus;
GO

IF OBJECT_ID('sp_GetAllStudyAbroadAdvisorLeads', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetAllStudyAbroadAdvisorLeads;
GO

IF OBJECT_ID('sp_InsertStudyAbroadAdvisor', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertStudyAbroadAdvisor;
GO

-- Drop table if exists
IF OBJECT_ID('StudyAbroadAdvisorLeads', 'U') IS NOT NULL
    DROP TABLE StudyAbroadAdvisorLeads;
GO

-- =============================================
-- Create Table: StudyAbroadAdvisorLeads
-- =============================================
CREATE TABLE StudyAbroadAdvisorLeads (
    Id INT PRIMARY KEY IDENTITY(1,1),
    -- Step 1
    StudyCountries NVARCHAR(200),
    Degree NVARCHAR(50),
    VisitCity NVARCHAR(100),
    -- Step 2
    BachelorsCompleted NVARCHAR(10),
    PreferredStream NVARCHAR(100),
    ExamStatus NVARCHAR(50),
    -- Step 3
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    CurrentStep INT DEFAULT 3,
    Status NVARCHAR(50) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- Stored Procedure: Insert Study Abroad Advisor Lead
-- =============================================
CREATE PROCEDURE sp_InsertStudyAbroadAdvisor
    @StudyCountries NVARCHAR(200) = NULL,
    @Degree NVARCHAR(50) = NULL,
    @VisitCity NVARCHAR(100) = NULL,
    @BachelorsCompleted NVARCHAR(10) = NULL,
    @PreferredStream NVARCHAR(100) = NULL,
    @ExamStatus NVARCHAR(50) = NULL,
    @FullName NVARCHAR(150),
    @Email NVARCHAR(200),
    @Phone NVARCHAR(20),
    @CurrentStep INT = 3
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO StudyAbroadAdvisorLeads (
        StudyCountries, Degree, VisitCity,
        BachelorsCompleted, PreferredStream, ExamStatus,
        FullName, Email, Phone, CurrentStep, 
        Status, CreatedAt, UpdatedAt
    )
    VALUES (
        @StudyCountries, @Degree, @VisitCity,
        @BachelorsCompleted, @PreferredStream, @ExamStatus,
        @FullName, @Email, @Phone, @CurrentStep,
        'Pending', GETDATE(), GETDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- =============================================
-- Stored Procedure: Get All Study Abroad Advisor Leads
-- =============================================
CREATE PROCEDURE sp_GetAllStudyAbroadAdvisorLeads
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        StudyCountries,
        Degree,
        VisitCity,
        BachelorsCompleted,
        PreferredStream,
        ExamStatus,
        FullName,
        Email,
        Phone,
        CurrentStep,
        Status,
        CreatedAt,
        UpdatedAt
    FROM StudyAbroadAdvisorLeads
    ORDER BY CreatedAt DESC;
END;
GO

-- =============================================
-- Stored Procedure: Update Lead Status
-- =============================================
CREATE PROCEDURE sp_UpdateStudyAbroadLeadStatus
    @Id INT,
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE StudyAbroadAdvisorLeads
    SET 
        Status = @Status,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;
END;
GO

-- =============================================
-- Stored Procedure: Delete Study Abroad Lead
-- =============================================
CREATE PROCEDURE sp_DeleteStudyAbroadLead
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM StudyAbroadAdvisorLeads
    WHERE Id = @Id;
END;
GO

-- =============================================
-- Insert Sample Data (Optional for testing)
-- =============================================
-- INSERT INTO StudyAbroadAdvisorLeads (FullName, Email, Phone, CurrentStep, Status)
-- VALUES 
-- ('John Doe', 'john.doe@example.com', '+91-9876543210', 1, 'Pending'),
-- ('Jane Smith', 'jane.smith@example.com', '+91-9876543211', 2, 'Contacted'),
-- ('Michael Brown', 'michael.brown@example.com', '+91-9876543212', 3, 'Completed');
-- GO

PRINT 'Study Abroad Advisor Leads table and stored procedures created successfully!';
GO
