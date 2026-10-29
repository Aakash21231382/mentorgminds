-- ✅ Create Counseling Bookings Table
-- Stores 1:1 counseling booking requests from users

CREATE TABLE CounselingBookings (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(150) NOT NULL,
    Email NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    PreferredDate DATE NULL,
    PreferredTime NVARCHAR(50) NULL,
    ProgramInterest NVARCHAR(200) NULL,
    Message NVARCHAR(1000) NULL,
    Status NVARCHAR(50) DEFAULT 'Pending', -- Pending, Contacted, Scheduled, Completed, Cancelled
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Create stored procedure to insert counseling booking
CREATE OR ALTER PROCEDURE sp_InsertCounselingBooking
    @Name NVARCHAR(150),
    @Email NVARCHAR(200),
    @Phone NVARCHAR(20),
    @PreferredDate DATE = NULL,
    @PreferredTime NVARCHAR(50) = NULL,
    @ProgramInterest NVARCHAR(200) = NULL,
    @Message NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO CounselingBookings (Name, Email, Phone, PreferredDate, PreferredTime, ProgramInterest, Message)
    VALUES (@Name, @Email, @Phone, @PreferredDate, @PreferredTime, @ProgramInterest, @Message);
    
    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- Get all counseling bookings (for admin)
CREATE OR ALTER PROCEDURE sp_GetAllCounselingBookings
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        Email,
        Phone,
        PreferredDate,
        PreferredTime,
        ProgramInterest,
        Message,
        Status,
        CreatedAt,
        UpdatedAt
    FROM CounselingBookings
    ORDER BY CreatedAt DESC;
END
GO

-- Update counseling booking status
CREATE OR ALTER PROCEDURE sp_UpdateCounselingBookingStatus
    @Id INT,
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CounselingBookings
    SET Status = @Status,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;
END
GO

PRINT '✅ Counseling bookings table and procedures created successfully!';
