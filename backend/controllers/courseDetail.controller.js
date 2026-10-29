const { sql, config } = require('../config/database');

// Helper: JSON parse safely
const safeJson = (val) => {
    if (!val) return null;
    if (typeof val === 'object') return JSON.stringify(val);
    return val;
};

// ── Public: Get by slug ───────────────────────────────────────
const getCourseDetailBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Slug', sql.VarChar(200), slug)
            .execute('sp_GetCourseDetailBySlug');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Course detail not found' });

        const row = result.recordset[0];

        // JSON fields parse karo
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
        console.error('Get Course Detail By Slug Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get by CareerCourseId ──────────────────────────────
const getCourseDetailById = async (req, res) => {
    try {
        const { careerCourseId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CareerCourseId', sql.Int, careerCourseId)
            .execute('sp_GetCourseDetailById');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Not found', exists: false });

        res.status(200).json({ success: true, detail: result.recordset[0], exists: true });
    } catch (err) {
        console.error('Get Course Detail By Id Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get by NavbarLinkId ────────────────────────────────
const getCourseDetailByNavbarId = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`SELECT * FROM CoursePageDetails WHERE NavbarLinkId = ${parseInt(navbarLinkId)}`);

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Not found', exists: false });

        res.status(200).json({ success: true, detail: result.recordset[0], exists: true });
    } catch (err) {
        console.error('Get Course Detail By NavbarId Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get by FooterLinkId ────────────────────────────────
const getCourseDetailByFooterLinkId = async (req, res) => {
    try {
        const { footerLinkId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('FooterLinkId', sql.Int, parseInt(footerLinkId))
            .execute('sp_GetCourseDetailByFooterLinkId');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Not found', exists: false });

        res.status(200).json({ success: true, detail: result.recordset[0], exists: true });
    } catch (err) {
        console.error('Get Course Detail By FooterLinkId Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get all ────────────────────────────────────────────
const getAllCourseDetails = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAllCourseDetails');
        res.status(200).json({ success: true, details: result.recordset });
    } catch (err) {
        console.error('Get All Course Details Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Upsert (CareerCourseId ya NavbarLinkId dono support) ──
const upsertCourseDetail = async (req, res) => {
    try {
        const b = req.body;

        // NavbarLinkId se upsert karne ke liye pehle check karo
        const isNavbar = !!b.navbarLinkId && !b.careerCourseId;
        const isFooter = !!b.footerLinkId && !b.careerCourseId && !b.navbarLinkId;

        const pool = await sql.connect(config);

        // Agar navbarLinkId based hai toh direct query use karo
        if (isNavbar) {
            const navbarLinkId = parseInt(b.navbarLinkId);
            const slug = b.slug;

            if (!slug) return res.status(400).json({ success: false, message: 'Slug is required' });

            // Check if exists
            const existing = await pool.request()
                .query(`SELECT Id FROM CoursePageDetails WHERE NavbarLinkId = ${navbarLinkId}`);

            const fields = [
                'Slug','HeroBadge','University','HeroTitleNormal','HeroTitleOrange',
                'HeroDescription','HeroDuration','HeroMode','HeroStarts','HeroImage',
                'HeroReviewText','HeroReviewAuthor','HeroUrgencyText','BrochureUrl',
                'AlumniCompanies','LegacyTitle','LegacySubtitle','LegacyCards',
                'AiSectionTitle','AiSectionSubtext','AiHighlights',
                'AiStat1Value','AiStat1Label','AiStat2Value','AiStat2Label',
                'AiPromoTitle','AiPromoText','QuickHighlights',
                'LearningJourneyTitle','LearningJourney','Curriculum','Tools',
                'RealWorldProjects','CapstoneProjects','Mentors',
                'CredentialTitle','CredentialSubtitle','CredentialFeatures','CertificateImage',
                'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience',
                'ShowAlumni','ShowLegacy','ShowAiSection','ShowQuickHighlights',
                'ShowLearningJourney','ShowCurriculum','ShowTools','ShowRealProjects',
                'ShowCapstone','ShowMentors','ShowCredential','ShowCareerSupport',
                'Price','OriginalPrice','ScholarshipText','EmiOptionsText','ShowPricing','IsActive'
            ];

            const jsonFields = [
                'AlumniCompanies','LegacyCards','AiHighlights','QuickHighlights',
                'LearningJourney','Curriculum','Tools','RealWorldProjects',
                'CapstoneProjects','Mentors','CredentialFeatures',
                'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience'
            ];
            const bitFields = [
                'ShowAlumni','ShowLegacy','ShowAiSection','ShowQuickHighlights',
                'ShowLearningJourney','ShowCurriculum','ShowTools','ShowRealProjects',
                'ShowCapstone','ShowMentors','ShowCredential','ShowCareerSupport','ShowPricing','IsActive'
            ];

            const getValue = (key) => {
                const camel = key.charAt(0).toLowerCase() + key.slice(1);
                let val = b[camel] !== undefined ? b[camel] : b[key];
                if (jsonFields.includes(key)) {
                    if (Array.isArray(val) || (val && typeof val === 'object')) return JSON.stringify(val);
                    return val || null;
                }
                if (bitFields.includes(key)) return val !== false ? 1 : 0;
                return val || null;
            };

            if (existing.recordset.length > 0) {
                // UPDATE
                const setClause = fields.map(f => {
                    const val = getValue(f);
                    if (val === null) return `${f} = NULL`;
                    if (typeof val === 'number') return `${f} = ${val}`;
                    return `${f} = N'${String(val).replace(/'/g, "''")}'`;
                }).join(', ');
                await pool.request().query(
                    `UPDATE CoursePageDetails SET ${setClause}, UpdatedAt = GETDATE() WHERE NavbarLinkId = ${navbarLinkId}`
                );
                return res.status(200).json({ success: true, message: 'Course detail updated' });
            } else {
                // INSERT — NavbarLinkId set karo, CareerCourseId aur OnlineCourseId ko include mat karo
                // (unka unique constraint NULL pe fail karta hai)
                const insertFields = ['NavbarLinkId', ...fields].join(', ');
                const insertValues = [navbarLinkId, ...fields.map(f => {
                    const val = getValue(f);
                    if (val === null) return 'NULL';
                    if (typeof val === 'number') return val;
                    return `N'${String(val).replace(/'/g, "''")}'`;
                })].join(', ');
                await pool.request().query(
                    `INSERT INTO CoursePageDetails (${insertFields}) VALUES (${insertValues})`
                );
                return res.status(201).json({ success: true, message: 'Course detail created' });
            }
        }

        // ── FooterLinkId flow (same pattern as navbar) ───────────
        if (isFooter) {
            const footerLinkId = parseInt(b.footerLinkId);
            const slug = b.slug;
            if (!slug) return res.status(400).json({ success: false, message: 'Slug is required' });

            const existing = await pool.request()
                .query(`SELECT Id FROM CoursePageDetails WHERE FooterLinkId = ${footerLinkId}`);

            const fields = [
                'Slug','HeroBadge','University','HeroTitleNormal','HeroTitleOrange',
                'HeroDescription','HeroDuration','HeroMode','HeroStarts','HeroImage',
                'HeroReviewText','HeroReviewAuthor','HeroUrgencyText','BrochureUrl',
                'AlumniCompanies','LegacyTitle','LegacySubtitle','LegacyCards',
                'AiSectionTitle','AiSectionSubtext','AiHighlights',
                'AiStat1Value','AiStat1Label','AiStat2Value','AiStat2Label',
                'AiPromoTitle','AiPromoText','QuickHighlights',
                'LearningJourneyTitle','LearningJourney','Curriculum','Tools',
                'RealWorldProjects','CapstoneProjects','Mentors',
                'CredentialTitle','CredentialSubtitle','CredentialFeatures','CertificateImage',
                'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience',
                'ShowAlumni','ShowLegacy','ShowAiSection','ShowQuickHighlights',
                'ShowLearningJourney','ShowCurriculum','ShowTools','ShowRealProjects',
                'ShowCapstone','ShowMentors','ShowCredential','ShowCareerSupport',
                'Price','OriginalPrice','ScholarshipText','EmiOptionsText','ShowPricing','IsActive'
            ];
            const jsonFields = [
                'AlumniCompanies','LegacyCards','AiHighlights','QuickHighlights',
                'LearningJourney','Curriculum','Tools','RealWorldProjects',
                'CapstoneProjects','Mentors','CredentialFeatures',
                'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience'
            ];
            const bitFields = [
                'ShowAlumni','ShowLegacy','ShowAiSection','ShowQuickHighlights',
                'ShowLearningJourney','ShowCurriculum','ShowTools','ShowRealProjects',
                'ShowCapstone','ShowMentors','ShowCredential','ShowCareerSupport','ShowPricing','IsActive'
            ];
            const getValue = (key) => {
                const camel = key.charAt(0).toLowerCase() + key.slice(1);
                let val = b[camel] !== undefined ? b[camel] : b[key];
                if (jsonFields.includes(key)) {
                    if (Array.isArray(val) || (val && typeof val === 'object')) return JSON.stringify(val);
                    return val || null;
                }
                if (bitFields.includes(key)) return val !== false ? 1 : 0;
                return val || null;
            };

            if (existing.recordset.length > 0) {
                const setClause = fields.map(f => {
                    const val = getValue(f);
                    if (val === null) return `${f} = NULL`;
                    if (typeof val === 'number') return `${f} = ${val}`;
                    return `${f} = N'${String(val).replace(/'/g, "''")}'`;
                }).join(', ');
                await pool.request().query(
                    `UPDATE CoursePageDetails SET ${setClause}, UpdatedAt = GETDATE() WHERE FooterLinkId = ${footerLinkId}`
                );
                return res.status(200).json({ success: true, message: 'Course detail updated' });
            } else {
                const insertFields = ['FooterLinkId', ...fields].join(', ');
                const insertValues = [footerLinkId, ...fields.map(f => {
                    const val = getValue(f);
                    if (val === null) return 'NULL';
                    if (typeof val === 'number') return val;
                    return `N'${String(val).replace(/'/g, "''")}'`;
                })].join(', ');
                await pool.request().query(
                    `INSERT INTO CoursePageDetails (${insertFields}) VALUES (${insertValues})`
                );
                return res.status(201).json({ success: true, message: 'Course detail created' });
            }
        }

        // Original CareerCourseId flow
        const result = await pool.request()
            .input('CareerCourseId',      sql.Int,              b.careerCourseId)
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
            .execute('sp_UpsertCourseDetail');

        const action = result.recordset[0]?.action;
        res.status(action === 'inserted' ? 201 : 200).json({
            success: true,
            message: action === 'inserted' ? 'Course detail created' : 'Course detail updated'
        });
    } catch (err) {
        console.error('Upsert Course Detail Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── Admin: Delete ─────────────────────────────────────────────
const deleteCourseDetail = async (req, res) => {
    try {
        const { careerCourseId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('CareerCourseId', sql.Int, careerCourseId)
            .execute('sp_DeleteCourseDetail');
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) {
        console.error('Delete Course Detail Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Get by Slug ────────────────────────────────────────
const getCourseDetailBySlugAdmin = async (req, res) => {
    try {
        const { slug } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`SELECT * FROM CoursePageDetails WHERE Slug = '${slug.replace(/'/g, "''")}'`);

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Not found', exists: false });

        res.status(200).json({ success: true, detail: result.recordset[0], exists: true });
    } catch (err) {
        console.error('Get Course Detail By Slug Admin Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admin: Upsert by Slug (for navbar dropdown detail pages) ──
const upsertCourseDetailBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const b = req.body;

        const pool = await sql.connect(config);

        // Check if exists
        const existing = await pool.request()
            .query(`SELECT Id FROM CoursePageDetails WHERE Slug = '${slug.replace(/'/g, "''")}'`);

        const fields = [
            'Slug','HeroBadge','University','HeroTitleNormal','HeroTitleOrange',
            'HeroDescription','HeroDuration','HeroMode','HeroStarts','HeroImage',
            'HeroReviewText','HeroReviewAuthor','HeroUrgencyText','BrochureUrl',
            'AlumniCompanies','LegacyTitle','LegacySubtitle','LegacyCards',
            'AiSectionTitle','AiSectionSubtext','AiHighlights',
            'AiStat1Value','AiStat1Label','AiStat2Value','AiStat2Label',
            'AiPromoTitle','AiPromoText','QuickHighlights',
            'LearningJourneyTitle','LearningJourney','Curriculum','Tools',
            'RealWorldProjects','CapstoneProjects','Mentors',
            'CredentialTitle','CredentialSubtitle','CredentialFeatures','CertificateImage',
            'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience',
            'ShowAlumni','ShowLegacy','ShowAiSection','ShowQuickHighlights',
            'ShowLearningJourney','ShowCurriculum','ShowTools','ShowRealProjects',
            'ShowCapstone','ShowMentors','ShowCredential','ShowCareerSupport',
            'Price','OriginalPrice','ScholarshipText','EmiOptionsText','ShowPricing','IsActive'
        ];

        const jsonFields = [
            'AlumniCompanies','LegacyCards','AiHighlights','QuickHighlights',
            'LearningJourney','Curriculum','Tools','RealWorldProjects',
            'CapstoneProjects','Mentors','CredentialFeatures',
            'CareerJourneySteps','CareerStats','SuccessStories','LearningExperience'
        ];
        const bitFields = [
            'ShowAlumni','ShowLegacy','ShowAiSection','ShowQuickHighlights',
            'ShowLearningJourney','ShowCurriculum','ShowTools','ShowRealProjects',
            'ShowCapstone','ShowMentors','ShowCredential','ShowCareerSupport','ShowPricing','IsActive'
        ];

        const getValue = (key) => {
            const camel = key.charAt(0).toLowerCase() + key.slice(1);
            let val = b[camel] !== undefined ? b[camel] : b[key];
            if (jsonFields.includes(key)) {
                if (Array.isArray(val) || (val && typeof val === 'object')) return JSON.stringify(val);
                return val || null;
            }
            if (bitFields.includes(key)) return val !== false ? 1 : 0;
            return val || null;
        };

        if (existing.recordset.length > 0) {
            // UPDATE
            const setClause = fields.map(f => {
                const val = getValue(f);
                if (val === null) return `${f} = NULL`;
                if (typeof val === 'number') return `${f} = ${val}`;
                return `${f} = N'${String(val).replace(/'/g, "''")}'`;
            }).join(', ');
            await pool.request().query(
                `UPDATE CoursePageDetails SET ${setClause}, UpdatedAt = GETDATE() WHERE Slug = '${slug.replace(/'/g, "''")}'`
            );
            return res.status(200).json({ success: true, message: 'Course detail updated' });
        } else {
            // INSERT
            const insertFields = fields.join(', ');
            const insertValues = fields.map(f => {
                const val = getValue(f);
                if (val === null) return 'NULL';
                if (typeof val === 'number') return val;
                return `N'${String(val).replace(/'/g, "''")}'`;
            }).join(', ');
            await pool.request().query(
                `INSERT INTO CoursePageDetails (${insertFields}) VALUES (${insertValues})`
            );
            return res.status(201).json({ success: true, message: 'Course detail created' });
        }
    } catch (err) {
        console.error('Upsert Course Detail By Slug Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getCourseDetailBySlug, getCourseDetailById, getCourseDetailByNavbarId,
    getCourseDetailByFooterLinkId, getCourseDetailBySlugAdmin, upsertCourseDetailBySlug,
    getAllCourseDetails, upsertCourseDetail, deleteCourseDetail
};
