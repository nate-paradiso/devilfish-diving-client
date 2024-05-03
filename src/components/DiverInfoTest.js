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
  console.log("isPayPalSuccessful from top", isPayPalSuccessful);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    address: "",
    lastDive: "",
    certifyingAgency: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: selectedDate,
    electronicSignature: "",
    electronicSignatureDate: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    address: "",
    lastDive: "",
    certifyingAgency: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: "",
    electronicSignature: "",
    electronicSignatureDate: "",
  });
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State to control button visibility

  // Format the selectedDate to type=date for the form
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

  // Handle Paypal approval
  const handlePayPalApproval = async (data, actions) => {
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
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');

        setIsPayPalSuccessful(true);
        setMessage("Payment Successful. Thank you!");
        console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  // Function to validate form fields
  const validateForm = formData => {
    // Your validation logic here
    // Update validationErrors state accordingly

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
    function validateAddress(address) {
      return address.trim() !== ""; // Check if the name is not empty
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
    function validateEmergencyContactPhone(emergencyContactPhone) {
      return emergencyContactPhone.trim() !== ""; // Check if the name is not empty
    }
    function validateDivingDate(divingDate) {
      return !isNaN(Date.parse(divingDate)); // Check if the diving date is a valid date
    }
    function validateElectronicSignature(electronicSignature) {
      return (electronicSignature ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateElectronicSignatureDate(electronicSignatureDate) {
      return !isNaN(Date.parse(electronicSignatureDate)); // Check if the signature date is a valid date
    }

    return {
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      birthday: validateBirthday(formData.birthday),
      address: validateAddress(formData.address),
      lastDive: validateLastDive(formData.lastDive),
      certifyingAgency: validateCertifyingAgency(formData.certifyingAgency),
      certificationNumber: validateCertificationNumber(formData.certificationNumber),
      danInsuranceNumber: validateDanInsuranceNumber(formData.danInsuranceNumber),
      emergencyContactName: validateEmergencyContactName(formData.emergencyContactName),
      emergencyContactPhone: validateEmergencyContactPhone(formData.emergencyContactPhone),
      divingDate: validateDivingDate(formData.divingDate),
      electronicSignature: validateElectronicSignature(formData.electronicSignature),
      electronicSignatureDate: validateElectronicSignatureDate(formData.electronicSignatureDate),
    };
  };

  // Handle form submission
  const handleFormSubmit = async event => {
    event.preventDefault();

    const form = event.target;
    const formData = getFormData(form);

    // Validate form data
    const validationResults = validateForm(formData);

    // Check if all fields are valid
    const isFormValid = Object.values(validationResults).every(result => result);
    if (isFormValid) {
      const upDateCalendar1Spot = async formData => {
        try {
          const response = await axios.patch(`${serverUrl}/api/update-calendar-booked`, {
            formData,
          });
          console.log("Diving date sent to the backend to update calendar (1 spot)", response.data);
          return response.data;
        } catch (error) {
          console.error("Error sending diving date to backend to update calendar (1 spot):", error);
          throw error;
        }
      };
      upDateCalendar1Spot(formData);
    } else {
      // Endpoint to update Calendar from Available to 1 Spot Available
      const upDateCalendarBooked = async formData => {
        try {
          const response = await axios.patch(`${serverUrl}/api/update-calendar-1spot`, {
            formData,
          });
          console.log("Diving date sent to the backend to update calendar (booked)", response.data);
          return response.data;
        } catch (error) {
          console.error("Error sending diving date to backend to update calendar (booked):", error);
          throw error;
        }
      };
      upDateCalendarBooked(formData);

      // Endpoint to send form data to the back end and email user
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
      sendEmail(formData);
    }
  };

  // Function to handle input changes in the form fields
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
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

  return (
    <section className="max-w-[1200px] w-full">
      <form
        className="gform "
        method="POST"
        data-email="example@gmail.com"
        action="https://script.google.com/macros/s/AKfycbxy8OeqpLRSD9YJGRfvzWOtIWTS9LcEGsOgr6dIIBe6AHYD_i25ohhdjsPiy5QIL5e40w/exec"
      >
        <div className="  flex justify-center flex-col  md:flex-row md:justify-evenly ">
          <div>
            <div className="flex-col flex">
              <label htmlFor="firstName " className="mt-2 flex flex-row">
                Diver First Name: <span className="text-red-500 ">*</span>
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
                Diver Last Name: <span className="text-red-500">*</span>
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
                Diver Email: <span className="text-red-500">*</span>
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
                Diver Phone: <span className="text-red-500">*</span>
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
                Diver Birthday: <span className="text-red-500">*</span>
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
              <label htmlFor="address" className="mt-2 flex flex-row">
                Diver Address: <span className="text-red-500">*</span>
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
                Diver Certifying Agency: <span className="text-red-500">*</span>
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
                Diver Certification Number: <span className="text-red-500">*</span>
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
                Diver DAN Insurance Number: <span className="text-red-500">*</span>
              </label>
              <input
                id="danInsuranceNumber"
                className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
                type="text"
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
                Diver Emergency Contact Name: <span className="text-red-500">*</span>
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
                Diver Emergency Contact Phone: <span className="text-red-500">*</span>
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
              <label htmlFor="divingDate" className="mt-2 flex flex-row">
                Diving Date: <span className="text-red-500">*</span>
              </label>
              <input
                id="divingDate"
                className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
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
          </div>
        </div>

        <div className="mt-4">
          <LiabilityRelease formData={formData} />
          <div className="flex-col flex">
            <p>
              By typing your name below you are electronically signing, you acknowledge that you
              have read, understand, and agree to the terms of the Liability Release and Assumption
              of Risk Agreement.
              <br />
            </p>
            <label htmlFor="electronicSignature" className="mt-2 flex flex-row">
              Electronic Signature: <span className="text-red-500">*</span>
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
          <div className="flex-col flex">
            <label htmlFor="electronicSignatureDate" className="mt-2 flex flex-row">
              Signature Date: <span className="text-red-500">*</span>
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

        <div className="flex flex-row justify-between">
          <div>
            {isButtonVisible ? (
              <button
                className="mt-4 border-solid p-2 border-2 border-sky-500 "
                type="submit"
                onChange={handleInputChange}
              >
                Next
              </button>
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
                    onApprove={handlePayPalApproval}
                  />
                  <Message content={message} />
                </div>
              </PayPalScriptProvider>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div>
            {isPayPalSuccessful ? (
              <button
                className="mt-4 border-solid p-2 border-2 border-sky-500 "
                type="submit"
                onChange={handleInputChange}
              >
                Submit Form
              </button>
            ) : (
              <Image
                className="contact__tube-spinner"
                src="/images/Animation - arrow.gif"
                alt="loading icon"
                width={50}
                height={50}
              />
            )}
          </div>
        </div>
      </form>
      {/* {!isButtonVisible ? (
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
              onApprove={handlePayPalApproval}
            />
            <Message content={message} />
          </div>
        </PayPalScriptProvider>
      ) : (
        ""
      )} */}
    </section>
  );
};

export default DiverInfo;
