import React, { useState } from "react";
import Image from "next/image";
import axios from "axios"; // Import Axios

const Contact = () => {
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // For form submission status
  const [errors, setErrors] = useState({}); // For validation errors
  const [loading, setLoading] = useState(false); // For spinner

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    // Message validation
    if (!formData.message) {
      newErrors.message = "Message is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please fix the errors before submitting.");
      return; // Stop form submission if validation fails
    }
    setLoading(true); // Show spinner
    try {
      const response = await axios.post(`${serverUrl}/api/contact`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error.message);
      setStatus("Failed to send message. Please try again.");
    } finally {
      setLoading(false); // Hide spinner after request is done
    }
  };

  return (
    <div className="flex flex-col m-4">
      <div className="flex pb-3 w-full justify-center items-center m-auto flex-col">
        <div className="flex justify-center items-center m-auto flex-col text-center">
          <h1 className="text-3xl">Contact</h1>
          <Image
            className="h-auto w-[125px] md:w-[200px] p-1"
            src="/images/gpologo-invert.png"
            alt="Devilfish Logo"
            width={600}
            height={272}
          />
        </div>
        <br />
        <div className="bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] max-w-[800px] w-full">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="pb-2">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`border rounded p-2 w-full mb-4 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </label>
            <label className="pb-2">
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border rounded p-2 w-full mb-4 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </label>
            <label className="pb-2">
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`border rounded p-2 w-full mb-4 ${
                  errors.message ? "border-red-500" : ""
                }`}
                rows="4"
              />
              {errors.message && <p className="text-red-500">{errors.message}</p>}
            </label>
            {/* Spinner or submit button */}
            {loading ? (
              <div className="flex justify-center">
                {/* Display the external tub-spinner SVG */}
                <Image
                  src="/images/tube-spinner.svg"
                  alt="Loading Spinner"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white rounded p-2 transition duration-200 hover:bg-blue-600"
              >
                Send Message
              </button>
            )}
            {status && <p className="mt-2">{status}</p>} {/* Status message */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
