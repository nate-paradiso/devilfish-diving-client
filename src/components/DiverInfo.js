import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import LiabilityRelease from "./LiabilityRelease";
import axios from "axios";

const DiverInfo = ({ selectedDate, showDiverInfo, setIsSubmitted }) => {
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    address: "",
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

  // Function to handle form submission
  useEffect(() => {
    // get all data in form and return object
    function getFormData(form) {
      let elements = form.elements;
      let honeypot;

      let fields = Object.keys(elements)
        .filter(function (k) {
          if (elements[k].name === "honeypot") {
            honeypot = elements[k].value;
            return false;
          }
          return true;
        })
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

      let formData = {};
      fields.forEach(function (name) {
        let element = elements[name];

        // singular form elements just have one value
        formData[name] = element.value;

        // when our element has multiple items, get their values
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

      // add form-specific values into the data
      formData.formDataNameOrder = JSON.stringify(fields);
      formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
      formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

      return { data: formData, honeypot: honeypot };
    }

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

      if (formData.honeypot) {
        // If a honeypot field is filled, assume it was done so by a spam bot.
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return false;
      }

      // Basic form validation
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
        form.removeAttribute("data-submitting");
        submitButton.disabled = false;
        return;
      }
      if (!validatePhone(data.phone)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          phone: "Please enter a valid phone number.",
        }));
        form.removeAttribute("data-submitting");
        submitButton.disabled = false;
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
      if (!validateAddress(data.address)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          address: "Please enter a address.",
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
      if (!validateElectronicSignature(data.electronicSignature)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          electronicSignature: "Please enter a electronic signature name.",
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

      // endpoint to send form data to the back end
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

      let url = form.action;
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          form.removeAttribute("data-submitting"); // Release the form from submitting state
          submitButton.disabled = false; // Re-enable the submit button

          if (xhr.status === 200) {
            console.log("Form submission successful.");
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              birthday: "",
              address: "",
              certifyingAgency: "",
              certificationNumber: "",
              danInsuranceNumber: "",
              emergencyContactName: "",
              emergencyContactPhone: "",
              divingDate: "",
              electronicSignature: "",
              electronicSignatureDate: "",
            });

            // Reset form data
            setValidationErrors({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              birthday: "",
              address: "",
              certifyingAgency: "",
              certificationNumber: "",
              danInsuranceNumber: "",
              emergencyContactName: "",
              emergencyContactPhone: "",
              divingDate: "",
              electronicSignature: "",
              electronicSignatureDate: "",
            });

            //Reset validation errors
            setIsSubmitted(true); //set submitted state to true
            form.reset(); //reset form
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

    function validateFirstName(firstName) {
      return (firstName ?? "").trim() !== ""; // Check if the name is not empty
    }

    function validateLastName(lastName) {
      return lastName.trim() !== ""; // Check if the name is not empty
    }

    function validateEmail(email) {
      // Check if the email has a valid format
      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    function validatePhone(phone) {
      return phone.trim() !== ""; // Check if the name is not empty
    }

    function validateBirthday(birthday) {
      // Check if the birthday is a valid date
      return !isNaN(Date.parse(birthday));
    }
    function validateAddress(address) {
      return address.trim() !== ""; // Check if the name is not empty
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
      // Check if the birthday is a valid date
      return !isNaN(Date.parse(divingDate));
    }
    function validateElectronicSignature(electronicSignature) {
      return (electronicSignature ?? "").trim() !== ""; // Check if the name is not empty
    }
    function validateElectronicSignatureDate(electronicSignatureDate) {
      // Check if the signature date is a valid date
      return !isNaN(Date.parse(electronicSignatureDate));
    }

    // bind to the submit event of our form
    let forms = document.querySelectorAll("form.gform");
    for (let i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }, []); // Empty dependency array ensures this runs once after initial render

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

  return (
    <section className="max-w-[1200px] w-full">
      {" "}
      <form
        className="gform "
        // onSubmit={handleSubmit}
        method="POST"
        data-email="example@gmail.com"
        action="https://script.google.com/macros/s/AKfycbxn1unr4NE8TQ3_P9sD-rf_jNtqZEjxONZHV4qO_3ILU6iq5r88oFK5JZultmoeIgzUng/exec"
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
                <span className="text-red-500 ">{validationErrors.firstName}</span>
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
                <span className="text-red-500">{validationErrors.lastName}</span>
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
                <span className="text-red-500">{validationErrors.email}</span>
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
                <span className="text-red-500">{validationErrors.phone}</span>
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
                <span className="text-red-500">{validationErrors.birthday}</span>
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
                <span className="text-red-500">{validationErrors.address}</span>
              )}
            </div>
          </div>
          <div>
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
                <span className="text-red-500">{validationErrors.certifyingAgency}</span>
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
                <span className="contact__error-message">
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
                <span className="contact__error-message">
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
                <span className="contact__error-message">
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
                <span className="contact__error-message">
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
                value={formData.divingDate}
                onChange={handleInputChange}
              />
              {validationErrors.divingDate && (
                <span className="contact__error-message  ">{validationErrors.divingDate}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <LiabilityRelease formData={formData} />
          <div className="flex-col flex">
            <p>
              By typing your name below you are electronically signing, you acknowledge that you
              have read and understand the terms of the liability waiver.
              <br />
            </p>
            <label htmlFor="electronicSignature" className="mt-2 flex flex-row">
              Electronic Signature: <span className="text-red-500">*</span>
            </label>
            <input
              id="electronicSignature"
              className="border-solid p-2  border-2 border-darkBlue  md:w-64  w-full h-[46px]  "
              type="text"
              name="electronicSignature"
              value={formData.electronicSignature}
              onChange={handleInputChange}
            />
            {validationErrors.electronicSignature && (
              <span className="contact__error-message  ">
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
              <span className="contact__error-message  ">
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
                Submit and Pay
              </button>
            ) : (
              <Image
                className="contact__tube-spinner"
                src="/images/tube-spinner.svg"
                alt="loading icon"
                width={50}
                height={50}
              />
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default DiverInfo;
