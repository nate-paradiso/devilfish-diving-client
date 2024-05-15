import React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import LiabilityRelease from "./LiabilityRelease";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Renders errors or successful transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}
const DiverInfo = ({ selectedDate, setIsSubmitted, eventTitle }) => {
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
    lastDive: "",
    certifyingAgency: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: selectedDate,
    message: "",
    electronicSignature: "",
    electronicParentSignature: "",
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
    lastDive: "",
    certifyingAgency: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: "",
    message: "",
    electronicSignature: "",
    electronicParentSignature: "",
    electronicSignatureDate: "",
  });
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State to control button visibility
  const [isFormVisible, setIsFormVisible] = useState(true); // State to control button visibility
  const [formDataOutside, setFormDataOutside] = useState({}); // State to control button visibility
  const [formOutside, setFormOutside] = useState({}); // State to control button visibility

  // Format the selectedDate to type=date for the form

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

  // Function to handle form data outside of handleFormSubmit
  const handleFormSubmitData = (formData, form) => {
    // Store or process the form data as needed
    setFormDataOutside(formData);
    setFormOutside(form);
  };

  //Handle Paypal approval
  // Function to handle form submission
  const handleFormSubmit = event => {
    event.preventDefault();

    let form = event.target;

    // Check if the form is already submitting
    if (form.getAttribute("data-submitting") === "true") {
      return;
    }

    form.setAttribute("data-submitting", "true"); // Mark the form as submitting

    let submitButton = form.querySelector("button[type=submit]");
    submitButton.disabled = true; // Disable the submit button

    let formData = getFormData(form);
    let data = formData.data;

    // Pass data to another function
    handleFormSubmitData(formData, form);

    // Basic form field validation
    if (!validateFirstName(data.firstName)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        firstName: "Please enter a valid first name.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateLastName(data.lastName)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        lastName: "Please enter a valid last name.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateEmail(data.email)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validatePhone(data.phone)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        phone: "Please enter a valid phone number.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateBirthday(data.birthday)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        birthday: "Please enter a birthday.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateUnder18(data.under18)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        under18: "Please enter yes or no.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateAddress(data.address)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: "Please enter a address.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateLastDive(data.lastDive)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        lastDive: "Please enter your last diving date.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateCertifyingAgency(data.certifyingAgency)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        certifyingAgency: "Please enter a certification agency.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateCertificationNumber(data.certificationNumber)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        certificationNumber: "Please enter a certification number.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateDanInsuranceNumber(data.danInsuranceNumber)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        danInsuranceNumber: "Please enter a DAN insurance number.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateEmergencyContactName(data.emergencyContactName)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactName: "Please enter an emergency contact name.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateDivingDate(data.divingDate)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        divingDate: "Please enter the diving date.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateEmergencyContactPhone(data.emergencyContactPhone)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactPhone: "Please enter an emergency contact phone number.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateMessage(data.message)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        message: "Please enter a message.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }

    if (!validateElectronicSignature(data.electronicSignature)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicSignature: "Please enter a electronic signature name.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateElectronicParentSignature(data.electronicParentSignature)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicParentSignature:
          "Please enter a Parent or Legal Guardian electronic signature name.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateElectronicSignatureDate(data.electronicSignatureDate)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicSignatureDate: "Please a valid date.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    setIsButtonVisible(false);
    setIsFormVisible(false);
    setLoading(false);

    function validateFirstName(firstName) {
      return (firstName ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateLastName(lastName) {
      return lastName.trim() !== ""; // Check if the name is not empty
    }
    function validateEmail(email) {
      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email); // Check if the email has a valid format
    }
    function validatePhone(phone) {
      return phone.trim() !== ""; // Check if the name is not empty
    }
    function validateBirthday(birthday) {
      return !isNaN(Date.parse(birthday)); // Check if the birthday is a valid date
    }
    function validateUnder18(under18) {
      return under18 !== ""; // Check if the yes or no is not empty
    }
    function validateAddress(address) {
      return address.trim() !== ""; // Check if the address is not empty
    }
    function validateLastDive(lastDive) {
      return !isNaN(Date.parse(lastDive)); // Check if the last dive is a valid date
    }
    function validateCertifyingAgency(certifyingAgency) {
      return certifyingAgency.trim() !== ""; // Check if the name is not empty
    }
    function validateCertificationNumber(certificationNumber) {
      return certificationNumber.trim() !== ""; // Check if the name is not empty
    }
    function validateDanInsuranceNumber(danInsuranceNumber) {
      return danInsuranceNumber.trim() !== ""; // Check if the name is not empty
    }
    function validateEmergencyContactName(emergencyContactName) {
      return emergencyContactName.trim() !== ""; // Check if the name is not empty
    }
    function validateMessage(message) {
      return message.trim() !== ""; // Check if the message is not empty
    }
    function validateEmergencyContactPhone(emergencyContactPhone) {
      return emergencyContactPhone.trim() !== ""; // Check if the name is not empty
    }
    function validateDivingDate(divingDate) {
      return !isNaN(Date.parse(divingDate)); // Check if the diving date is a valid date
    }
    function validateElectronicSignature(electronicSignature) {
      return (electronicSignature ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateElectronicParentSignature(electronicParentSignature) {
      return (electronicParentSignature ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateElectronicSignatureDate(electronicSignatureDate) {
      return !isNaN(Date.parse(electronicSignatureDate)); // Check if the signature date is a valid date
    }
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
            lastDive: "",
            certifyingAgency: "",
            certificationNumber: "",
            danInsuranceNumber: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
            divingDate: "",
            message: "",
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
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }, [isPayPalSuccessful]);

  // Define function to update Calendar from Dive to 1 Dive Seat
  const upDateCalendar1Seat = async formData => {
    try {
      const response = await axios.patch(`${serverUrl}/api/update-calendar-1seat`, {
        formData,
      });
      console.log(
        "Diving date sent to the backend to update calendar to (1 Dive Seat)",
        response.data,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error sending diving date to backend to update calendar to (1 Dive Seat):",
        error,
      );
      throw error;
    }
  };

  // Define function to update Calendar from 1 Dive Seat to Booked
  const upDateCalendarBooked = async formData => {
    try {
      const response = await axios.patch(`${serverUrl}/api/update-calendar-booked`, {
        formData,
      });
      // console.log(formData);
      console.log("Diving date sent to the backend to update calendar to (booked)", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending diving date to backend to update calendar to (booked):", error);
      throw error;
    }
  };

  // Define function to send email
  const sendEmail = async formData => {
    try {
      const response = await axios.post(`${serverUrl}/api/send-email`, { formData });
      console.log("Form data sent to the backend for email", response.data); // Log the response from the backend
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error("Error sending form data to backend for email:", error);
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
        if (eventTitle === "1 Dive Seat") {
          upDateCalendarBooked(formData);
        } else {
          upDateCalendar1Seat(formData);
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
  // Function to handle input changes in the form fields
  const handleInputChange = e => {
    const { name, value } = e.target;

    // Update the formData state for all input fields
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear validation error when user types in the input field
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: "",
    }));
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

  // Paypal get client id for payment
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
        className="gform "
        method="POST"
        data-email="example@gmail.com"
        action="https://script.google.com/macros/s/AKfycbx8TRKTZ22mPpYJ0sNgBEmM-NLEwnvIAHn3clbkiztEyR0sg5UXZmM7R3YME9k3MT7_7w/exec"
      >
        {isFormVisible ? (
          <div>
            <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
              <div>
                <div className="flex-col flex">
                  <label htmlFor="divingDate" className="mt-2 flex flex-row">
                    Diving Date: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="divingDate"
                    className="border-solid p-2 font-extrabold border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    type="date"
                    name="divingDate"
                    value={formatDateForHTMLInput(formData.divingDate)}
                    onChange={handleInputChange}
                  />
                  {validationErrors.divingDate && (
                    <span
                      ref={el => (errorRefs.current.divingDate = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.divingDate}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="firstName " className="mt-2 flex flex-row">
                    First Name: <span className="text-red-500 ">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border-solid p-2  border-2 border-darkBlue   md:w-64  w-full h-[46px] "
                  />
                  {validationErrors.firstName && (
                    <span ref={el => (errorRefs.current.firstName = el)} className="text-red-500">
                      {validationErrors.firstName}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="lastName " className="mt-2 flex flex-row">
                    Last Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                  />
                  {validationErrors.lastName && (
                    <span ref={el => (errorRefs.current.lastName = el)} className="text-red-500">
                      {validationErrors.lastName}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="email" className="mt-2 flex flex-row">
                    Email: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {validationErrors.email && (
                    <span ref={el => (errorRefs.current.email = el)} className="text-red-500">
                      {validationErrors.email}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="phone" className="mt-2 flex flex-row">
                    Phone: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="tel"
                    name="phone"
                    value={formatPhoneNumber(formData.phone)}
                    onChange={handleInputChange}
                  />
                  {validationErrors.phone && (
                    <span ref={el => (errorRefs.current.phone = el)} className="text-red-500">
                      {validationErrors.phone}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="birthday" className="mt-2 flex flex-row">
                    Birthday: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="birthday"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                  />
                  {validationErrors.birthday && (
                    <span ref={el => (errorRefs.current.birthday = el)} className="text-red-500">
                      {validationErrors.birthday}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="under18" className="mt-2 flex flex-row">
                    Are you under 18?
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="under18"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    name="under18"
                    value={formData.under18}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>{" "}
                  {validationErrors.under18 && (
                    <span ref={el => (errorRefs.current.under18 = el)} className="text-red-500">
                      {validationErrors.under18}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="address" className="mt-2 flex flex-row">
                    Address: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="address"
                    name="address"
                    value={formatAddress(formData.address)}
                    onChange={handleInputChange}
                  />
                  {validationErrors.address && (
                    <span ref={el => (errorRefs.current.address = el)} className="text-red-500">
                      {validationErrors.address}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex-col flex">
                  <label htmlFor="lastDive" className="mt-2 flex flex-row">
                    Date of Last Dive: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastDive"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="date"
                    name="lastDive"
                    value={formData.lastDive}
                    onChange={handleInputChange}
                  />
                  {validationErrors.lastDive && (
                    <span ref={el => (errorRefs.current.lastDive = el)} className="text-red-500">
                      {validationErrors.lastDive}
                    </span>
                  )}
                </div>

                <div className="flex-col flex">
                  <label htmlFor="certifyingAgency" className="mt-2 flex flex-row">
                    Certifying Agency: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="certifyingAgency"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="text"
                    name="certifyingAgency"
                    value={formData.certifyingAgency}
                    onChange={handleInputChange}
                  />
                  {validationErrors.certifyingAgency && (
                    <span
                      ref={el => (errorRefs.current.certifyingAgency = el)}
                      className="text-red-500"
                    >
                      {validationErrors.certifyingAgency}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="certificationNumber" className="mt-2 flex flex-row">
                    Certification Number: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="certificationNumber"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                    type="text"
                    name="certificationNumber"
                    value={formData.certificationNumber}
                    onChange={handleInputChange}
                  />
                  {validationErrors.certificationNumber && (
                    <span
                      ref={el => (errorRefs.current.certificationNumber = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.certificationNumber}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="danInsuranceNumber" className="mt-2 flex flex-row">
                    DAN Insurance Number: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="danInsuranceNumber"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    type="text"
                    placeholder="Enter N/A if none"
                    name="danInsuranceNumber"
                    value={formData.danInsuranceNumber}
                    onChange={handleInputChange}
                  />
                  {validationErrors.danInsuranceNumber && (
                    <span
                      ref={el => (errorRefs.current.danInsuranceNumber = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.danInsuranceNumber}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="emergencyContactName" className="mt-2 flex flex-row">
                    Emergency Contact Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emergencyContactName"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]   "
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                  />
                  {validationErrors.emergencyContactName && (
                    <span
                      ref={el => (errorRefs.current.emergencyContactName = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.emergencyContactName}
                    </span>
                  )}
                </div>
                <div className="flex-col flex">
                  <label htmlFor="emergencyContactPhone" className="mt-2 flex flex-row">
                    Emergency Contact Phone: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emergencyContactPhone"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]    "
                    type="tel"
                    name="emergencyContactPhone"
                    value={formatPhoneNumber(formData.emergencyContactPhone)}
                    onChange={handleInputChange}
                  />
                  {validationErrors.emergencyContactPhone && (
                    <span
                      ref={el => (errorRefs.current.emergencyContactPhone = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.emergencyContactPhone}
                    </span>
                  )}
                </div>

                <div className="flex-col flex">
                  <label htmlFor="message" className="mt-2 flex flex-row">
                    Send a Message: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    className="border-solid p-2 pb-[100px] border-2 border-darkBlue md:w-64 min-h-[150px]"
                    type="text"
                    name="message"
                    placeholder="Type here..."
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                  {validationErrors.message && (
                    <span
                      ref={el => (errorRefs.current.message = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <LiabilityRelease formData={formData} />
              <div className="flex-col flex">
                <p>
                  By typing your name below you are electronically signing, you acknowledge that you
                  have read, understand, and agree to the terms of the Liability Release and
                  Assumption of Risk Agreement.
                  <br />
                </p>
                <div className="flex flex-col">
                  {" "}
                  <label htmlFor="electronicSignature" className="mt-2 flex flex-row">
                    Diver Electronic Signature: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="electronicSignature"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    type="name"
                    name="electronicSignature"
                    value={formData.electronicSignature}
                    onChange={handleInputChange}
                  />
                  {validationErrors.electronicSignature && (
                    <span
                      ref={el => (errorRefs.current.electronicSignature = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.electronicSignature}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  {" "}
                  <label htmlFor="electronicParentSignature" className="mt-2 flex flex-row">
                    Parent or Legal Guardian Electronic Signature:{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="electronicParentSignature"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                    type="name"
                    placeholder="Enter N/A if over 18"
                    name="electronicParentSignature"
                    value={formData.electronicParentSignature}
                    onChange={handleInputChange}
                  />
                  {validationErrors.electronicParentSignature && (
                    <span
                      ref={el => (errorRefs.current.electronicParentSignature = el)}
                      className="contact__error-message"
                    >
                      {validationErrors.electronicParentSignature}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-col flex">
                <label htmlFor="electronicSignatureDate" className="mt-2 flex flex-row">
                  Today&rsquo;s Signature Date: <span className="text-red-500">*</span>
                </label>
                <input
                  id="electronicSignatureDate"
                  className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                  type="date"
                  name="electronicSignatureDate"
                  value={formData.electronicSignatureDate}
                  onChange={handleInputChange}
                />
                {validationErrors.electronicSignatureDate && (
                  <span
                    ref={el => (errorRefs.current.electronicSignatureDate = el)}
                    className="contact__error-message"
                  >
                    {validationErrors.electronicSignatureDate}
                  </span>
                )}
              </div>
            </div>
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
                onChange={handleInputChange}
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
                                    id: "Dive Trip",
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
      </form>
    </section>
  );
};

export default DiverInfo;
