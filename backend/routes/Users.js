const express = require("express");
const {
  signup,
  login,
  getOTP,
  verifyOTP,
  fetchUsers,
  updateUser,
  deleteUser,
  forgotPass,
} = require("../controllers/Users");
const { userValidatorRules } = require("../validators/UserValidator");
const hashedPassword = require("../middlewares/passwordHashing");
const router = express.Router();

router.post("/signup", userValidatorRules, hashedPassword, signup);
router.route("/otp").get(getOTP).post(verifyOTP);
router.post("/login", login);
router.route("/fetch").get(fetchUsers);
router.route("/:id").patch(updateUser).delete(deleteUser);
router.route("/forgot").post(forgotPass);

module.exports = router;
