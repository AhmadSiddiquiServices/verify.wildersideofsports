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

module.exports = {
  createCertificate,
  verifyCertificate,
  adminLogin,
};
