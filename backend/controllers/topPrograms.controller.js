const { sql, config } = require("../config/database");

// Get all programs (admin)
const getAllPrograms = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("sp_GetAllTopPrograms");

    res.status(200).json({
      success: true,
      programs: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching top programs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

// Get programs by category slug (frontend)
const getProgramsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("CategorySlug", sql.NVarChar(150), categorySlug)
      .execute("sp_GetTopProgramsByCategory");

    res.status(200).json({
      success: true,
      programs: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching programs by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

// Get program by slug with details (frontend)
const getProgramBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Slug", sql.NVarChar(200), slug)
      .execute("sp_GetTopProgramBySlug");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({
      success: true,
      program: result.recordset[0],
    });
  } catch (error) {
    console.error("Error fetching program by slug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch program",
      error: error.message,
    });
  }
};

// Add or update program
const upsertProgram = async (req, res) => {
  try {
    const {
      id,
      categoryId,
      country,
      countryFlag,
      university, // frontend sends "university"
      universityLogo,
      title,
      description,
      slug,
      isPopular,
      isFeatured,
      brochureUrl,
      displayOrder,
      isActive,
    } = req.body;

    console.log('Upsert Program Request:', { id, categoryId, country, university, title, slug });

    if (!categoryId || !country || !university || !title || !slug) {
      return res.status(400).json({
        success: false,
        message: "Required fields: categoryId, country, university, title, slug",
      });
    }

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Id", sql.Int, id || null)
      .input("CategoryId", sql.Int, parseInt(categoryId))
      .input("Country", sql.NVarChar(100), country)
      .input("CountryFlag", sql.NVarChar(10), countryFlag || null)
      .input("UniversityName", sql.NVarChar(200), university) // Map university to UniversityName
      .input("UniversityLogo", sql.NVarChar(sql.MAX), universityLogo || null)
      .input("Title", sql.NVarChar(300), title)
      .input("Description", sql.NVarChar(1000), description || null)
      .input("Slug", sql.NVarChar(200), slug)
      .input("IsPopular", sql.Bit, isPopular ? 1 : 0)
      .input("IsFeatured", sql.Bit, isFeatured ? 1 : 0)
      .input("BrochureUrl", sql.NVarChar(sql.MAX), brochureUrl || null)
      .input("DisplayOrder", sql.Int, parseInt(displayOrder) || 0)
      .input("IsActive", sql.Bit, isActive !== undefined ? (isActive ? 1 : 0) : 1)
      .execute("sp_UpsertTopProgram");

    console.log('Program Upsert Result:', result.recordset);

    res.status(200).json({
      success: true,
      message: id ? "Program updated successfully" : "Program added successfully",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Error upserting program:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save program",
      error: error.message,
    });
  }
};

// Delete program
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    await pool
      .request()
      .input("Id", sql.Int, id)
      .execute("sp_DeleteTopProgram");

    res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete program",
      error: error.message,
    });
  }
};

// Get program details by ID (admin)
const getProgramDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("ProgramId", sql.Int, id)
      .execute("sp_GetTopProgramDetails");

    res.status(200).json({
      success: true,
      details: result.recordset.length > 0 ? result.recordset[0] : null,
    });
  } catch (error) {
    console.error("Error fetching program details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch program details",
      error: error.message,
    });
  }
};

