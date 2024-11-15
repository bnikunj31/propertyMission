import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
      toast.error("Name is required");
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      toast.error("Phone number is required");
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
      toast.error("Message is required");
    }
    if (formData.message && formData.message.length > 250) {
      newErrors.message = "Message can be max 250 characters.";
      toast.error("Message can be max 250 characters.");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("/api/enquiry/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.msg);
          setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
        } else {
          const error = await response.json();
          toast.error(error.msg || "Failed to submit enquiry.");
        }
      } catch (error) {
        toast.error("An error occurred while submitting the enquiry.");
      }
    } else {
      toast.error("Please fix the errors in the form.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center py-10 space-y-10 md:space-y-0 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-10 md:space-y-0 w-full max-w-5xl">
          <div
            className="flex flex-col md:w-1/2 space-y-4"
            style={{ margin: "0px 20px" }}
          >
            <h1 className="font-bold text-lg">Address:</h1>
            <p className="text-gray-700">
              Brar Complex, Patiala Road, Zirakpur - 140603
            </p>

            <h1 className="font-bold text-lg">Phone:</h1>
            <div className="space-y-2">
              {[
                "+91-85588-58811",
                "+91-85588-58822",
                "+91-85588-58833",
                "+91-85588-58844",
              ].map((phone) => (
                <span key={phone} className="flex gap-2 items-center">
                  <FaPhoneAlt />
                  <a href="/" className="text-gray-700">
                    {phone}
                  </a>
                </span>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif] bg-white shadow-md rounded-lg p-6"
            >
              <h1 style={{ fontSize: "5vh" }}>Contact us</h1>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className={`mt-1 px-3 py-2 border-b-2 focus:border-gray-700 outline-none text-sm ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`mt-1 px-3 py-2 border-b-2 focus:border-gray-700 outline-none text-sm ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Phone No.</label>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Enter your phone no"
                  className={`mt-1 px-3 py-2 border-b-2 focus:border-gray-700 outline-none text-sm ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Message</label>
                <textarea
                  name="message"
                  spellCheck="true"
                  placeholder="Enter your Message"
                  className={`mt-1 px-3 py-2 border-b-2 focus:border-gray-700 outline-none text-sm ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-8 px-6 py-2 w-full bg-[#2c3e50] hover:bg-gray-900 text-sm text-white rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
