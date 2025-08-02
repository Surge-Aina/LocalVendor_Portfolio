const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  hours: { type: String },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    tripadvisor: String,
    whatsapp: String
  },
  mapEmbedUrl: String
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);