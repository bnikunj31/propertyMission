import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CryptoJS from "crypto-js";

import Navbar from "./component/Navbar.jsx";
import Navbar2 from "./component/Navbar2.jsx";
import Footer from "./component/Footer.jsx";
// import Home from "./component/Home.jsx";
import About from "./component/About.jsx";
import Contact from "./component/Contact.jsx";
import Register from "./component/Register.jsx";
import Signin from "./component/Signin.jsx";
import App_admin from "./Admin/App_admin.jsx";
import OTPPage from "./component/OTPpage.jsx";
import AddCategory from "./component/AddCategory.jsx";
import PropertyForm from "./component/PropertyForm.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import Forgot from "./component/Forgot.jsx";
import UsersData from "./Admin/UsersData.jsx";
import UpdateUserForm from "./Admin/UpdateUserForm.jsx";
import CategoryData from "./Admin/CategoryData.jsx";
import UpdateCategory from "./Admin/UpdateCategory.jsx";
import Enquires from "./Admin/Enquires.jsx";
import PropertiesData from "./Admin/PropertiesData.jsx";
import EditProperty from "./Admin/EditProperty.jsx";

import CardsGrid from "./component/CardsGrid.jsx";
import ImageCard from "./component/ImageCard.jsx";
import VerifyForgot from "./component/VerifyForgot.JSX";
import PropertyDetail from "./component/PropertyDetail.jsx";
import SpeedDial from "./component/SpeedDial.jsx";
import CategoriesCards from "./component/CategoriesCards.jsx";

const App = () => {
  const [role, setRole] = useState(null);
  useEffect(() => {
    const encryptedData = sessionStorage.getItem("userRole");
    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        "your-secret-key"
      ).toString(CryptoJS.enc.Utf8);

      setRole(decryptedData);
    }
  }, []);

  // // Disable right-click
  // document.addEventListener("contextmenu", (event) => event.preventDefault());

  // // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U
  // document.onkeydown = (event) => {
  //   if (
  //     event.key === "F12" ||
  //     (event.ctrlKey &&
  //       event.shiftKey &&
  //       (event.key === "I" || event.key === "J")) ||
  //     (event.ctrlKey && event.key === "U")
  //   ) {
  //     event.preventDefault();
  //   }
  // };

  // const detectDevToolsByConsole = () => {
  //   const startTime = new Date();

  //   debugger; // This triggers a pause if DevTools is open
  //   const endTime = new Date();

  //   // If DevTools is open, the `debugger` statement causes a noticeable delay
  //   if (endTime - startTime > 100) {
  //     alert("DevTools are open. Please close them to continue.");
  //     sessionStorage.clear();
  //     window.location.href = "/Signin";
  //   }
  // };

  // Run this at regular intervals
  // setInterval(detectDevToolsByConsole, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        {role === "admin" ? <Navbar2 /> : <Navbar />}

        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/Otp_verify" element={<OTPPage />} />
            <Route path="/Signin" element={<Signin />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/forgotVerify" element={<VerifyForgot />} />
            <Route path="/" element={<CardsGrid />} />
            <Route path="/cards" element={<ImageCard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Property/:id" element={<PropertyDetail />} />
            <Route path="/category/:categoryId" element={<CategoriesCards />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <App_admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddCategory"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <AddCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/PropertyForm"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <PropertyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <UsersData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/users"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <UpdateUserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <CategoryData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/category"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <UpdateCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enquires"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <Enquires />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <PropertiesData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/property"
              element={
                <ProtectedRoute role={role} requiredRole="admin" redirectTo="/">
                  <EditProperty />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <SpeedDial />
        <Footer />
      </Router>
    </div>
  );
};

export default App;
