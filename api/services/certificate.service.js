const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Certificate = require("../db/Models/Certificate.Schema");
const User = require("../db/Models/UserSchema");

const createCertificate = async ({ certNumber, signer, itemType }) => {
  const certExists = await Certificate.findOne({ certNumber });
  if (certExists) {
    return { success: false, error: "Certificate already exists" };
  }
  const newCert = new Certificate({
    certNumber,
    signer,
    itemType,
  });
  await newCert.save();

  return { success: true };
};

const verifyCertificate = async (code) => {
  const certificate = await Certificate.findOne({ certNumber: code });
  return certificate;
};

const adminLogin = async (userName, password) => {
  const user = await User.findOne({ userName });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, error: "Invalid credentials" };
  }

  const token = jwt.sign({ userName }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { success: true, token };
};

const uploadCertificates = async (data) => {
  let insertedCount = 0;
  let skippedCount = 0;

  for (const row of data) {
    const certNumber = row.certNumber || row.CERTNUMBER || row["CERT NUMBER"];
    const signer = row.signer || row.SIGNER;
    const itemType = row.itemType || row["ITEM TYPE"];

    if (!certNumber) {
      skippedCount++;
      continue;
    }

    const exists = await Certificate.findOne({ certNumber });
    if (exists) {
      skippedCount++;
      continue;
    }

    const cert = new Certificate({ certNumber, signer, itemType });
    await cert.save();
    insertedCount++;
  }

  return { insertedCount, skippedCount };
};

module.exports = {
  createCertificate,
  verifyCertificate,
  adminLogin,
  uploadCertificates,
};
