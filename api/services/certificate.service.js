const Certificate = require("../db/Models/Certificate.Schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

module.exports = {
  createCertificate,
  verifyCertificate,
  adminLogin,
};
