import React from "react";

import logo from "../assets/FooterLogo.png";
const Footer = () => {
  return (
    <footer className="pt-8 bg-gray-100 border-t border-gray-300 mt-5">
      <div className="container grid grid-cols-1 gap-8 px-6 mx-auto sm:grid-cols-2 lg:grid-cols-4 lg:px-16">
        {/* Company Info */}
        <div className="text-center lg:text-left">  
          <img
            src={logo}
            alt="Reality Solutions Logo"
            className="mx-auto lg:mx-0 w-32"
          />
          <p className="mt-4 text-gray-700">
            PropertyMission24x7 is your trusted real estate partner in the
            Tricity area, specializing in buying, selling, renting, and
            financial services. Located in Panchkula, we are available 24x7 at
            +91 7015433569 or Propertymission81@gmail.com. We prioritize your
            privacy and security in all transactions.
          </p>
        </div>

        {/* Useful Links */}
        <div className="text-center lg:text-left">
          <h3 className="mb-4 text-lg font-bold">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/residential" className="hover:underline">
                All Categories
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* More Links */}
        <div className="text-center lg:text-left">
          <h3 className="mb-4 text-lg font-bold">More Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="/support" className="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Connect */}
        <div className="text-center lg:text-left">
          <h3 className="mb-4 text-lg font-bold">Quick Connect</h3>
          <p className="text-gray-700">Address:</p>
          <p className="text-gray-700">
            Brar Complex, Patiala Road, Zirakpur - 140603
          </p>
          <p className="text-gray-700">Phone: +91 7015433569</p>
          <p className="text-gray-700">Email: Propertymission81@gmail.com</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="py-4 mt-8 text-center text-white bg-black">
        <p>Copyright © 2024 Flats in Zirakpur | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
