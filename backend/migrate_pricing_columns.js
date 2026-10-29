const { sql, config } = require('./config/database');

async function runMigration() {
    try {
        console.log("Connecting to database...");
        const pool = await sql.connect(config);
        console.log("✅ Connected. Applying schema alterations for dynamic Course Pricing...");

        await pool.request().query(`
            -- 1. Check and add columns to CoursePageDetails
            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='Price')
            BEGIN
                ALTER TABLE CoursePageDetails ADD Price DECIMAL(10,2) NULL;
                PRINT 'Added Price column';
            END

            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='OriginalPrice')
            BEGIN
                ALTER TABLE CoursePageDetails ADD OriginalPrice DECIMAL(10,2) NULL;
                PRINT 'Added OriginalPrice column';
            END

            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='ScholarshipText')
            BEGIN
                ALTER TABLE CoursePageDetails ADD ScholarshipText VARCHAR(150) NULL;
                PRINT 'Added ScholarshipText column';
            END

            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='EmiOptionsText')
            BEGIN
                ALTER TABLE CoursePageDetails ADD EmiOptionsText VARCHAR(255) NULL;
                PRINT 'Added EmiOptionsText column';
            END

            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='ShowPricing')
            BEGIN
                ALTER TABLE CoursePageDetails ADD ShowPricing BIT DEFAULT 1;
                PRINT 'Added ShowPricing column';
            END
        `);

        // Alter sp_UpsertCourseDetail
        await pool.request().query(`
            CREATE OR ALTER PROCEDURE sp_UpsertCourseDetail
                @CareerCourseId INT,
                @Slug VARCHAR(200),
                @HeroBadge VARCHAR(100)=NULL,
                @University VARCHAR(150)=NULL,
                @HeroTitleNormal VARCHAR(300)=NULL,
                @HeroTitleOrange VARCHAR(300)=NULL,
                @HeroDescription NVARCHAR(MAX)=NULL,
                @HeroDuration VARCHAR(100)=NULL,
                @HeroMode VARCHAR(100)=NULL,
                @HeroStarts VARCHAR(100)=NULL,
                @HeroImage VARCHAR(MAX)=NULL,
                @HeroReviewText NVARCHAR(MAX)=NULL,
                @HeroReviewAuthor VARCHAR(150)=NULL,
                @HeroUrgencyText NVARCHAR(MAX)=NULL,
                @BrochureUrl VARCHAR(MAX)=NULL,
                @AlumniCompanies NVARCHAR(MAX)=NULL,
                @LegacyTitle VARCHAR(300)=NULL,
                @LegacySubtitle NVARCHAR(MAX)=NULL,
                @LegacyCards NVARCHAR(MAX)=NULL,
                @AiSectionTitle VARCHAR(300)=NULL,
                @AiSectionSubtext NVARCHAR(MAX)=NULL,
                @AiHighlights NVARCHAR(MAX)=NULL,
                @AiStat1Value VARCHAR(50)=NULL,
                @AiStat1Label VARCHAR(100)=NULL,
                @AiStat2Value VARCHAR(50)=NULL,
                @AiStat2Label VARCHAR(100)=NULL,
                @AiPromoTitle VARCHAR(200)=NULL,
                @AiPromoText NVARCHAR(MAX)=NULL,
                @QuickHighlights NVARCHAR(MAX)=NULL,
                @LearningJourneyTitle VARCHAR(300)=NULL,
                @LearningJourney NVARCHAR(MAX)=NULL,
                @Curriculum NVARCHAR(MAX)=NULL,
                @Tools NVARCHAR(MAX)=NULL,
                @RealWorldProjects NVARCHAR(MAX)=NULL,
                @CapstoneProjects NVARCHAR(MAX)=NULL,
                @Mentors NVARCHAR(MAX)=NULL,
                @CredentialTitle VARCHAR(300)=NULL,
                @CredentialSubtitle NVARCHAR(MAX)=NULL,
                @CredentialFeatures NVARCHAR(MAX)=NULL,
                @CertificateImage VARCHAR(MAX)=NULL,
                @CareerJourneySteps NVARCHAR(MAX)=NULL,
                @CareerStats NVARCHAR(MAX)=NULL,
                @SuccessStories NVARCHAR(MAX)=NULL,
                @LearningExperience NVARCHAR(MAX)=NULL,
                @ShowAlumni BIT=1,
                @ShowLegacy BIT=1,
                @ShowAiSection BIT=1,
                @ShowQuickHighlights BIT=1,
                @ShowLearningJourney BIT=1,
                @ShowCurriculum BIT=1,
                @ShowTools BIT=1,
                @ShowRealProjects BIT=1,
                @ShowCapstone BIT=1,
                @ShowMentors BIT=1,
                @ShowCredential BIT=1,
                @ShowCareerSupport BIT=1,
                @Price DECIMAL(10,2)=NULL,
                @OriginalPrice DECIMAL(10,2)=NULL,
                @ScholarshipText VARCHAR(150)=NULL,
                @EmiOptionsText VARCHAR(255)=NULL,
                @ShowPricing BIT=1,
                @IsActive BIT=1
            AS
            BEGIN
                SET NOCOUNT ON;
                IF EXISTS (SELECT 1 FROM CoursePageDetails WHERE CareerCourseId=@CareerCourseId)
                BEGIN
                    UPDATE CoursePageDetails SET
                        Slug=@Slug, HeroBadge=@HeroBadge, University=@University,
                        HeroTitleNormal=@HeroTitleNormal, HeroTitleOrange=@HeroTitleOrange,
                        HeroDescription=@HeroDescription, HeroDuration=@HeroDuration,
                        HeroMode=@HeroMode, HeroStarts=@HeroStarts,
                        HeroImage=ISNULL(@HeroImage,HeroImage),
                        HeroReviewText=@HeroReviewText, HeroReviewAuthor=@HeroReviewAuthor,
                        HeroUrgencyText=@HeroUrgencyText, BrochureUrl=ISNULL(@BrochureUrl,BrochureUrl),
                        AlumniCompanies=@AlumniCompanies, LegacyTitle=@LegacyTitle,
                        LegacySubtitle=@LegacySubtitle, LegacyCards=@LegacyCards,
                        AiSectionTitle=@AiSectionTitle, AiSectionSubtext=@AiSectionSubtext,
                        AiHighlights=@AiHighlights, AiStat1Value=@AiStat1Value, AiStat1Label=@AiStat1Label,
                        AiStat2Value=@AiStat2Value, AiStat2Label=@AiStat2Label,
                        AiPromoTitle=@AiPromoTitle, AiPromoText=@AiPromoText,
                        QuickHighlights=@QuickHighlights, LearningJourneyTitle=@LearningJourneyTitle,
                        LearningJourney=@LearningJourney, Curriculum=@Curriculum, Tools=@Tools,
                        RealWorldProjects=@RealWorldProjects, CapstoneProjects=@CapstoneProjects,
                        Mentors=@Mentors, CredentialTitle=@CredentialTitle,
                        CredentialSubtitle=@CredentialSubtitle, CredentialFeatures=@CredentialFeatures,
                        CertificateImage=ISNULL(@CertificateImage,CertificateImage),
                        CareerJourneySteps=@CareerJourneySteps, CareerStats=@CareerStats,
                        SuccessStories=@SuccessStories, LearningExperience=@LearningExperience,
                        ShowAlumni=@ShowAlumni, ShowLegacy=@ShowLegacy, ShowAiSection=@ShowAiSection,
                        ShowQuickHighlights=@ShowQuickHighlights, ShowLearningJourney=@ShowLearningJourney,
                        ShowCurriculum=@ShowCurriculum, ShowTools=@ShowTools, ShowRealProjects=@ShowRealProjects,
                        ShowCapstone=@ShowCapstone, ShowMentors=@ShowMentors, ShowCredential=@ShowCredential,
                        ShowCareerSupport=@ShowCareerSupport,
                        Price=@Price, OriginalPrice=@OriginalPrice, ScholarshipText=@ScholarshipText,
                        EmiOptionsText=@EmiOptionsText, ShowPricing=@ShowPricing,
                        IsActive=@IsActive, UpdatedAt=GETDATE()
                    WHERE CareerCourseId=@CareerCourseId;
                    SELECT 'updated' AS action;
                END
                ELSE
                BEGIN
                    INSERT INTO CoursePageDetails (
                        CareerCourseId,Slug,HeroBadge,University,HeroTitleNormal,HeroTitleOrange,
                        HeroDescription,HeroDuration,HeroMode,HeroStarts,HeroImage,
                        HeroReviewText,HeroReviewAuthor,HeroUrgencyText,BrochureUrl,
                        AlumniCompanies,LegacyTitle,LegacySubtitle,LegacyCards,
                        AiSectionTitle,AiSectionSubtext,AiHighlights,
                        AiStat1Value,AiStat1Label,AiStat2Value,AiStat2Label,AiPromoTitle,AiPromoText,
                        QuickHighlights,LearningJourneyTitle,LearningJourney,Curriculum,Tools,
                        RealWorldProjects,CapstoneProjects,Mentors,
                        CredentialTitle,CredentialSubtitle,CredentialFeatures,CertificateImage,
                        CareerJourneySteps,CareerStats,SuccessStories,LearningExperience,
                        ShowAlumni,ShowLegacy,ShowAiSection,ShowQuickHighlights,ShowLearningJourney,
                        ShowCurriculum,ShowTools,ShowRealProjects,ShowCapstone,ShowMentors,
                        ShowCredential,ShowCareerSupport,Price,OriginalPrice,ScholarshipText,
                        EmiOptionsText,ShowPricing,IsActive
                    ) VALUES (
                        @CareerCourseId,@Slug,@HeroBadge,@University,@HeroTitleNormal,@HeroTitleOrange,
                        @HeroDescription,@HeroDuration,@HeroMode,@HeroStarts,@HeroImage,
                        @HeroReviewText,@HeroReviewAuthor,@HeroUrgencyText,@BrochureUrl,
                        @AlumniCompanies,@LegacyTitle,@LegacySubtitle,@LegacyCards,
                        @AiSectionTitle,@AiSectionSubtext,@AiHighlights,
                        @AiStat1Value,@AiStat1Label,@AiStat2Value,@AiStat2Label,@AiPromoTitle,@AiPromoText,
                        @QuickHighlights,@LearningJourneyTitle,@LearningJourney,@Curriculum,@Tools,
                        @RealWorldProjects,@CapstoneProjects,@Mentors,
                        @CredentialTitle,@CredentialSubtitle,@CredentialFeatures,@CertificateImage,
                        @CareerJourneySteps,@CareerStats,@SuccessStories,@LearningExperience,
                        @ShowAlumni,@ShowLegacy,@ShowAiSection,@ShowQuickHighlights,@ShowLearningJourney,
                        @ShowCurriculum,@ShowTools,@ShowRealProjects,@ShowCapstone,@ShowMentors,
                        @ShowCredential,@ShowCareerSupport,@Price,@OriginalPrice,@ScholarshipText,
                        @EmiOptionsText,@ShowPricing,@IsActive
                    );
                    SELECT 'inserted' AS action;
                END
            END
        `);

        // Alter sp_UpsertOnlineCourseDetail
        await pool.request().query(`
            CREATE OR ALTER PROCEDURE sp_UpsertOnlineCourseDetail
                @OnlineCourseId INT,
                @Slug VARCHAR(200),
                @HeroBadge VARCHAR(100)=NULL,
                @University VARCHAR(150)=NULL,
                @HeroTitleNormal VARCHAR(300)=NULL,
                @HeroTitleOrange VARCHAR(300)=NULL,
                @HeroDescription NVARCHAR(MAX)=NULL,
                @HeroDuration VARCHAR(100)=NULL,
                @HeroMode VARCHAR(100)=NULL,
                @HeroStarts VARCHAR(100)=NULL,
                @HeroImage VARCHAR(MAX)=NULL,
                @HeroReviewText NVARCHAR(MAX)=NULL,
                @HeroReviewAuthor VARCHAR(150)=NULL,
                @HeroUrgencyText NVARCHAR(MAX)=NULL,
                @BrochureUrl VARCHAR(MAX)=NULL,
                @AlumniCompanies NVARCHAR(MAX)=NULL,
                @LegacyTitle VARCHAR(300)=NULL,
                @LegacySubtitle NVARCHAR(MAX)=NULL,
                @LegacyCards NVARCHAR(MAX)=NULL,
                @AiSectionTitle VARCHAR(300)=NULL,
                @AiSectionSubtext NVARCHAR(MAX)=NULL,
                @AiHighlights NVARCHAR(MAX)=NULL,
                @AiStat1Value VARCHAR(50)=NULL,
                @AiStat1Label VARCHAR(100)=NULL,
                @AiStat2Value VARCHAR(50)=NULL,
                @AiStat2Label VARCHAR(100)=NULL,
                @AiPromoTitle VARCHAR(200)=NULL,
                @AiPromoText NVARCHAR(MAX)=NULL,
                @QuickHighlights NVARCHAR(MAX)=NULL,
                @LearningJourneyTitle VARCHAR(300)=NULL,
                @LearningJourney NVARCHAR(MAX)=NULL,
                @Curriculum NVARCHAR(MAX)=NULL,
                @Tools NVARCHAR(MAX)=NULL,
                @RealWorldProjects NVARCHAR(MAX)=NULL,
                @CapstoneProjects NVARCHAR(MAX)=NULL,
                @Mentors NVARCHAR(MAX)=NULL,
                @CredentialTitle VARCHAR(300)=NULL,
                @CredentialSubtitle NVARCHAR(MAX)=NULL,
                @CredentialFeatures NVARCHAR(MAX)=NULL,
                @CertificateImage VARCHAR(MAX)=NULL,
                @CareerJourneySteps NVARCHAR(MAX)=NULL,
                @CareerStats NVARCHAR(MAX)=NULL,
                @SuccessStories NVARCHAR(MAX)=NULL,
                @LearningExperience NVARCHAR(MAX)=NULL,
                @ShowAlumni BIT=1,
                @ShowLegacy BIT=1,
                @ShowAiSection BIT=1,
                @ShowQuickHighlights BIT=1,
                @ShowLearningJourney BIT=1,
                @ShowCurriculum BIT=1,
                @ShowTools BIT=1,
                @ShowRealProjects BIT=1,
                @ShowCapstone BIT=1,
                @ShowMentors BIT=1,
                @ShowCredential BIT=1,
                @ShowCareerSupport BIT=1,
                @Price DECIMAL(10,2)=NULL,
                @OriginalPrice DECIMAL(10,2)=NULL,
                @ScholarshipText VARCHAR(150)=NULL,
                @EmiOptionsText VARCHAR(255)=NULL,
                @ShowPricing BIT=1,
                @IsActive BIT=1
            AS
            BEGIN
                SET NOCOUNT ON;
                IF EXISTS (SELECT 1 FROM CoursePageDetails WHERE OnlineCourseId=@OnlineCourseId)
                BEGIN
                    UPDATE CoursePageDetails SET
                        Slug=@Slug, HeroBadge=@HeroBadge, University=@University,
                        HeroTitleNormal=@HeroTitleNormal, HeroTitleOrange=@HeroTitleOrange,
                        HeroDescription=@HeroDescription, HeroDuration=@HeroDuration,
                        HeroMode=@HeroMode, HeroStarts=@HeroStarts,
                        HeroImage=ISNULL(@HeroImage,HeroImage),
                        HeroReviewText=@HeroReviewText, HeroReviewAuthor=@HeroReviewAuthor,
                        HeroUrgencyText=@HeroUrgencyText, BrochureUrl=ISNULL(@BrochureUrl,BrochureUrl),
                        AlumniCompanies=@AlumniCompanies, LegacyTitle=@LegacyTitle,
                        LegacySubtitle=@LegacySubtitle, LegacyCards=@LegacyCards,
                        AiSectionTitle=@AiSectionTitle, AiSectionSubtext=@AiSectionSubtext,
                        AiHighlights=@AiHighlights, AiStat1Value=@AiStat1Value, AiStat1Label=@AiStat1Label,
                        AiStat2Value=@AiStat2Value, AiStat2Label=@AiStat2Label,
                        AiPromoTitle=@AiPromoTitle, AiPromoText=@AiPromoText,
                        QuickHighlights=@QuickHighlights, LearningJourneyTitle=@LearningJourneyTitle,
                        LearningJourney=@LearningJourney, Curriculum=@Curriculum, Tools=@Tools,
                        RealWorldProjects=@RealWorldProjects, CapstoneProjects=@CapstoneProjects,
                        Mentors=@Mentors, CredentialTitle=@CredentialTitle,
                        CredentialSubtitle=@CredentialSubtitle, CredentialFeatures=@CredentialFeatures,
                        CertificateImage=ISNULL(@CertificateImage,CertificateImage),
                        CareerJourneySteps=@CareerJourneySteps, CareerStats=@CareerStats,
                        SuccessStories=@SuccessStories, LearningExperience=@LearningExperience,
                        ShowAlumni=@ShowAlumni, ShowLegacy=@ShowLegacy, ShowAiSection=@ShowAiSection,
                        ShowQuickHighlights=@ShowQuickHighlights, ShowLearningJourney=@ShowLearningJourney,
                        ShowCurriculum=@ShowCurriculum, ShowTools=@ShowTools, ShowRealProjects=@ShowRealProjects,
                        ShowCapstone=@ShowCapstone, ShowMentors=@ShowMentors, ShowCredential=@ShowCredential,
                        ShowCareerSupport=@ShowCareerSupport,
                        Price=@Price, OriginalPrice=@OriginalPrice, ScholarshipText=@ScholarshipText,
                        EmiOptionsText=@EmiOptionsText, ShowPricing=@ShowPricing,
                        IsActive=@IsActive, UpdatedAt=GETDATE()
                    WHERE OnlineCourseId=@OnlineCourseId;
                    SELECT 'updated' AS action;
                END
                ELSE
                BEGIN
                    INSERT INTO CoursePageDetails (
                        OnlineCourseId,Slug,HeroBadge,University,HeroTitleNormal,HeroTitleOrange,
                        HeroDescription,HeroDuration,HeroMode,HeroStarts,HeroImage,
                        HeroReviewText,HeroReviewAuthor,HeroUrgencyText,BrochureUrl,
                        AlumniCompanies,LegacyTitle,LegacySubtitle,LegacyCards,
                        AiSectionTitle,AiSectionSubtext,AiHighlights,
                        AiStat1Value,AiStat1Label,AiStat2Value,AiStat2Label,AiPromoTitle,AiPromoText,
                        QuickHighlights,LearningJourneyTitle,LearningJourney,Curriculum,Tools,
                        RealWorldProjects,CapstoneProjects,Mentors,
                        CredentialTitle,CredentialSubtitle,CredentialFeatures,CertificateImage,
                        CareerJourneySteps,CareerStats,SuccessStories,LearningExperience,
                        ShowAlumni,ShowLegacy,ShowAiSection,ShowQuickHighlights,ShowLearningJourney,
                        ShowCurriculum,ShowTools,ShowRealProjects,ShowCapstone,ShowMentors,
                        ShowCredential,ShowCareerSupport,Price,OriginalPrice,ScholarshipText,
                        EmiOptionsText,ShowPricing,IsActive
                    ) VALUES (
                        @OnlineCourseId,@Slug,@HeroBadge,@University,@HeroTitleNormal,@HeroTitleOrange,
                        @HeroDescription,@HeroDuration,@HeroMode,@HeroStarts,@HeroImage,
                        @HeroReviewText,@HeroReviewAuthor,@HeroUrgencyText,@BrochureUrl,
                        @AlumniCompanies,@LegacyTitle,@LegacySubtitle,@LegacyCards,
                        @AiSectionTitle,@AiSectionSubtext,@AiHighlights,
                        @AiStat1Value,@AiStat1Label,@AiStat2Value,@AiStat2Label,@AiPromoTitle,@AiPromoText,
                        @QuickHighlights,@LearningJourneyTitle,@LearningJourney,@Curriculum,@Tools,
                        @RealWorldProjects,@CapstoneProjects,@Mentors,
                        @CredentialTitle,@CredentialSubtitle,@CredentialFeatures,@CertificateImage,
                        @CareerJourneySteps,@CareerStats,@SuccessStories,@LearningExperience,
                        @ShowAlumni,@ShowLegacy,@ShowAiSection,@ShowQuickHighlights,@ShowLearningJourney,
                        @ShowCurriculum,@ShowTools,@ShowRealProjects,@ShowCapstone,@ShowMentors,
                        @ShowCredential,@ShowCareerSupport,@Price,@OriginalPrice,@ScholarshipText,
                        @EmiOptionsText,@ShowPricing,@IsActive
                    );
                    SELECT 'inserted' AS action;
                END
            END
        `);

        console.log("🎉 Migration completed successfully! CoursePageDetails table and procedures now support dynamic Price, OriginalPrice, ScholarshipText, EmiOptionsText, ShowPricing.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

runMigration();
