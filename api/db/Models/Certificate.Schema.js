const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certNumber: { type: String, required: true, unique: true },
  signer: String,
  itemType: String
});

const Certificate = mongoose.model('Certificate', CertificateSchema);

module.exports = Certificate;