// This contact form was built following this tutorial https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server?tab=readme-ov-file

import React, { useState, useEffect } from "react";
import Image from "next/image";

const DiverInfoTest = ({ date }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    message: "",
    birthday: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State to control button visibility

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
      if (!validateName(data.name)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          name: "Please enter a valid name.",
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
          birthday: "Please enter a birthday.",
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
            setFormData({ name: "", lastName: "", email: "", message: "" }); // Reset form data
            setValidationErrors({ name: "", lastName: "", email: "", message: "" }); //Reset validation erros
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

    function validateName(name) {
      return name.trim() !== ""; // Check if the name is not empty
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
      // Check if the birthday is a valid date
      return !isNaN(Date.parse(birthday));
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

  return (
    <>
      <div className="container">
        <div className="contact">
          <form
            className="gform"
            method="POST"
            data-email="example@gmail.com"
            action="https://script.google.com/macros/s/AKfycbyKtArGioofU_EUBp2bfM8L9GxFv2TVhLCs27pCwzq9Pqz1hVZkSysoj8vRFP6YzUBOow/exec"
          >
            {isSubmitted ? (
              <p className="contact__success">Thank you for your submission!</p>
            ) : (
              <>
                <label htmlFor="name" className="contact__label">
                  First Name: <span className="contact__required">(required)</span>
                </label>
                <input
                  className="contact__input contact__input--darken"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {validationErrors.name && (
                  <span className="contact__error-message">{validationErrors.name}</span>
                )}
                <label htmlFor="lastName" className="contact__label">
                  Last Name: <span className="contact__required">(required)</span>
                </label>
                <input
                  className="contact__input contact__input--darken"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {validationErrors.lastName && (
                  <span className="contact__error-message">{validationErrors.lastName}</span>
                )}

                <label htmlFor="email" className="contact__label">
                  Email: <span className="contact__required">(required)</span>
                </label>
                <input
                  className="contact__input contact__input--darken"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {validationErrors.email && (
                  <span className="contact__error-message">{validationErrors.email}</span>
                )}

                <label htmlFor="birthday" className="contact__label">
                  Birthday: <span className="contact__required">(*)</span>
                </label>
                <input
                  className="contact__input contact__text-area contact__input--darken"
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                ></input>
                {validationErrors.birthday && (
                  <span className="contact__error-message">{validationErrors.birthday}</span>
                )}
                <div>
                  {isButtonVisible ? (
                    <button className="contact__button" type="submit">
                      Submit
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
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
export default DiverInfoTest;
