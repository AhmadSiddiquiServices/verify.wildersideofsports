const express = require("express");
const router = express.Router();
const multer = require("multer");
const certificateController = require("../controllers/certificate.controller");
const verifyToken = require("../middlewares/auth.middleware");

const storage = multer.memoryStorage(); // keeps the file in memory
const upload = multer({ storage });

// router.get('/api/certificates/:id', certificateController.getCertificateById);
router.get("/verify/certificate", certificateController.verifyCertificate);
router.post(
  "/certificates",
  verifyToken,
  certificateController.createCertificate
);
router.post(
  "/certificates/upload",
  verifyToken,
  upload.single("file"),
  certificateController.uploadCertificates
);
router.post("/admin/login", certificateController.adminLogin);
// router.put('/api/certificates/:id', certificateController.updateCertificate);
// router.delete('/api/certificates/:id', certificateController.deleteCertificate);

module.exports = router;
