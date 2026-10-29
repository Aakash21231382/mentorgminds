const { sql, config } = require('../config/database');

const safeJson = (val) => {
    if (!val) return null;
    if (typeof val === 'object') return JSON.stringify(val);
    return val;
};

// ── Public: Get by slug ───────────────────────────────────────
const getOnlineCourseDetailBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Slug', sql.VarChar(200), slug)
            .execute('sp_GetOnlineCourseDetailBySlug');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Course detail not found' });

        const row = result.recordset[0];
        const jsonFields = [
            'AlumniCompanies','LegacyCards','AiHighlights','QuickHighlights',
            'LearningJourney','Curriculum','Tools','RealWorldProjects',
            'CapstoneProjects','Mentors','CredentialFeatures',
            'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience'
        ];
        jsonFields.forEach(f => {
            try { row[f] = row[f] ? JSON.parse(row[f]) : []; } catch { row[f] = []; }
        });

        res.status(200).json({ success: true, detail: row });
    } catch (err) {
        console.error('OC Detail By Slug Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get by OnlineCourseId ──────────────────────────────
const getOnlineCourseDetailById = async (req, res) => {
    try {
        const { onlineCourseId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('OnlineCourseId', sql.Int, onlineCourseId)
            .execute('sp_GetOnlineCourseDetailById');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Not found', exists: false });

        res.status(200).json({ success: true, detail: result.recordset[0], exists: true });
    } catch (err) {
        console.error('OC Detail By Id Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get all ────────────────────────────────────────────
const getAllOnlineCourseDetails = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAllOnlineCourseDetails');
        res.status(200).json({ success: true, details: result.recordset });
    } catch (err) {
        console.error('OC Get All Details Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Upsert ─────────────────────────────────────────────
const upsertOnlineCourseDetail = async (req, res) => {
    try {
        const b = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('OnlineCourseId',      sql.Int,              b.onlineCourseId)
            .input('Slug',                sql.VarChar(200),     b.slug)
            .input('HeroBadge',           sql.VarChar(100),     b.heroBadge           || null)
            .input('University',          sql.VarChar(150),     b.university          || null)
            .input('HeroTitleNormal',     sql.VarChar(300),     b.heroTitleNormal     || null)
            .input('HeroTitleOrange',     sql.VarChar(300),     b.heroTitleOrange     || null)
            .input('HeroDescription',     sql.NVarChar(sql.MAX),b.heroDescription     || null)
            .input('HeroDuration',        sql.VarChar(100),     b.heroDuration        || null)
            .input('HeroMode',            sql.VarChar(100),     b.heroMode            || null)
            .input('HeroStarts',          sql.VarChar(100),     b.heroStarts          || null)
            .input('HeroImage',           sql.VarChar(sql.MAX), b.heroImage           || null)
            .input('HeroReviewText',      sql.NVarChar(sql.MAX),b.heroReviewText      || null)
            .input('HeroReviewAuthor',    sql.VarChar(150),     b.heroReviewAuthor    || null)
            .input('HeroUrgencyText',     sql.NVarChar(sql.MAX),b.heroUrgencyText     || null)
            .input('BrochureUrl',         sql.VarChar(sql.MAX), b.brochureUrl         || null)
            .input('AlumniCompanies',     sql.NVarChar(sql.MAX),safeJson(b.alumniCompanies))
            .input('LegacyTitle',         sql.VarChar(300),     b.legacyTitle         || null)
            .input('LegacySubtitle',      sql.NVarChar(sql.MAX),b.legacySubtitle      || null)
            .input('LegacyCards',         sql.NVarChar(sql.MAX),safeJson(b.legacyCards))
            .input('AiSectionTitle',      sql.VarChar(300),     b.aiSectionTitle      || null)
            .input('AiSectionSubtext',    sql.NVarChar(sql.MAX),b.aiSectionSubtext    || null)
            .input('AiHighlights',        sql.NVarChar(sql.MAX),safeJson(b.aiHighlights))
            .input('AiStat1Value',        sql.VarChar(50),      b.aiStat1Value        || null)
            .input('AiStat1Label',        sql.VarChar(100),     b.aiStat1Label        || null)
            .input('AiStat2Value',        sql.VarChar(50),      b.aiStat2Value        || null)
            .input('AiStat2Label',        sql.VarChar(100),     b.aiStat2Label        || null)
            .input('AiPromoTitle',        sql.VarChar(200),     b.aiPromoTitle        || null)
            .input('AiPromoText',         sql.NVarChar(sql.MAX),b.aiPromoText         || null)
            .input('QuickHighlights',     sql.NVarChar(sql.MAX),safeJson(b.quickHighlights))
            .input('LearningJourneyTitle',sql.VarChar(300),     b.learningJourneyTitle|| null)
            .input('LearningJourney',     sql.NVarChar(sql.MAX),safeJson(b.learningJourney))
            .input('Curriculum',          sql.NVarChar(sql.MAX),safeJson(b.curriculum))
            .input('Tools',               sql.NVarChar(sql.MAX),safeJson(b.tools))
            .input('RealWorldProjects',   sql.NVarChar(sql.MAX),safeJson(b.realWorldProjects))
            .input('CapstoneProjects',    sql.NVarChar(sql.MAX),safeJson(b.capstoneProjects))
            .input('Mentors',             sql.NVarChar(sql.MAX),safeJson(b.mentors))
            .input('CredentialTitle',     sql.VarChar(300),     b.credentialTitle     || null)
            .input('CredentialSubtitle',  sql.NVarChar(sql.MAX),b.credentialSubtitle  || null)
            .input('CredentialFeatures',  sql.NVarChar(sql.MAX),safeJson(b.credentialFeatures))
            .input('CertificateImage',    sql.VarChar(sql.MAX), b.certificateImage    || null)
            .input('CareerJourneySteps',  sql.NVarChar(sql.MAX),safeJson(b.careerJourneySteps))
            .input('CareerStats',         sql.NVarChar(sql.MAX),safeJson(b.careerStats))
            .input('SuccessStories',      sql.NVarChar(sql.MAX),safeJson(b.successStories))
            .input('LearningExperience',  sql.NVarChar(sql.MAX),safeJson(b.learningExperience))
            .input('ShowAlumni',          sql.Bit,              b.showAlumni          !== false ? 1 : 0)
            .input('ShowLegacy',          sql.Bit,              b.showLegacy          !== false ? 1 : 0)
            .input('ShowAiSection',       sql.Bit,              b.showAiSection       !== false ? 1 : 0)
            .input('ShowQuickHighlights', sql.Bit,              b.showQuickHighlights !== false ? 1 : 0)
            .input('ShowLearningJourney', sql.Bit,              b.showLearningJourney !== false ? 1 : 0)
            .input('ShowCurriculum',      sql.Bit,              b.showCurriculum      !== false ? 1 : 0)
            .input('ShowTools',           sql.Bit,              b.showTools           !== false ? 1 : 0)
            .input('ShowRealProjects',    sql.Bit,              b.showRealProjects    !== false ? 1 : 0)
            .input('ShowCapstone',        sql.Bit,              b.showCapstone        !== false ? 1 : 0)
            .input('ShowMentors',         sql.Bit,              b.showMentors         !== false ? 1 : 0)
            .input('ShowCredential',      sql.Bit,              b.showCredential      !== false ? 1 : 0)
            .input('ShowCareerSupport',   sql.Bit,              b.showCareerSupport   !== false ? 1 : 0)
            .input('Price',               sql.Decimal(10, 2),   b.price ? parseFloat(b.price) : null)
            .input('OriginalPrice',       sql.Decimal(10, 2),   b.originalPrice ? parseFloat(b.originalPrice) : null)
            .input('ScholarshipText',     sql.VarChar(150),     b.scholarshipText     || null)
            .input('EmiOptionsText',      sql.VarChar(255),     b.emiOptionsText      || null)
            .input('ShowPricing',         sql.Bit,              b.showPricing         !== false ? 1 : 0)
            .input('IsActive',            sql.Bit,              b.isActive            !== false ? 1 : 0)
            .execute('sp_UpsertOnlineCourseDetail');

        const action = result.recordset[0]?.action;
        res.status(action === 'inserted' ? 201 : 200).json({
            success: true,
            message: action === 'inserted' ? 'Course detail created' : 'Course detail updated'
        });
    } catch (err) {
        console.error('OC Upsert Detail Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── Admin: Delete ─────────────────────────────────────────────
const deleteOnlineCourseDetail = async (req, res) => {
    try {
        const { onlineCourseId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('OnlineCourseId', sql.Int, onlineCourseId)
            .execute('sp_DeleteOnlineCourseDetail');
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) {
        console.error('OC Delete Detail Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getOnlineCourseDetailBySlug, getOnlineCourseDetailById,
    getAllOnlineCourseDetails, upsertOnlineCourseDetail, deleteOnlineCourseDetail
};
