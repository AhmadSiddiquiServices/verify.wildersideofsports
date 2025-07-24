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

const listCertificates = async (page, limit, query) => {
  const total = await Certificate.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const data = await Certificate.find(query)
    .sort({ _id: 1 }) // Use _id for stable, unique sorting
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return {
    data,
    totalPages,
  };
};

const getSingleCertificate = async (id) => {
  const certificate = await Certificate.findOne({ _id: id });

  if (!certificate) {
    return { success: false, error: "Certificate not found" };
  }

  return {
    success: true,
    data: certificate,
  };
};

const updateCertificate = async (id, body) => {
  const { certNumber, signer, itemType } = body;

  const updated = await Certificate.findByIdAndUpdate(
    id,
    { certNumber, signer, itemType },
    { new: true }
  );

  if (!updated) {
    return { success: false, error: "Certificate not found" };
  }

  return {
    success: true,
    data: updated,
  };
};

const deleteCertificate = async (id) => {
  const deleted = await Certificate.findByIdAndDelete(id);

  if (!deleted) {
    return { success: false, error: "Certificate not found" };
  }

  return { success: true };
};

module.exports = {
  // other exports
  deleteCertificate,
};

module.exports = {
  createCertificate,
  verifyCertificate,
  adminLogin,
  uploadCertificates,
  listCertificates,
  getSingleCertificate,
  updateCertificate,
  deleteCertificate,
};
