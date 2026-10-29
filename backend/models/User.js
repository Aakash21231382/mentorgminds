const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 1. Basic Auth & Personal Details
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_image: { type: String, default: "" },
  dob: { type: String, default: "" },
  gender: { type: String, default: "" },
  marital_status: { type: String, default: "" },
  highest_qualification: { type: String, default: "" },

  // 2. Contact Information
  contact_info: {
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    alt_phone: { type: String, default: "" },
    alt_email: { type: String, default: "" }
  },

  // 3. Permanent Address
  permanent_address: {
    house_no: { type: String, default: "" },
    apt_name: { type: String, default: "" },
    locality: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" }
  },

  // 4. Current Address
  current_address: {
    house_no: { type: String, default: "" },
    apt_name: { type: String, default: "" },
    locality: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" }
  },

  // 5. Parents Details
  parents_details: {
    father_name: { type: String, default: "" },
    father_education: { type: String, default: "" },
    mother_name: { type: String, default: "" },
    mother_education: { type: String, default: "" },
    parent_mobile: { type: String, default: "" }
  },

  // 6. Social Links
  social_links: {
    github: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);