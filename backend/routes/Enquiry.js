const express = require("express");
const { addEnquiry, getEnquires } = require("../controllers/Enquiry");
const router = express.Router();

router.post("/add", addEnquiry);
router.get("/fetch", getEnquires);

module.exports = router;
