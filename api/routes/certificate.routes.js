const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');

// router.get('/api/certificates/:id', certificateController.getCertificateById);
router.get('/verify/certificate', certificateController.verifyCertificate);
router.post('/certificates', certificateController.createCertificate);
// router.put('/api/certificates/:id', certificateController.updateCertificate);
// router.delete('/api/certificates/:id', certificateController.deleteCertificate);

module.exports = router;