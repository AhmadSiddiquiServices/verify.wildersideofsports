const express = require("express");
const path = require("path");
const connectDB = require("./db/connect");
const certificateRoutes = require("./routes/certificate.routes");

// Load environment variables
require("dotenv").config();

// Create Express Server
const app = express();

// Connect to MongoDB (use IIFE or wrap in async)
(async () => {
  await connectDB();
})();

const port = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());

// Serve static assets like CSS, JS, images
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api", certificateRoutes);

// Serve the HTML page
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../views/VerificationPage.html"));
});

app.get("/add/certificate", (_req, res) => {
  res.sendFile(path.join(__dirname, "../views/AddCertificatePage.html"));
});

app.get("/add/certificates-bulk", (_req, res) => {
  res.sendFile(path.join(__dirname, "../views/AddCertificateBulk.html"));
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
