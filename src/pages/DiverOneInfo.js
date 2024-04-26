import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const DiverOneInfo = () => {
  const router = useRouter();
  const { date } = router.query;
  console.log("from calendar", date);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    address: "",
    certifyingAgency: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: date,
  });

  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    address: "",
    certifyingAgency: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
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

    function handleFormSubmit(event) {
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
      if (!validateFirstName(data.name)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          name: "Please enter a valid first name.",
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

      if (!validateBirthday(data.birthday)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter a birthday.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateAddress(data.address)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter a address.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateCertifyingAgency(data.certifyingAgency)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter a certification agency.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateCertificationNumber(data.certificationNumber)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter a certification number.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateDanInsuranceNumber(data.danInsuranceNumber)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter a DAN insurance number.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateEmergencyContactName(data.emergencyContactName)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter an emergency contact name.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateDivingDate(data.divingDate)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter the diving date.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }
      if (!validateEmergencyContactPhone(data.emergencyContactPhone)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter an emergency contact phone number.",
        }));
        form.removeAttribute("data-submitting"); // Release the form from submitting state
        submitButton.disabled = false; // Re-enable the submit button
        return;
      }

      setIsButtonVisible(false);

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
              birthday: "",
              address: "",
              certifyingAgency: "",
              certificationNumber: "",
              danInsuranceNumber: "",
              emergencyContactName: "",
              emergencyContactPhone: "",
              divingDate: "",
            }); // Reset form data
            setValidationErrors({
              firstName: "",
              lastName: "",
              email: "",
              birthday: "",
              address: "",
              certifyingAgency: "",
              certificationNumber: "",
              danInsuranceNumber: "",
              emergencyContactName: "",
              emergencyContactPhone: "",
              divingDate: "",
            }); //Reset validation erros
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
    }

    function validateFirstName(name) {
      return (name ?? "").trim() !== ""; // Check if the name is not empty
    }

    function validateLastName(lastName) {
      return lastName.trim() !== ""; // Check if the name is not empty
    }

    function validateEmail(email) {
      // Check if the email has a valid format
      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function validateBirthday(birthday) {
      return birthday.trim() !== ""; // Check if the message is not empty
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
      return divingDate.trim() !== ""; // Check if the name is not empty
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
    if (date) {
      setFormData(prevState => ({
        ...prevState,
        divingDate: date,
      }));
    }
  }, [date]);

  return (
    <section className="max-w-[800px] mx-auto">
      {" "}
      <form
        className="gform "
        method="POST"
        data-email="example@gmail.com"
        action="https://script.google.com/macros/s/AKfycbyKtArGioofU_EUBp2bfM8L9GxFv2TVhLCs27pCwzq9Pqz1hVZkSysoj8vRFP6YzUBOow/exec"
      >
        {isSubmitted ? (
          <p className="contact__success">Thank you for your submission!</p>
        ) : (
          <>
            <div className=" m-2 flex justify-center flex-col md:flex-row">
              <div className="m-2">
                <h2 className="text-xl">Diver 1</h2>
                <label className=" mt-2 flex flex-col  ">Diver 1 First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border-solid p-2  border-2 border-darkBlue   w-full"
                />
                {validationErrors.firstName && (
                  <span className="text-red-500">{validationErrors.firstName}</span>
                )}
                <label className="mt-2 flex flex-col">Diver 1 Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                />
                {validationErrors.lastName && (
                  <span className="text-red-500">{validationErrors.lastName}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 1 Email:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {validationErrors.email && (
                  <span className="text-red-500">{validationErrors.email}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 1 Birthday:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                />
                {validationErrors.birthday && (
                  <span className="text-red-500">{validationErrors.birthday}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 1 Address:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {validationErrors.address && (
                  <span className="text-red-500">{validationErrors.address}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 1 Certifying Agency:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="text"
                  name="certifyingAgency"
                  value={formData.certifyingAgency}
                  onChange={handleInputChange}
                />
                {validationErrors.certifyingAgency && (
                  <span className="text-red-500">{validationErrors.certifyingAgency}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 1 Certification Number:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
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

                <label className="mt-2 flex flex-col"> Diver 1 DAN Insurance Number:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
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

                <label className="mt-2 flex flex-col"> Diver 1 Emergency Contact Name:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
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

                <label className="mt-2 flex flex-col"> Diver 1 Emergency Contact Phone:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                  type="text"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                />
                {validationErrors.emergencyContactPhone && (
                  <span className="contact__error-message">
                    {validationErrors.emergencyContactPhone}
                  </span>
                )}

                <label className="mt-2 flex flex-col"> Diving Date:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
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

            <div className="m-4">
              <h2 className="text-xl">Liability Waiver</h2>
              <p>
                By signing below, I acknowledge that I have read and understood the terms of the
                liability waiver.
                <br />
                [Your liability waiver text goes here]
              </p>
              {/* <label className="mt-2 flex flex-col">
                Diver 1 Signature:
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                    onChange={handleInputChange}
                  className="border-solid p-2 border-2 border-darkBlue w-full "
                />
              </label> */}
            </div>

            <div className="flex flex-row justify-between">
              <button className="m-4 border-solid p-2 border-2 border-sky-500 mt-1 w-20">
                <Link href="/Calendar">Back</Link>
              </button>
              <div>
                {isButtonVisible ? (
                  <button
                    className="m-4 border-solid p-2 border-2 border-sky-500 mt-1"
                    type="submit"
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
          </>
        )}
      </form>
    </section>
  );
};

export default DiverOneInfo;
