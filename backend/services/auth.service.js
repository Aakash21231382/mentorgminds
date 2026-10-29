const bcrypt = require("bcrypt");
const { sql, config } = require("../config/database");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const register = async (data) => {
    const { full_name, email, phone, password, confirm_password } = data;

    if (!full_name || !email || !phone || !password || !confirm_password)
        throw new Error("All fields are required.");

    if (password !== confirm_password)
        throw new Error("Passwords do not match.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60000);
    const password_hash = await bcrypt.hash(password, 10);

    const pool = await sql.connect(config);

    // Check existing user
    const existingResult = await pool.request()
        .input('email', sql.VarChar(150), email)
        .input('phone', sql.VarChar(20), phone)
        .execute('sp_CheckUserForRegister');

    let userId;
    let responseMessage;

    if (existingResult.recordset.length > 0) {
        const user = existingResult.recordset[0];

        if (user.is_verified) {
            if (user.email === email) throw new Error("Email already registered.");
            if (user.phone === phone) throw new Error("Phone number already registered.");
        } else {
            // Unverified user — details update karo
            await pool.request()
                .input('email', sql.VarChar(150), email)
                .input('full_name', sql.VarChar(100), full_name)
                .input('phone', sql.VarChar(20), phone)
                .input('password_hash', sql.VarChar(255), password_hash)
                .input('otp', sql.VarChar(10), otp)
                .input('otp_expiry', sql.DateTime, otp_expiry)
                .execute('sp_UpdateUnverifiedUser');

            userId = user.id;
            responseMessage = "Details updated. A new OTP has been sent to your email.";
        }
    } else {
        // Naya user insert karo
        const result = await pool.request()
            .input('full_name', sql.VarChar(100), full_name)
            .input('email', sql.VarChar(150), email)
            .input('phone', sql.VarChar(20), phone)
            .input('password_hash', sql.VarChar(255), password_hash)
            .input('profile_image', sql.VarChar(sql.MAX), null)
            .input('role', sql.VarChar(20), 'User')
            .input('otp', sql.VarChar(10), otp)
            .input('otp_expiry', sql.DateTime, otp_expiry)
            .execute('sp_RegisterUser');

        userId = result.recordset[0].user_id;
        responseMessage = result.recordset[0].message;
    }

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #F6881F; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Mentoringminds</h1>
                    <div style="height: 3px; width: 50px; background-color: #F6881F; margin: 10px auto 0;"></div>
                </div>
                <p style="font-size: 16px; color: #333333; line-height: 1.5;">Hello <strong>${full_name}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                    Welcome to <strong>Mentoringminds</strong>! To complete your registration, please verify your email using the OTP below:
                </p>
                <div style="text-align: center; margin: 40px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #F6881F; background-color: #FFF4E8; padding: 15px 40px; border-radius: 8px; border: 1px dashed #F6881F; letter-spacing: 5px;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 14px; color: #777777; text-align: center;">
                    This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                </p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
                <p style="font-size: 14px; color: #888888; text-align: center; margin: 0; line-height: 1.5;">
                    Keep Learning, Keep Growing.<br><strong>The Mentoringminds Team</strong>
                </p>
                <p style="font-size: 12px; color: #aaaaaa; text-align: center; margin-top: 15px;">
                    &copy; ${new Date().getFullYear()} Mentoringminds. All rights reserved.
                </p>
            </div>
        </div>`;

    await sendEmail({ email, subject: "Verify Your Account - Mentoringminds", html: emailHtml });

    return { success: true, message: responseMessage, user_id: userId };
};


const verifyOtp = async (data) => {
    const { email, otp } = data;

    if (!email || !otp) throw new Error("Email and OTP are required.");

    const pool = await sql.connect(config);

    const result = await pool.request()
        .input('email', sql.VarChar(150), email)
        .execute('sp_VerifyOtp');

    if (result.recordset.length === 0) throw new Error("User not found.");

    const user = result.recordset[0];

    if (user.otp !== otp) throw new Error("Invalid OTP.");
    if (new Date() > new Date(user.otp_expiry)) throw new Error("OTP has expired. Please request a new one.");

    // Mark verified
    await pool.request()
        .input('email', sql.VarChar(150), email)
        .execute('sp_MarkUserVerified');

    // UsersProfile mein entry ensure karo
    await pool.request()
        .input('userId', sql.Int, user.id)
        .input('full_name', sql.VarChar(100), user.full_name)
        .input('email', sql.VarChar(150), user.email)
        .input('password_hash', sql.VarChar(255), user.password_hash)
        .execute('sp_EnsureUserProfile');

    return { success: true, message: "Email verified successfully. You can now login." };
};


const login = async (data) => {
    const { email, password } = data;

    if (!email || !password) throw new Error("Email and password are required.");

    const pool = await sql.connect(config);

    const userResult = await pool.request()
        .input('email', sql.VarChar(150), email)
        .execute('sp_GetUserByEmail');

    if (userResult.recordset.length === 0) throw new Error("Invalid email or password.");

    const user = userResult.recordset[0];

    if (!user.is_active) throw new Error("Your account is disabled. Please contact support.");
    if (!user.is_verified) throw new Error("Please verify your OTP before logging in.");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Invalid email or password.");

    await pool.request()
        .input('userId', sql.Int, user.id)
        .execute('sp_UpdateLastLogin');

    const profileResult = await pool.request()
        .input('userId', sql.Int, user.id)
        .execute('sp_GetProfileImage');

    const profileImage = profileResult.recordset[0]?.ProfileImage || null;

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        success: true,
        message: "Login successful.",
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            profile_image: profileImage
        }
    };
};

const adminLogin = async (data) => {
    const { email, password } = data;

    if (!email || !password) throw new Error("Email and password are required.");

    const pool = await sql.connect(config);

    const userResult = await pool.request()
        .input('email', sql.VarChar(150), email)
        .execute('sp_GetUserByEmail');

    if (userResult.recordset.length === 0) throw new Error("Invalid email or password.");

    const user = userResult.recordset[0];

    if (user.role !== 'Admin') throw new Error("Access denied. Admin credentials required.");
    if (!user.is_active) throw new Error("Your account is disabled. Please contact support.");
    if (!user.is_verified) throw new Error("Account is not verified.");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Invalid email or password.");

    await pool.request()
        .input('userId', sql.Int, user.id)
        .execute('sp_UpdateLastLogin');

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        success: true,
        message: "Admin login successful.",
        token,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
    };
};

const forgotPassword = async (data) => {
    const { email } = data;
    if (!email) throw new Error("Email is required.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60000);

    const pool = await sql.connect(config);

    const result = await pool.request()
        .input('email', sql.VarChar(150), email)
        .input('otp', sql.VarChar(10), otp)
        .input('otp_expiry', sql.DateTime, otp_expiry)
        .execute('sp_SetForgotOtp');

    if (result.recordset.length === 0) throw new Error("User not found with this email.");

    const user = result.recordset[0];

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #F6881F; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Mentoringminds</h1>
                    <div style="height: 3px; width: 50px; background-color: #F6881F; margin: 10px auto 0;"></div>
                </div>
                <p style="font-size: 16px; color: #333333; line-height: 1.5;">Hello <strong>${user.full_name}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.5;">We received a request to reset your password. Here is your OTP:</p>
                <div style="text-align: center; margin: 40px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #F6881F; background-color: #FFF4E8; padding: 15px 10px; border-radius: 8px; border: 1px dashed #F6881F; letter-spacing: 5px;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 14px; color: #777777; text-align: center;">This OTP is valid for <strong>10 minutes</strong>.</p>
            </div>
        </div>`;

    await sendEmail({ email, subject: "Password Reset OTP - Mentoringminds", html: emailHtml });

    return { success: true, message: "OTP sent to your email for password reset." };
};

const verifyResetOtp = async (data) => {
    const { email, otp } = data;
    if (!email || !otp) throw new Error("Email and OTP are required.");

    const pool = await sql.connect(config);

    const result = await pool.request()
        .input('email', sql.VarChar(150), email)
        .execute('sp_VerifyResetOtp');

    if (result.recordset.length === 0) throw new Error("User not found.");

    const user = result.recordset[0];
    if (user.otp !== otp) throw new Error("Invalid OTP.");
    if (new Date() > new Date(user.otp_expiry)) throw new Error("OTP has expired. Please request a new one.");

    return { success: true, message: "OTP verified successfully. You can now set a new password." };
};

const resetPassword = async (data) => {
    const { email, otp, new_password, confirm_password } = data;

    if (!email || !otp || !new_password || !confirm_password)
        throw new Error("All fields are required.");
    if (new_password !== confirm_password)
        throw new Error("Passwords do not match.");

    const pool = await sql.connect(config);

    // Security: OTP dobara verify karo
    const result = await pool.request()
        .input('email', sql.VarChar(150), email)
        .execute('sp_VerifyResetOtp');

    if (result.recordset.length === 0) throw new Error("User not found.");

    const user = result.recordset[0];
    if (user.otp !== otp) throw new Error("Invalid OTP.");
    if (new Date() > new Date(user.otp_expiry)) throw new Error("OTP has expired.");

    const password_hash = await bcrypt.hash(new_password, 10);

    await pool.request()
        .input('email', sql.VarChar(150), email)
        .input('password_hash', sql.VarChar(255), password_hash)
        .execute('sp_ResetPassword');

    return { success: true, message: "Password has been reset successfully. You can now login." };
};

const resendOtp = async (data) => {
    const { email } = data;
    if (!email) throw new Error("Email is required.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60000);

    const pool = await sql.connect(config);

    const result = await pool.request()
        .input('email', sql.VarChar(150), email)
        .input('otp', sql.VarChar(10), otp)
        .input('otp_expiry', sql.DateTime, otp_expiry)
        .execute('sp_ResendOtp');

    if (result.recordset.length === 0) throw new Error("User not found.");

    const user = result.recordset[0];
    if (user.is_verified) throw new Error("Account already verified.");

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 30px;">
            <h1 style="color: #F6881F;">Mentoringminds</h1>
            <p>Hello <strong>${user.full_name}</strong>, here is your new OTP:</p>
            <div style="font-size: 32px; font-weight: bold; color: #F6881F; padding: 15px; background: #FFF4E8; display: inline-block; letter-spacing: 5px; border-radius: 8px;">
                ${otp}
            </div>
            <p>Valid for <strong>10 minutes</strong>.</p>
        </div>`;

    await sendEmail({ email, subject: "Resend OTP - Mentoringminds", html: emailHtml });

    return { success: true, message: "New OTP sent to your email." };
};


const getUserProfileService = async (userId) => {
    const pool = await sql.connect(config);

    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .execute('sp_GetUserProfile');

    return result.recordset[0];
};


const updateUserProfileService = async (userId, data) => {
    const toNull = (val) => (val === "" || val === undefined ? null : val);

    const pool = await sql.connect(config);

    const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .input('DOB', sql.Date, toNull(data.dob))
        .input('Gender', sql.VarChar(20), toNull(data.gender))
        .input('MaritalStatus', sql.VarChar(50), toNull(data.marital_status))
        .input('HighestQualification', sql.VarChar(100), toNull(data.highest_qualification))
        .input('Phone', sql.VarChar(20), toNull(data.phone))
        .input('WhatsApp', sql.VarChar(20), toNull(data.whatsapp))
        .input('AltPhone', sql.VarChar(20), toNull(data.alt_phone))
        .input('AltEmail', sql.VarChar(150), toNull(data.alt_email))
        .input('PermHouseNo', sql.VarChar(100), toNull(data.perm_house_no))
        .input('PermAptName', sql.VarChar(100), toNull(data.perm_apt_name))
        .input('PermLocality', sql.VarChar(150), toNull(data.perm_locality))
        .input('PermCountry', sql.VarChar(50), toNull(data.perm_country))
        .input('PermCity', sql.VarChar(50), toNull(data.perm_city))
        .input('PermPincode', sql.VarChar(20), toNull(data.perm_pincode))
        .input('CurrHouseNo', sql.VarChar(100), toNull(data.curr_house_no))
        .input('CurrAptName', sql.VarChar(100), toNull(data.curr_apt_name))
        .input('CurrLocality', sql.VarChar(150), toNull(data.curr_locality))
        .input('CurrCountry', sql.VarChar(50), toNull(data.curr_country))
        .input('CurrCity', sql.VarChar(50), toNull(data.curr_city))
        .input('CurrPincode', sql.VarChar(20), toNull(data.curr_pincode))
        .input('FatherName', sql.VarChar(100), toNull(data.father_name))
        .input('FatherEducation', sql.VarChar(100), toNull(data.father_education))
        .input('MotherName', sql.VarChar(100), toNull(data.mother_name))
        .input('MotherEducation', sql.VarChar(100), toNull(data.mother_education))
        .input('ParentMobile', sql.VarChar(20), toNull(data.parent_mobile))
        .input('LinkedIn', sql.VarChar(255), toNull(data.linkedin))
        .input('GitHub', sql.VarChar(255), toNull(data.github))
        .input('Instagram', sql.VarChar(255), toNull(data.instagram))
        .execute('UpdateUserProfile');

    return result.recordset[0];
};


const updateProfileImageService = async (userId, imageUrl) => {
    const pool = await sql.connect(config);

    await pool.request()
        .input('userId', sql.Int, userId)
        .input('imageUrl', sql.VarChar(sql.MAX), imageUrl)
        .execute('sp_UpdateProfileImage');

    return { success: true, profile_image: imageUrl };
};

module.exports = {
    register,
    verifyOtp,
    resendOtp,
    login,
    adminLogin,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    updateUserProfileService,
    getUserProfileService,
    updateProfileImageService
};
