const xlsx = require("xlsx");
const certificateService = require("../services/certificate.service");

const createCertificate = async (req, res) => {
  try {
    const { certNumber, signer, itemType } = req.body;

    if (!certNumber) {
      return res.status(400).json({ error: "certNumber is required" });
    }

    const result = await certificateService.createCertificate({
      certNumber,
      signer,
      itemType,
    });
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }
    return res
      .status(201)
      .json({ message: "Certificate created successfully", data: result });
  } catch (error) {
    console.error("Error in createCertificate controller:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { code } = req.query;
    const certificate = await certificateService.verifyCertificate(code);

    if (!certificate) {
      return res.status(404).json({
        error:
          "Looks like we don't have that certificate number in our records...",
      });
    }

    return res.status(200).json({
      message: "Certificate is Valid",
      data: certificate,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ error: "Username and Password are required" });
    }

    const result = await certificateService.adminLogin(userName, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      token: result.token,
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadCertificates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); // Converts to array of objects

    const { insertedCount, skippedCount } =
      await certificateService.uploadCertificates(data);

    return res.status(200).json({
      message: "Upload completed",
      insertedCount,
      skippedCount,
    });
  } catch (error) {
    console.error("Error uploading certificates:", error);
    return res.status(500).json({ error: "Server error during upload" });
  }
};

module.exports = {
  createCertificate,
  verifyCertificate,
  adminLogin,
  uploadCertificates,
};
