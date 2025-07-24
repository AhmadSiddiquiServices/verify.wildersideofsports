const express = require("express");
const router = express.Router();
const multer = require("multer");
const certificateController = require("../controllers/certificate.controller");
const verifyToken = require("../middlewares/auth.middleware");

const storage = multer.memoryStorage(); // keeps the file in memory
const upload = multer({ storage });

router.post("/admin/login", certificateController.adminLogin);
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
router.get("/verify/certificate", certificateController.verifyCertificate);
router.get(
  "/certificates",
  verifyToken,
  certificateController.listCertificates
);
router.get(
  "/certificates/:id",
  verifyToken,
  certificateController.getSingleCertificate
);
router.put(
  "/certificates/:id",
  verifyToken,
  certificateController.updateCertificate
);
router.delete(
  "/certificates/:id",
  verifyToken,
  certificateController.deleteCertificate
);

module.exports = router;
