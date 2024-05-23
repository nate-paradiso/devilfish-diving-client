import React from "react";
import { useState, useEffect, useRef } from "react";
import LiabilityReleaseCruise from "./LiabilityReleaseCruise";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Image from "next/image";
import { cartItems } from "./PayPalCart";

// Renders errors or successful transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}

const CruiseForm = ({ selectedDate, setIsSubmitted, eventTitle }) => {
  const [showSecondPassengerForm, setShowSecondPassengerForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const errorRefs = useRef({});
  const [isPayPalSuccessful, setIsPayPalSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setIsButtonVisible(false);
      setIsFormVisible(false);
      setLoading(true);
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
    if (formData.electronicSignature.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicSignature: "Please type your full name.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicSignature: "",
      }));
    }
    if (formData.electronicParentSignature.trim() === "") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicParentSignature: "Please type a parent or legal guardian full name.",
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicParentSignature: "",
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
      if (!formData.emailSecondPassenger.includes("@")) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          emailSecondPassenger: "Please enter a valid email for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          emailSecondPassenger: "",
        }));
      }

      if (formData.phoneSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          phoneSecondPassenger: "Please enter a phone number for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          phoneSecondPassenger: "",
        }));
      }

      if (formData.birthdaySecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          birthdaySecondPassenger: "Please enter a birthday for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          birthdaySecondPassenger: "",
        }));
      }

      if (formData.under18SecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          under18SecondPassenger: "Please select if the second passenger is under 18.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          under18SecondPassenger: "",
        }));
      }

      if (formData.addressSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          addressSecondPassenger: "Please enter an address for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          addressSecondPassenger: "",
        }));
      }

      if (formData.emergencyContactNameSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          emergencyContactNameSecondPassenger:
            "Please enter an emergency contact name for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          emergencyContactNameSecondPassenger: "",
        }));
      }

      if (formData.emergencyContactPhoneSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          emergencyContactPhoneSecondPassenger:
            "Please enter an emergency contact phone for the second passenger.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          emergencyContactPhoneSecondPassenger: "",
        }));
      }

      if (formData.electronicSignatureSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          electronicSignatureSecondPassenger: "Please type the second passenger full name.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          electronicSignatureSecondPassenger: "",
        }));
      }
      if (formData.electronicParentSignatureSecondPassenger.trim() === "") {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          electronicParentSignatureSecondPassenger:
            "Please type the second passengers parent or legal guardian full name.",
        }));
        isValid = false;
      } else {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          electronicParentSignatureSecondPassenger: "",
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

  const createOrder = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          cart: cartItems,
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

  // Use a timeout to hide the spinner after a certain period
  useEffect(() => {
    if (!isButtonVisible) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the timeout duration as needed (5000ms = 5 seconds)

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [isButtonVisible]);

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
            <div className="text-center">
              {!showSecondPassengerForm && (
                <button
                  className="border-solid p-2 border-2 border-sky-500 mb-2 w-32"
                  onClick={handleAddSecondPassenger}
                >
                  Add Second Passenger
                </button>
              )}
            </div>
            {/* First passenger form inputs */}

            <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
              <div>
                <div className="flex-col flex">
                  <label htmlFor="divingDate" className="mt-2 flex flex-row">
                    Cruise Date:
                  </label>
                  <input
                    id="divingDate"
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
                    className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
                <div className="flex-col flex ">
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
                    <span className="error text-red-500 whitespace-wrap">
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
              <div>
                <div className="text-center">
                  <h2 className="text-xl   mt-12">Second Passenger Form</h2>
                </div>
                <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
                  <div>
                    <div className="flex-col flex">
                      <label htmlFor="firstNameSecondPassenger" className="mt-2 flex flex-row">
                        First Name: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="border-solid p-2  border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        id="firstNameSecondPassenger"
                        name="firstNameSecondPassenger"
                        value={formData.firstNameSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.firstNameSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.firstNameSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="lastNameSecondPassenger" className="mt-2 flex flex-row">
                        Last Name:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="border-solid p-2  border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        id="lastNameSecondPassenger"
                        name="lastNameSecondPassenger"
                        value={formData.lastNameSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.lastNameSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.lastNameSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="emailSecondPassenger" className="mt-2 flex flex-row">
                        Email:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className="border-solid p-2  border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        id="emailSecondPassenger"
                        name="emailSecondPassenger"
                        value={formData.emailSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.emailSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.emailSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="phoneSecondPassenger" className="mt-2 flex flex-row">
                        Phone:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="border-solid p-2  border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        id="phoneSecondPassenger"
                        name="phoneSecondPassenger"
                        value={formatPhoneNumber(formData.phoneSecondPassenger)}
                        onChange={handleInputChange}
                      />
                      {validationErrors.phoneSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.phoneSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="birthdaySecondPassenger" className="mt-2 flex flex-row">
                        Birthday:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="border-solid p-2  border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        id="birthdaySecondPassenger"
                        name="birthdaySecondPassenger"
                        value={formData.birthdaySecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.birthdaySecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.birthdaySecondPassenger}
                        </span>
                      )}
                    </div>
                    {/* second column */}
                  </div>
                  <div>
                    <div className="flex-col flex">
                      <label htmlFor="under18SecondPassenger" className="mt-2 flex flex-row">
                        Are you under 18?<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="under18SecondPassenger"
                        className="border-solid p-2 border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        name="under18SecondPassenger"
                        value={formData.under18SecondPassenger}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {validationErrors.under18SecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.under18SecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="addressSecondPassenger" className="mt-2 flex flex-row">
                        Address:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="address"
                        id="addressSecondPassenger"
                        className="border-solid p-2 border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        name="addressSecondPassenger"
                        value={formData.addressSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.addressSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.addressSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label
                        htmlFor="emergencyContactNameSecondPassenger"
                        className="mt-2 flex flex-row"
                      >
                        Emergency Contact Name:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="emergencyContactNameSecondPassenger"
                        className="border-solid p-2 border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        name="emergencyContactNameSecondPassenger"
                        value={formData.emergencyContactNameSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.emergencyContactNameSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.emergencyContactNameSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label
                        htmlFor="emergencyContactPhoneSecondPassenger"
                        className="mt-2 flex flex-row"
                      >
                        Emergency Contact Phone:<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="emergencyContactPhoneSecondPassenger"
                        className="border-solid p-2 border-2 border-darkBlue md:w-64 w-full h-[46px]"
                        name="emergencyContactPhoneSecondPassenger"
                        value={formatPhoneNumber(formData.emergencyContactPhoneSecondPassenger)}
                        onChange={handleInputChange}
                      />
                      {validationErrors.emergencyContactPhoneSecondPassenger && (
                        <span className="error text-red-500">
                          {validationErrors.emergencyContactPhoneSecondPassenger}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <LiabilityReleaseCruise
                formData={formData}
                showSecondPassengerForm={showSecondPassengerForm}
              />
              <div className="flex-col flex">
                <p>
                  By typing your name below you are electronically signing, you acknowledge that you
                  have read, understand, and agree to the terms of the Liability Release and
                  Assumption of Risk Agreement.
                  <br />
                </p>
                <div className="flex flex-col">
                  <label htmlFor="electronicSignature" className="mt-2 flex flex-row">
                    Passenger Electronic Signature: <span className="text-red-500">*</span>
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
                  <label
                    htmlFor="electronicParentSignature"
                    className="mt-2 flex flex-row md:w-[185px]"
                  >
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
                {showSecondPassengerForm && (
                  <div>
                    {" "}
                    <div className="flex flex-col">
                      <label
                        htmlFor="electronicSignatureSecondPassenger"
                        className="mt-2 flex flex-row md:w-[215px]"
                      >
                        Second Passenger Electronic Signature:
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="electronicSignatureSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                        type="name"
                        name="electronicSignatureSecondPassenger"
                        value={formData.electronicSignatureSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.electronicSignatureSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.electronicSignatureSecondPassenger = el)}
                          className="contact__error-message"
                        >
                          {validationErrors.electronicSignatureSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="electronicParentSignatureSecondPassenger"
                        className="mt-2 flex flex-row md:w-[255px]"
                      >
                        Second Passenger Parent or Legal Guardian Electronic Signature:{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="electronicParentSignatureSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                        type="name"
                        placeholder="Enter N/A if over 18"
                        name="electronicParentSignatureSecondPassenger"
                        value={formData.electronicParentSignatureSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.electronicParentSignatureSecondPassenger && (
                        <span
                          ref={el =>
                            (errorRefs.current.electronicParentSignatureSecondPassenger = el)
                          }
                          className="contact__error-message"
                        >
                          {validationErrors.electronicParentSignatureSecondPassenger}
                        </span>
                      )}
                    </div>
                  </div>
                )}
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

        <div className="">
          <div>
            {isButtonVisible ? (
              <button className="mt-4 border-solid p-2 border-2 border-sky-500  w-32" type="submit">
                Next to Payment
              </button>
            ) : (
              <div>
                {loading ? (
                  <Image
                    className=""
                    src="/images/tube-spinner.svg"
                    alt="loading"
                    width={50}
                    height={50}
                  />
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
                        createOrder={createOrder}
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

export default CruiseForm;
