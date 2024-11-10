const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/PropertyTypes");

// Node Mailer Configurations
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use environment variables
  },
});

// Controllers

//?                              Done                              //

// Signup
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, phone, email, password } = req.body;
    const existingPhone = await User.findOne({ phone });
    const existingEmail = await User.findOne({ email });
    if (existingEmail || existingPhone) {
      return res
        .status(400)
        .json({ msg: "User with same email or phone number already exists." });
    }

    req.session.user = { name, phone, email, password };
    const user = req.session.user;
    res.status(200).json(req.session.user);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err });
  }
};

exports.getOTP = async (req, res) => {
  try {
    if (req.session.user.email) {
      const email = req.session.user.email;
    }
    const otp = generateOTP();
    if (!otp) {
      return res.status(400).json({ msg: "Failed to generate OTP." });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Property Mission 24/7 Verification",
      html: `<b>Your email OTP code is ${otp}. It will expire in 10 minutes.</b>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        if (!res.headersSent) {
          return res.status(500).json({ error: "Error sending OTP via email" });
        }
      }
    });

    req.session.otp = otp;
    return res.status(200).json({ msg: "OTP Sent" });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error.", err: err });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const storedOTP = req.session.otp;
    if (otp != storedOTP) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const newUserData = req.session.user;
    if (!newUserData) {
      return res.status(400).json({ msg: "User data not found in session." });
    }

    const { name, phone, email, password } = newUserData;
    const newUser = new User({
      username: name,
      phone,
      email,
      password,
      role,
    });
    await newUser.save();
    delete req.session.otp;
    return res
      .status(200)
      .json({ msg: "OTP verified successfully", user: newUser });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    return res
      .status(500)
      .json({ msg: "Internal Server Error.", err: err.message });
  }
};

exports.login = async (req, res) => {
  const { email_phone, password } = req.body;
  let phone, email, existingUser, storedPassword;

  try {
    // Check if the input is an email or a phone number
    if (isEmail(email_phone)) {
      email = email_phone;
    } else if (isPhoneNumber(email_phone)) {
      phone = email_phone;
    } else {
      return res.status(400).json({ msg: "Invalid Email Or Phone Number." });
    }

    // Find the user based on email or phone number
    if (phone) {
      existingUser = await User.findOne({ phone });
    } else {
      existingUser = await User.findOne({ email });
    }

    // Check if the user exists
    if (!existingUser) {
      return res.status(400).json({ msg: "User not found." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    req.session.token = token;

    storedPassword = existingUser.password;

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is incorrect." });
    }
    return res.status(200).json({
      msg: "You are logged in successfully",
      user: existingUser,
      token,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error", error: err });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    if (!users) {
      return res.status(400).json({ msg: "No user found!" });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, {
      username,
      email,
      phone,
      role,
    });
    if (!updatedUser) {
      return res.status(404).json({ msg: "User Not Found." });
    }
    return res.status(200).json({ msg: "User updated successfully." });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    return res.status(200).json({ msg: "Deleted User Successfully. " });
  } catch (err) {
    return res.json({ msg: "Internal Server Error." });
  }
};

exports.forgotPass = async (req, res) => {
  const { email } = req.body;
  req.session.email = email;
  existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({ msg: "No user found." });
  }
  const otp = generateOTP();
  if (!req.session.email) {
    return res
      .status(400)
      .json({ msg: "Currently Unavailable Please Try Again Later." });
  }
  console.log(req.session.email, existingUser.username);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Property Mission 24/7 Verification",
    html: `<h1><b>Password reset request.</b></h1>
        <br/>
        <p>Here is your OTP to reset your password: ${otp}</p>
        <br/>
        <p>Never Share Your OTP and Password with anyone.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Error sending OTP via email" });
      }
    }
  });
  req.session.otp = otp;
  return res.status(200).json({ email, otp });
};
exports.updatePass = async (req, res) => {
  try {
    const { newPassword, otp } = req.body;
    console.log(req.body);
    if (req.session.otp != otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    const user = await User.findOne({ email: req.session.email });
    if (!user) {
      return res.status(400).json({ msg: "No user found." });
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    if (!encryptedPassword) {
      return res
        .status(400)
        .json({ msg: "Unable to change password please try again later." });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: req.session.email },
      { password: encryptedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({ msg: "Password update failed." });
    }
    return res.status(200).json({ msg: "Password updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error." });
  }
};

//                                Pending                                //

//?                              Functions                              //
// Checking Validations
const isEmail = (str) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(str);
};

const isPhoneNumber = (str) => {
  const phonePattern = /^\d{10}$/;
  return phonePattern.test(str);
};

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}
