// import React, { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import CryptoJS from "crypto-js";

// const secretKey = "your-secret-key"; // Use a secure key and keep it private

// const Signin = () => {
//   const [email_phone, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   sessionStorage.removeItem("userRole");

//   const validateForm = () => {
//     if (!password) {
//       toast.error("Password is required.");
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await axios.post("http://localhost:5000/users/login", {
//           email_phone,
//           password,
//         });

//         const { user, token } = response.data;

//         if (user) {
//           toast.success("Logged in successfully!");

//           // sessionStorage.setItem("userRole", user.role);
//           // sessionStorage.setItem("token", token);

//           const encryptedRole = CryptoJS.AES.encrypt(
//             user.role,
//             secretKey
//           ).toString();
//           const encryptedToken = CryptoJS.AES.encrypt(
//             token,
//             secretKey
//           ).toString();

//           // const encryptedData = sessionStorage.getItem("secureData");
//           // const decryptedData = CryptoJS.AES.decrypt(encryptedData, "secret-key").toString(CryptoJS.enc.Utf8);

//           sessionStorage.setItem("userRole", encryptedRole);
//           sessionStorage.setItem("token", encryptedToken);

//           if (user.role === "admin") {
//             navigate("/admin");
//           } else if (user.role === "user") {
//             navigate("/");
//           } else {
//             navigate("/");
//           }
          
//           window.location.reload();
//         } else {
//           toast.error(response.data.message || "Login failed!");
//         }
//       } catch (error) {
//         const message = error.response?.data.message || "Login failed!";
//         toast.error(message);
//         console.error("Login error:", error);
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-full h-screen px-5 sm:px-0">
//       <ToastContainer />
//       <div className="flex w-full max-w-sm overflow-hidden bg-white border rounded-lg shadow-lg lg:max-w-4xl">
//         <div
//           className="hidden bg-blue-700 bg-contain md:block lg:w-1/2"
//           style={{
//             backgroundImage: `url(https://images.pexels.com/photos/8962682/pexels-photo-8962682.jpeg?auto=compress&cs=tinysrgb&w=600)`,
//           }}
//         ></div>
//         <div className="w-full p-8 lg:w-1/2">
//           <p className="text-xl text-center text-gray-600">Welcome back!</p>
//           <form onSubmit={handleLogin}>
//             <div className="mt-4">
//               <label className="block mb-2 text-sm font-bold text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
//                 type="text"
//                 value={email_phone}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 name="email_phone"
//                 aria-label="Email Address"
//               />
//             </div>
//             <div className="relative flex flex-col justify-between mt-4">
//               <label className="block mb-2 text-sm font-bold text-gray-700">
//                 Password
//               </label>
//               <input
//                 className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 aria-label="Password"
//               />
//               <a
//                 href="/forgot-password"
//                 className="w-full mt-2 text-xs text-gray-500 hover:text-gray-900 text-end"
//               >
//                 Forget Password?
//               </a>

//               <div
//                 className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <FaEyeSlash size={20} color="#4B5563" />
//                 ) : (
//                   <FaEye size={20} color="#4B5563" />
//                 )}
//               </div>
//             </div>
//             <button
//               className="w-full px-4 py-2 mt-8 font-bold text-white bg-blue-700 rounded hover:bg-blue-600"
//               type="submit"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CryptoJS from "crypto-js";

const secretKey = "your-secret-key"; // Use a secure key and keep it private

const Signin = () => {
  const [email_phone, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  sessionStorage.removeItem("userRole");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Show a toast message indicating login is in progress
    const loadingToastId = toast.loading("Logging in...");

    try {
      // Send login request
      const response = await axios.post("http://localhost:5000/users/login", {
        email_phone,
        password,
      });

      const { user, token } = response.data;

      if (user) {
        // Update toast message on success
        toast.update(loadingToastId, {
          render: "Logged in successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Encrypt and store session data
        const encryptedRole = CryptoJS.AES.encrypt(user.role, secretKey).toString();
        const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();

        sessionStorage.setItem("userRole", encryptedRole);
        sessionStorage.setItem("token", encryptedToken);

        // Navigate based on user role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        // Optional: reload to reflect the new user state in the app
        window.location.reload();
      } else {
        toast.update(loadingToastId, {
          render: response.data.message || "Login failed!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingToastId, {
        render: error.response?.data.message || "Login failed!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Login error:", error);
    }
  };

  return (
<div className="flex items-center justify-center w-full h-screen px-0 sm:px-5">
<ToastContainer />
      <div className="flex w-full max-w-sm overflow-hidden bg-white border rounded-lg shadow-lg lg:max-w-4xl">
        <div
          className="hidden bg-cover bg-center md:block lg:w-1/2"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/8962682/pexels-photo-8962682.jpeg?auto=compress&cs=tinysrgb&w=600)`,
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-center text-gray-600">Welcome back!</p>
          <form onSubmit={handleLogin}>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type="text"
                value={email_phone}
                onChange={(e) => setEmail(e.target.value)}
                required
                name="email_phone"
                aria-label="Email Address"
              />
            </div>
            <div className="relative flex flex-col justify-between mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <a
                href="/forgot-password"
                className="w-full mt-2 text-xs text-gray-500 hover:text-gray-900 text-end"
              >
                Forget Password?
              </a>

              <div
                className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash size={20} color="#4B5563" />
                ) : (
                  <FaEye size={20} color="#4B5563" />
                )}
              </div>
            </div>
            <button
              className="w-full px-4 py-2 mt-8 font-bold text-white bg-blue-700 rounded hover:bg-blue-600"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
