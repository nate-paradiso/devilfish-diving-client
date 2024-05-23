import React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import LiabilityReleaseCruise from "./LiabilityReleaseCruise";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Renders errors or successful transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}
const CruisePassengerInfo = ({ selectedDate, setIsSubmitted, eventTitle }) => {
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  const [secondPassenger, setSecondPassenger] = useState(false);
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

    // Validate second passenger's if the second passenger form is rendered
    if (!validateFirstNameSecondPassenger(data.firstNameSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        firstNameSecondPassenger: "Please enter a valid first name for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateLastNameSecondPassenger(data.lastNameSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        lastNameSecondPassenger: "Please enter a valid last name for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateEmailSecondPassenger(data.emailSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emailSecondPassenger: "Please enter a valid email for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validatePhoneSecondPassenger(data.phoneSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        phoneSecondPassenger: "Please enter a valid phone number for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateBirthdaySecondPassenger(data.birthdaySecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        birthdaySecondPassenger: "Please enter a valid birthday for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateUnder18SecondPassenger(data.under18SecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        under18SecondPassenger: "Please enter yes or no for second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateAddressSecondPassenger(data.addressSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        addressSecondPassenger: "Please enter a valid address for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateEmergencyContactNameSecondPassenger(data.emergencyContactNameSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactNameSecondPassenger:
          "Please enter a valid emergency contact name for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateEmergencyContactPhoneSecondPassenger(data.emergencyContactPhoneSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        emergencyContactPhoneSecondPassenger:
          "Please enter a valid emergency contact phone number for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (!validateElectronicSignatureSecondPassenger(data.electronicSignatureSecondPassenger)) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicSignatureSecondPassenger:
          "Please enter a electronic signature name for the second passenger.",
      }));
      form.removeAttribute("data-submitting"); // Release the form from submitting state
      submitButton.disabled = false; // Re-enable the submit button
      return;
    }
    if (
      !validateElectronicParentSignatureSecondPassenger(
        data.electronicParentSignatureSecondPassenger,
      )
    ) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        electronicParentSignatureSecondPassenger:
          "Please enter a Parent or Legal Guardian electronic signature name for the second passenger.",
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
    console.log(secondPassenger);

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
      return under18 === "Yes" || under18 === "No"; // Check if the value is either "yes" or "no"
    }
    function validateAddress(address) {
      return address.trim() !== ""; // Check if the address is not empty
    }
    function validateEmergencyContactName(emergencyContactName) {
      return emergencyContactName.trim() !== ""; // Check if the name is not empty
    }
    function validateEmergencyContactPhone(emergencyContactPhone) {
      return emergencyContactPhone.trim() !== ""; // Check if the name is not empty
    }
    function validateMessage(message) {
      return message.trim() !== ""; // Check if the message is not empty
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

    // Second passenger validation
    function validateFirstNameSecondPassenger(firstNameSecondPassenger) {
      return (firstNameSecondPassenger ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateLastNameSecondPassenger(lastNameSecondPassenger) {
      return lastNameSecondPassenger.trim() !== ""; // Check if the name is not empty
    }
    function validateEmailSecondPassenger(emailSecondPassenger) {
      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(emailSecondPassenger); // Check if the email has a valid format
    }
    function validatePhoneSecondPassenger(phoneSecondPassenger) {
      return phoneSecondPassenger.trim() !== ""; // Check if the name is not empty
    }
    function validateBirthdaySecondPassenger(birthdaySecondPassenger) {
      return !isNaN(Date.parse(birthdaySecondPassenger)); // Check if the birthday is a valid date
    }
    function validateUnder18SecondPassenger(under18SecondPassenger) {
      return under18SecondPassenger === "Yes" || under18SecondPassenger === "No"; // Check if the value is either "yes" or "no"
    }
    function validateAddressSecondPassenger(addressSecondPassenger) {
      return addressSecondPassenger.trim() !== ""; // Check if the address is not empty
    }
    function validateEmergencyContactNameSecondPassenger(emergencyContactNameSecondPassenger) {
      return emergencyContactNameSecondPassenger.trim() !== ""; // Check if the name is not empty
    }
    function validateEmergencyContactPhoneSecondPassenger(emergencyContactPhoneSecondPassenger) {
      return emergencyContactPhoneSecondPassenger.trim() !== ""; // Check if the name is not empty
    }
    function validateElectronicSignatureSecondPassenger(electronicSignatureSecondPassenger) {
      return (electronicSignatureSecondPassenger ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateElectronicParentSignatureSecondPassenger(
      electronicParentSignatureSecondPassenger,
    ) {
      return (electronicParentSignatureSecondPassenger ?? "").trim() !== ""; // Check if the name is not empty
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
      forms[i].addEventListener("submit", handleFormSubmit, false);
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

    // Log the updated value
    console.log(`Updated value of ${name}:`, value);
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
    <section className="max-w-[1200px] w-full ">
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
                    Cruise Date: <span className="text-red-500">*</span>
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
              </div>
              <div>
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
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
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
                    className="border-solid p-2 border-2 border-darkBlue md:w-64 h-[150px] md:h-[125px]"
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
                <br />
                <br />
              </div>
            </div>
            {/* <div className="flex justify-between mb-2 flex-row">
              <button
                className="border-solid p-2 border-2 border-sky-500 mt-1 w-32"
                onClick={handleSecondPassenger}
                type="button"
              >
                Add Second Passenger
              </button>
            </div> */}

            {/* {secondPassenger ? ( */}
            <div>
              <div>
                <h2 className="text-xl md:ml-[85px]">Second Passenger</h2>
                <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
                  <div>
                    <div className="flex-col flex">
                      <label htmlFor="firstNameSecondPassenger " className="mt-2 flex flex-row">
                        First Name: <span className="text-red-500 ">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstNameSecondPassenger"
                        name="firstNameSecondPassenger"
                        placeholder="Enter N/A if none"
                        value={formData.firstNameSecondPassenger}
                        onChange={handleInputChange}
                        className="border-solid p-2  border-2 border-darkBlue   md:w-64  w-full h-[46px] "
                      />
                      {validationErrors.firstNameSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.firstNameSecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.firstNameSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="lastNameSecondPassenger " className="mt-2 flex flex-row">
                        Last Name: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastNameSecondPassenger"
                        name="lastNameSecondPassenger"
                        placeholder="Enter N/A if none"
                        value={formData.lastNameSecondPassenger}
                        onChange={handleInputChange}
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                      />
                      {validationErrors.lastNameSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.lastNameSecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.lastNameSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="emailSecondPassenger" className="mt-2 flex flex-row">
                        Email: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="emailSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                        type="emailSecondPassenger"
                        name="emailSecondPassenger"
                        placeholder="Enter N/A if none"
                        value={formData.emailSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.emailSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.emailSecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.emailSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="phoneSecondPassenger" className="mt-2 flex flex-row">
                        Phone: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                        type="tel"
                        name="phoneSecondPassenger"
                        placeholder="Enter N/A if none"
                        value={formatPhoneNumber(formData.phoneSecondPassenger)}
                        onChange={handleInputChange}
                      />
                      {validationErrors.phoneSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.phoneSecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.phoneSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="birthdaySecondPassenger" className="mt-2 flex flex-row">
                        Birthday: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="birthdaySecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                        type="date"
                        name="birthdaySecondPassenger"
                        placeholder="Enter N/A if none"
                        value={formData.birthdaySecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.birthdaySecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.birthdaySecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.birthdaySecondPassenger}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex-col flex">
                      <label htmlFor="under18SecondPassenger" className="mt-2 flex flex-row">
                        Are you under 18?
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="under18SecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                        name="under18SecondPassenger"
                        placeholder="Enter N/A if none"
                        value={formData.under18SecondPassenger}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="">N/A</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>{" "}
                      {validationErrors.under18SecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.under18SecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.under18SecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label htmlFor="addressSecondPassenger" className="mt-2 flex flex-row">
                        Address: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="addressSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px] "
                        type="address"
                        placeholder="Enter N/A if none"
                        name="addressSecondPassenger"
                        value={formData.addressSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.addressSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.addressSecondPassenger = el)}
                          className="text-red-500"
                        >
                          {validationErrors.addressSecondPassenger}
                        </span>
                      )}
                    </div>

                    <div className="flex-col flex">
                      <label
                        htmlFor="emergencyContactNameSecondPassenger"
                        className="mt-2 flex flex-row"
                      >
                        Emergency Contact Name: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="emergencyContactNameSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]   "
                        type="text"
                        placeholder="Enter N/A if none"
                        name="emergencyContactNameSecondPassenger"
                        value={formData.emergencyContactNameSecondPassenger}
                        onChange={handleInputChange}
                      />
                      {validationErrors.emergencyContactNameSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.emergencyContactNameSecondPassenger = el)}
                          className="contact__error-message"
                        >
                          {validationErrors.emergencyContactNameSecondPassenger}
                        </span>
                      )}
                    </div>
                    <div className="flex-col flex">
                      <label
                        htmlFor="emergencyContactPhoneSecondPassenger"
                        className="mt-2 flex flex-row"
                      >
                        Emergency Contact Phone: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="emergencyContactPhoneSecondPassenger"
                        className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]    "
                        type="tel"
                        placeholder="Enter N/A if none"
                        name="emergencyContactPhoneSecondPassenger"
                        value={formatPhoneNumber(formData.emergencyContactPhoneSecondPassenger)}
                        onChange={handleInputChange}
                      />
                      {validationErrors.emergencyContactPhoneSecondPassenger && (
                        <span
                          ref={el => (errorRefs.current.emergencyContactPhoneSecondPassenger = el)}
                          className="contact__error-message"
                        >
                          {validationErrors.emergencyContactPhoneSecondPassenger}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ) : (
              ""
            )} */}

            <div className="mt-4">
              <LiabilityReleaseCruise formData={formData} secondPassenger={secondPassenger} />
              <div className="flex-col flex ">
                <p className="text-left">
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
                      placeholder="Enter N/A if none"
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
      </form>
    </section>
  );
};

export default CruisePassengerInfo;
