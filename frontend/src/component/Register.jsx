import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, provider } from "../Google/config"; // Ensure the correct path to your Firebase config
import { signInWithPopup } from "firebase/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return false;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    if (!termsAccepted) {
      toast.error("You must accept the Terms of Use and Privacy Policy.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = {
          name,
          email,
          phone,
          password,
          confirm_password: confirmPassword,
        };
        const response = await axios.post("/api/users/signup", user);
        if (response.status === 200) {
          toast.success("Good To Go...");
          const { name, email, phone, password } = response.data;
          sessionStorage.setItem("name", name);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("phone", phone);
          sessionStorage.setItem("password", password);
          navigate("/Otp_verify");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.msg || "Signup failed.");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      }
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(result);
      console.log(result.user);
      const { displayName, email, accessToken } = user;

      toast.success("Google Sign-In successful!");

      // Store user data in sessionStorage
      sessionStorage.setItem("name", displayName);
      sessionStorage.setItem("email", email);
      const token = accessToken;
      sessionStorage.setItem("token", token);

      navigate("/");
      location.reload();
    } catch (error) {
      toast.error("Google Sign-In failed.");
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
<div className="flex items-center justify-center w-full h-screen px-0 sm:px-5">
      <ToastContainer />
      <div className="flex w-full max-w-sm overflow-hidden bg-white border rounded-lg shadow-lg lg:max-w-4xl">
        <div
          className="hidden bg-cover md:block lg:w-1/2"
          style={{
            backgroundImage:
              "url(https://www.tailwindtap.com/assets/components/form/userlogin/login_tailwindtap.jpg)",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-center text-gray-600">
            Create your account
          </p>
          <form onSubmit={handleSignup} className="mt-4">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Name
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Phone
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="relative mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 pt-8 text-gray-600 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Confirm Password
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-3 pt-6 text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                required
              />
              <span className="text-sm text-gray-700">
                I accept the{" "}
                <a href="#" className="text-blue-700">
                  Terms of Use
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-700">
                  Privacy Policy
                </a>
              </span>
            </div>
            <div className="mt-8">
              <button
                className="w-full px-4 py-2 font-bold text-white bg-blue-700 rounded hover:bg-blue-600"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-500"
            >
              <span className="mr-2">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
