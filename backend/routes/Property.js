const express = require("express");
const {
  addProperty,
  getPropertyType,
  updateType,
  deleteType,
  getProperties,
  deleteProperty,
  addCategory,
} = require("../controllers/Property");
const router = express.Router();

// Property Type Paths
router.route("/propertyTypeAdd").post(addCategory).get(getPropertyType);
router.route("/:id").patch(updateType).delete(deleteType);

// Property Paths
router.route("/propertyAdd").post(addProperty);
router.route("/fetch").get(getProperties);
router.route("/action/:id").delete(deleteProperty);

module.exports = router;