// Upsert program details (detailed page content)
const upsertProgramDetails = async (req, res) => {
  try {
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: "Program ID is required",
      });
    }

    // Stringify JSON fields
    const stringify = (v) => (v && typeof v === "object" ? JSON.stringify(v) : v || null);

    const pool = await sql.connect(config);
    await pool
      .request()
      .input("ProgramId", sql.Int, programId)
      .input("Slug", sql.NVarChar(200), req.body.slug || null)
      .input("HeroBadge", sql.NVarChar(50), req.body.heroBadge || null)
      .input("University", sql.NVarChar(200), req.body.university || null)
      .input("HeroTitleNormal", sql.NVarChar(300), req.body.heroTitleNormal || null)
      .input("HeroTitleOrange", sql.NVarChar(300), req.body.heroTitleOrange || null)
      .input("HeroDescription", sql.NVarChar(sql.MAX), req.body.heroDescription || null)
      .input("HeroDuration", sql.NVarChar(100), req.body.heroDuration || null)
      .input("HeroMode", sql.NVarChar(100), req.body.heroMode || null)
      .input("HeroStarts", sql.NVarChar(100), req.body.heroStarts || null)
      .input("HeroImage", sql.NVarChar(sql.MAX), req.body.heroImage || null)
      .input("HeroReviewText", sql.NVarChar(sql.MAX), req.body.heroReviewText || null)
      .input("HeroReviewAuthor", sql.NVarChar(200), req.body.heroReviewAuthor || null)
      .input("HeroUrgencyText", sql.NVarChar(500), req.body.heroUrgencyText || null)
      .input("BrochureUrl", sql.NVarChar(sql.MAX), req.body.brochureUrl || null)
      .input("AlumniCompanies", sql.NVarChar(sql.MAX), stringify(req.body.alumniCompanies))
      .input("LegacyTitle", sql.NVarChar(200), req.body.legacyTitle || null)
      .input("LegacySubtitle", sql.NVarChar(sql.MAX), req.body.legacySubtitle || null)
      .input("LegacyCards", sql.NVarChar(sql.MAX), stringify(req.body.legacyCards))
      .input("AiSectionTitle", sql.NVarChar(200), req.body.aiSectionTitle || null)
      .input("AiSectionSubtext", sql.NVarChar(sql.MAX), req.body.aiSectionSubtext || null)
      .input("AiHighlights", sql.NVarChar(sql.MAX), stringify(req.body.aiHighlights))
      .input("AiStat1Value", sql.NVarChar(50), req.body.aiStat1Value || null)
      .input("AiStat1Label", sql.NVarChar(100), req.body.aiStat1Label || null)
      .input("AiStat2Value", sql.NVarChar(50), req.body.aiStat2Value || null)
      .input("AiStat2Label", sql.NVarChar(100), req.body.aiStat2Label || null)
      .input("AiPromoTitle", sql.NVarChar(200), req.body.aiPromoTitle || null)
      .input("AiPromoText", sql.NVarChar(sql.MAX), req.body.aiPromoText || null)
      .input("QuickHighlights", sql.NVarChar(sql.MAX), stringify(req.body.quickHighlights))
      .input("LearningJourneyTitle", sql.NVarChar(200), req.body.learningJourneyTitle || null)
      .input("LearningJourney", sql.NVarChar(sql.MAX), stringify(req.body.learningJourney))
      .input("Curriculum", sql.NVarChar(sql.MAX), stringify(req.body.curriculum))
      .input("Tools", sql.NVarChar(sql.MAX), stringify(req.body.tools))
      .input("RealWorldProjects", sql.NVarChar(sql.MAX), stringify(req.body.realWorldProjects))
      .input("CapstoneProjects", sql.NVarChar(sql.MAX), stringify(req.body.capstoneProjects))
      .input("Mentors", sql.NVarChar(sql.MAX), stringify(req.body.mentors))
      .input("CredentialTitle", sql.NVarChar(200), req.body.credentialTitle || null)
      .input("CredentialSubtitle", sql.NVarChar(sql.MAX), req.body.credentialSubtitle || null)
      .input("CredentialFeatures", sql.NVarChar(sql.MAX), stringify(req.body.credentialFeatures))
      .input("CertificateImage", sql.NVarChar(sql.MAX), req.body.certificateImage || null)
      .input("CareerJourneySteps", sql.NVarChar(sql.MAX), stringify(req.body.careerJourneySteps))
      .input("CareerStats", sql.NVarChar(sql.MAX), stringify(req.body.careerStats))
      .input("SuccessStories", sql.NVarChar(sql.MAX), stringify(req.body.successStories))
      .input("LearningExperience", sql.NVarChar(sql.MAX), stringify(req.body.learningExperience))
      .input("ShowAlumni", sql.Bit, req.body.showAlumni ? 1 : 0)
      .input("ShowLegacy", sql.Bit, req.body.showLegacy ? 1 : 0)
      .input("ShowAiSection", sql.Bit, req.body.showAiSection ? 1 : 0)
      .input("ShowQuickHighlights", sql.Bit, req.body.showQuickHighlights ? 1 : 0)
      .input("ShowLearningJourney", sql.Bit, req.body.showLearningJourney ? 1 : 0)
      .input("ShowCurriculum", sql.Bit, req.body.showCurriculum ? 1 : 0)
      .input("ShowTools", sql.Bit, req.body.showTools ? 1 : 0)
      .input("ShowRealProjects", sql.Bit, req.body.showRealProjects ? 1 : 0)
      .input("ShowCapstone", sql.Bit, req.body.showCapstone ? 1 : 0)
      .input("ShowMentors", sql.Bit, req.body.showMentors ? 1 : 0)
      .input("ShowCredential", sql.Bit, req.body.showCredential ? 1 : 0)
      .input("ShowCareerSupport", sql.Bit, req.body.showCareerSupport ? 1 : 0)
      .input("IsActive", sql.Bit, req.body.isActive ? 1 : 0)
      .execute("sp_UpsertTopProgramDetails");

    res.status(200).json({
      success: true,
      message: "Program details saved successfully",
    });
  } catch (error) {
    console.error("Error upserting program details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save program details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPrograms,
  getProgramsByCategory,
  getProgramBySlug,
  getProgramDetails,
  upsertProgram,
  deleteProgram,
  upsertProgramDetails,
};
