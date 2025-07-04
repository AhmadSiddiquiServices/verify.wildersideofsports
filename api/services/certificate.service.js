const Certificate = require("../db/Models/Certificate.Schema");

const createCertificate = async ({ certNumber, signer, itemType }) => {
  const newCert = new Certificate({
    certNumber,
    signer,
    itemType,
  });

  return await newCert.save();
};

const verifyCertificate = async (code) => {
  const certificate = await Certificate.findOne({ certNumber: code });
  return certificate;
};

module.exports = {
  createCertificate,
  verifyCertificate,
};
