import React from "react";
import { useState, useEffect, useRef } from "react";
import LiabilityReleaseCruise from "./LiabilityReleaseCruise";
import axios from "axios";

const CruiseForm = ({ selectedDate, setIsSubmitted, eventTitle }) => {
  const [showSecondPassengerForm, setShowSecondPassengerForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const errorRefs = useRef({});
  const [isPayPalSuccessful, setIsPayPalSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDateForHTMLInput = selectedDate => {
    // Create a new Date object from the selectedDate
    const dateObj = new Date(selectedDate);

    // Extract year, month, and day
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    // Format the date as yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };
  const today = new Date();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    under18: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: selectedDate,
    message: "",
    electronicSignature: "",
    electronicParentSignature: "",
    firstNameSecondPassenger: "",
    lastNameSecondPassenger: "",
    emailSecondPassenger: "",
    phoneSecondPassenger: "",
    birthdaySecondPassenger: "",
    under18SecondPassenger: "",
    addressSecondPassenger: "",
    emergencyContactNameSecondPassenger: "",
    emergencyContactPhoneSecondPassenger: "",
    electronicSignatureSecondPassenger: "",
    electronicParentSignatureSecondPassenger: "",
    electronicSignatureDate: formatDateForHTMLInput(today),
  });
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    under18: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: "",
    message: "",
    electronicSignature: "",
    electronicParentSignature: "",
    firstNameSecondPassenger: "",
    lastNameSecondPassenger: "",
    emailSecondPassenger: "",
    phoneSecondPassenger: "",
    birthdaySecondPassenger: "",
    under18SecondPassenger: "",
    addressSecondPassenger: "",
    emergencyContactNameSecondPassenger: "",
    emergencyContactPhoneSecondPassenger: "",
    electronicSignatureSecondPassenger: "",
    electronicParentSignatureSecondPassenger: "",
    electronicSignatureDate: "",
  });
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State to control button visibility
  const [isFormVisible, setIsFormVisible] = useState(true); // State to control button visibility
  const [formDataOutside, setFormDataOutside] = useState({}); // State to control button visibility
  const [formOutside, setFormOutside] = useState({}); // State to control button visibility

  // get all data in form and return object
  function getFormData(form) {
    let elements = form.elements;

    // Extracting field names from form elements
    let fields = Object.keys(elements)
      .map(function (k) {
        if (elements[k].name !== undefined) {
          return elements[k].name;
        } else if (elements[k].length > 0) {
          return elements[k].item(0).name;
        }
        return null;
      })
      .filter(function (item, pos, self) {
        return self.indexOf(item) === pos && item;
      });

    // Creating formData object with field values
    let formData = {};
    fields.forEach(function (name) {
      let element = elements[name];

      // Singular form elements just have one value
      formData[name] = element.value;

      // For elements with multiple items, get their values
      if (element.length) {
        let data = [];
        for (let i = 0; i < element.length; i++) {
          let item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(", ");
      }
    });
    // Adding form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // Default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // No email by default

    return { data: formData };
  }

  const handleAddSecondPassenger = () => {
    setShowSecondPassengerForm(true);
  };

  // Function to handle form data outside of handleFormSubmit
  const handleFormSubmitData = (formData, form) => {
    // Store or process the form data as needed
    setFormDataOutside(formData);
    setFormOutside(form);
  };

  const handleSubmit = event => {
    event.preventDefault();

    let form = event.target;

    let formData = getFormData(form);
    let data = formData.data;

    // Pass data to another function
    handleFormSubmitData(formData, form);

    if (validateForm()) {
      // Handle submission of both forms
      // You can collect data from both forms (formData) here and submit it
    } else {
      // Validation failed, do something (e.g., show error messages)
    }
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    // Validate first passenger's fields

    // if (!isNaN(Date.parse(formData.divingDate))) {
    //   setValidationErrors(prevErrors => ({
    //     ...prevErrors,
    //     divingDate: "Please enter a diving date",
    //   }));
    //   isValid = false;
    // } else {
    //   setValidationErrors(prevErrors => ({
    //     ...prevErrors,
    //     divingDate: "",
    //   }));
    // }
    if (formData.firstName.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        firstName: "Please enter a first name.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        firstName: "",
      }));
    }
    if (formData.lastName.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        lastName: "Please enter a last name.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        lastName: "",
      }));
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValidEmail = emailRegex.test(formData.email);

    if (!isValidEmail) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: "Please enter a valid email.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: "",
      }));
    }

    if (formData.phone.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        phone: "Please enter a phone number.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        phone: "",
      }));
    }
    if (isNaN(Date.parse(formData.birthday))) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        birthday: "Please enter a valid birthday.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        birthday: "",
      }));
    }

    if (formData.under18 !== "Yes" && formData.under18 !== "No") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        under18: "Please enter yes or no.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        under18: "",
      }));
    }
    if (formData.address.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: "Please enter a address.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: "",
      }));
    }

    if (formData.emergencyContactName.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactName: "Please enter a emergency contact name.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactName: "",
      }));
    }

    if (formData.emergencyContactPhone.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactPhone: "Please enter a emergency contact phone number.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactPhone: "",
      }));
    }

    if (formData.message.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        message: "Please enter a message.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        message: "",
      }));
    }

    // Validate second passenger's fields if form is visible
    if (showSecondPassengerForm) {
      if (formData.firstNameSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          firstNameSecondPassenger: "Please enter a first name for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          firstNameSecondPassenger: "",
        }));
      }

      if (formData.lastNameSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          lastNameSecondPassenger: "Please enter a last name for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          lastNameSecondPassenger: "",
        }));
      }
    }

    return isValid;
  };

  // Handle form submission via XMLHttpRequest
  const handleGoogleSheetSubmit = () => {
    // console.log("formDataOutside inside googlesheetsubmit", formDataOutside);
    let data = formDataOutside.data;
    // console.log(data);
    let form = formOutside;
    // console.log(form);

    let url = form.action;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        form.removeAttribute("data-submitting"); // Release the form from submitting state

        if (xhr.status === 200) {
          console.log("Form submission successful.");
          // Reset form
          // setFormData({
          //   firstName: "",
          //   lastName: "",
          //   email: "",
          //   phone: "",
          //   birthday: "",
          // under18: "",
          //   address: "",
          //   lastDive: "",
          //   certifyingAgency: "",
          //   certificationNumber: "",
          //   danInsuranceNumber: "",
          //   emergencyContactName: "",
          //   emergencyContactPhone: "",
          //   divingDate: "",
          // message: "",
          //   electronicSignature: "",
          // electronicParentSignature:"",
          //   electronicSignatureDate: "",
          // });
          // Reset form validation data
          setValidationErrors({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birthday: "",
            under18: "",
            address: "",
            // lastDive: "",
            // certifyingAgency: "",
            // certificationNumber: "",
            // danInsuranceNumber: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
            divingDate: "",
            message: "",
            firstNameSecondPassenger: "",
            lastNameSecondPassenger: "",
            emailSecondPassenger: "",
            phoneSecondPassenger: "",
            birthdaySecondPassenger: "",
            under18SecondPassenger: "",
            addressSecondPassenger: "",
            emergencyContactNameSecondPassenger: "",
            emergencyContactPhoneSecondPassenger: "",
            electronicSignatureSecondPassenger: "",
            electronicParentSignatureSecondPassenger: "",
            electronicSignature: "",
            electronicParentSignature: "",
            electronicSignatureDate: "",
          });

          // Reset form
          form.reset();
          let formElements = form.querySelector(".form-elements");
          if (formElements) {
            formElements.style.display = "none";
          }
          let thankYouMessage = form.querySelector(".thankyou_message");
          if (thankYouMessage) {
            thankYouMessage.style.display = "block";
          }
        } else {
          console.error("Form submission failed.");
        }
      }
    };
    let encoded = Object.keys(data)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      })
      .join("&");
    xhr.send(encoded);
  };

  // Send to google sheet - bind to the submit event of our form
  useEffect(() => {
    let forms = document.querySelectorAll("form.gform");
    for (let i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleSubmit, false);
    }
  }, [isPayPalSuccessful]);

  // Define function to update Calendar from Cruise to Booked
  const upDateCalendarBooked = async formData => {
    try {
      const response = await axios.patch(`${serverUrl}/api/update-calendar-cruise-booked`, {
        formData,
      });
      // console.log(formData);
      console.log("Cruise date sent to the backend to update calendar to (booked)", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending cruise date to backend to update calendar to (booked):", error);
      throw error;
    }
  };

  // Define function to send email
  const sendEmail = async formData => {
    try {
      const response = await axios.post(`${serverUrl}/api/send-cruise-email`, { formData });
      console.log("Cruise form data sent to the backend for email", response.data); // Log the response from the backend
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error("Error sending cruise form data to backend for email:", error);
      throw error; // Throw the error to handle it in the calling code
    }
  };

  // Define function to handle PayPal approval
  const handlePayPalOnApprove = async (data, actions) => {
    try {
      const response = await fetch(`${serverUrl}/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');

        // Submit form data to google sheet
        setIsPayPalSuccessful(true);

        // Send form data to googlesheet
        handleGoogleSheetSubmit();

        // Update Calendar
        if (eventTitle === "Cruise") {
          upDateCalendarBooked(formData);
        } else {
          upDateCalendar1Spot(formData);
        }

        // Send email
        sendEmail(formData);

        // Set submitted state to true
        setIsSubmitted(true);

        setMessage("Payment Successful. Thank you!");

        // console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  // Update diving date in form data when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prevState => ({
        ...prevState,
        divingDate: selectedDate,
      }));
    }
  }, [selectedDate]);

  // Function to format phone number as (123) 456-7890
  const formatPhoneNumber = phoneNumber => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return phoneNumber;
  };

  // Function to format address
  const formatAddress = address => {
    // Split the address into individual lines
    const lines = address.split("\n");

    // Capitalize the first letter of each word in each line
    const formattedLines = lines.map(line =>
      line
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    );

    // Join the formatted lines back together with line breaks
    return formattedLines.join("\n");
  };

  // Scroll to error in form
  useEffect(() => {
    const scrollToError = () => {
      // Find the first field with a validation error
      const firstError = Object.keys(validationErrors).find(field => validationErrors[field]);

      // If there's a field with an error, scroll its error message into view
      if (firstError) {
        const errorRef = errorRefs.current[firstError];
        if (errorRef) {
          errorRef.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    scrollToError();
  }, [validationErrors]);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/paypal/client-id`);
        const data = await response.json();
        setClientId(data.clientId);
      } catch (error) {
        console.error(error);
        setMessage("Error fetching PayPal client ID.");
      }
    };

    fetchClientId();
  }, []);

  return (
    <section className="max-w-[1200px] w-full">
      <form
        onSubmit={handleSubmit}
        className="gform "
        method="POST"
        data-email="example@gmail.com"
        action="https://script.google.com/macros/s/AKfycbx8TRKTZ22mPpYJ0sNgBEmM-NLEwnvIAHn3clbkiztEyR0sg5UXZmM7R3YME9k3MT7_7w/exec"
      >
        {isFormVisible ? (
          <div>
            {/* First passenger form inputs */}

            <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
              <div>
                <div className="flex-col flex">
                  <label htmlFor="divingDate" className="mt-2 flex flex-row">
                    Cruise Date:
                  </label>
                  <input
                    id="divingDate"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    type="date"
                    name="divingDate"
                    value={formatDateForHTMLInput(formData.divingDate)}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-col flex">
                  <label htmlFor="firstName" className="mt-2 flex flex-row">
                    First Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {validationErrors.firstName && (
                    <span className="error text-red-500">{validationErrors.firstName}</span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="lastName" className="mt-2 flex flex-row">
                    Last Name:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {validationErrors.lastName && (
                    <span className="error text-red-500">{validationErrors.lastName}</span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="email" className="mt-2 flex flex-row">
                    Email:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {validationErrors.email && (
                    <span className="error text-red-500">{validationErrors.email}</span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="phone" className="mt-2 flex flex-row">
                    Phone:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    id="phone"
                    name="phone"
                    value={formatPhoneNumber(formData.phone)}
                    onChange={handleInputChange}
                  />
                  {validationErrors.phone && (
                    <span className="error text-red-500">{validationErrors.phone}</span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="birthday" className="mt-2 flex flex-row">
                    Birthday:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                  />
                  {validationErrors.birthday && (
                    <span className="error text-red-500">{validationErrors.birthday}</span>
                  )}
                </div>
                {/* second column */}
              </div>
              <div>
                <div className="flex-col flex">
                  <label htmlFor="under18" className="mt-2 flex flex-row">
                    Are you under 18?<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="under18"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    name="under18"
                    value={formData.under18}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>{" "}
                  {validationErrors.under18 && (
                    <span className="error text-red-500">{validationErrors.under18}</span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="address" className="mt-2 flex flex-row">
                    Address:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="address"
                    id="address"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {validationErrors.address && (
                    <span className="error text-red-500">{validationErrors.address}</span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="emergencyContactName" className="mt-2 flex flex-row">
                    Emergency Contact Name:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                  />
                  {validationErrors.emergencyContactName && (
                    <span className="error text-red-500">
                      {validationErrors.emergencyContactName}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="emergencyContactPhone" className="mt-2 flex flex-row">
                    Emergency Contact Phone:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    name="emergencyContactPhone"
                    value={formatPhoneNumber(formData.emergencyContactPhone)}
                    onChange={handleInputChange}
                  />
                  {validationErrors.emergencyContactPhone && (
                    <span className="error text-red-500">
                      {validationErrors.emergencyContactPhone}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="message" className="mt-2 flex flex-row">
                    Send a Message:<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    type="text"
                    id="message"
                    className="border-solid p-2 border-2 border-darkBlue md:w-64 h-[150px] md:h-[125px]"
                    name="message"
                    placeholder="Type here..."
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                  {validationErrors.message && (
                    <span className="error text-red-500">{validationErrors.message}</span>
                  )}
                </div>
              </div>
            </div>

            {showSecondPassengerForm && (
              <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
                <h2 className="text-xl md:ml-[85px]">Second Passenger Form</h2>
                <div>
                  <div className="flex-col flex">
                    <label htmlFor="firstNameSecondPassenger">First Name:</label>
                    <input
                      type="text"
                      id="firstNameSecondPassenger"
                      name="firstNameSecondPassenger"
                      value={formData.firstNameSecondPassenger}
                      onChange={handleInputChange}
                    />
                    {validationErrors.firstNameSecondPassenger && (
                      <span className="error">{validationErrors.firstNameSecondPassenger}</span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastNameSecondPassenger">Last Name:</label>
                    <input
                      type="text"
                      id="lastNameSecondPassenger"
                      name="lastNameSecondPassenger"
                      value={formData.lastNameSecondPassenger}
                      onChange={handleInputChange}
                    />
                    {validationErrors.lastNameSecondPassenger && (
                      <span className="error">{validationErrors.lastNameSecondPassenger}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        <div className="mt-4">
          <div>
            {isButtonVisible ? (
              <button
                className="mt-4 border-solid p-2 border-2 border-sky-500 w-[150px]"
                type="submit"
              >
                Next to Payment
              </button>
            ) : (
              <div>
                {loading ? (
                  // <p className="m-4">Loading...</p>
                  <div>
                    <Image
                      className=""
                      src="/images/tube-spinner.svg"
                      alt="loading"
                      width={50}
                      height={50}
                    />
                  </div>
                ) : (
                  <PayPalScriptProvider
                    options={{
                      intent: "capture",
                      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT,
                      "enable-funding": "venmo,card",
                      "disable-funding": "paylater",
                      "data-sdk-integration-source": "integrationbuilder_sc",
                    }}
                  >
                    <div className="App max-w-[750px] flex flex-col md:max-w-[256px] ">
                      <PayPalButtons
                        style={{
                          shape: "rect",
                          layout: "vertical",
                        }}
                        createOrder={async () => {
                          try {
                            const response = await fetch(`${serverUrl}/api/orders`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },

                              // use the "body" param to optionally pass additional order information
                              // like product ids and quantities
                              body: JSON.stringify({
                                cart: [
                                  {
                                    id: "Cruise Trip",
                                    quantity: "1",
                                  },
                                ],
                              }),
                            });

                            const orderData = await response.json();
                            // console.log(orderData);

                            if (orderData.id) {
                              return orderData.id;
                            } else {
                              const errorDetail = orderData?.details?.[0];
                              const errorMessage = errorDetail
                                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                : JSON.stringify(orderData);

                              throw new Error(errorMessage);
                            }
                          } catch (error) {
                            console.error(error);
                            setMessage(`Could not initiate PayPal Checkout...${error}`);
                          }
                        }}
                        onApprove={handlePayPalOnApprove}
                      />
                      <Message content={message} />
                    </div>
                  </PayPalScriptProvider>
                )}
              </div>
            )}
          </div>
        </div>

        {!showSecondPassengerForm && (
          <button
            className="border-solid p-2 border-2 border-sky-500 mt-1 w-32"
            onClick={handleAddSecondPassenger}
          >
            Add Second Passenger
          </button>
        )}
      </form>
    </section>
  );
};

export default CruiseForm;
