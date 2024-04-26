import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const DiverInfo = () => {
  const router = useRouter();
  const { date } = router.query;
  console.log("from calendar", date);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: date,
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    certificationNumber: "",
    danInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    divingDate: date || "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State to control button visibility

  // Function to handle form field changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (date) {
      setFormData(prevState => ({
        ...prevState,
        divingDate: date,
      }));
    }
  }, [date]);

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

      if (!validateMessage(data.message)) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          message: "Please enter a message.",
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

    function validateMessage(message) {
      return message.trim() !== ""; // Check if the message is not empty
    }

    // bind to the submit event of our form
    let forms = document.querySelectorAll("form.gform");
    for (let i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }, []); // Empty dependency array ensures this runs once after initial render

  return (
    <section className="max-w-[800px] mx-auto">
      {" "}
      <form
        className="gform "
        method="POST"
        data-email="example@gmail.com"
        action="https://script.google.com/macros/s/AKfycbyKtArGioofU_EUBp2bfM8L9GxFv2TVhLCs27pCwzq9Pqz1hVZkSysoj8vRFP6YzUBOow/exec"
      >
        <div className=" m-2 flex justify-center flex-col md:flex-row">
          <div className="m-2">
            <h2 className="text-xl">Diver 1</h2>
            <label className=" mt-2 flex flex-col  ">
              Diver 1 First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border-solid p-2  border-2 border-darkBlue   w-full"
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 1 Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border-solid p-2  border-2 border-darkBlue  w-full"
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 1 Email:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 1 Certification Number:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full"
                type="text"
                name="certificationNumber"
                value={formData.certificationNumber}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 1 DAN Insurance Number:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="text"
                name="danInsuranceNumber"
                value={formData.danInsuranceNumber}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 1 Emergency Contact Name:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 1 Emergency Contact Phone:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="text"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="m-2">
            <h2 className="text-xl">Diver 2</h2>
            <label className="mt-2 flex flex-col">
              Diver 2 First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border-solid p-2  border-2 border-darkBlue  w-full"
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 2 Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border-solid p-2  border-2 border-darkBlue  w-full"
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 2 Email:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 2 Certification Number:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full"
                type="text"
                name="certificationNumber"
                value={formData.certificationNumber}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 2 DAN Insurance Number:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="text"
                name="danInsuranceNumber"
                value={formData.danInsuranceNumber}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 2 Emergency Contact Name:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diver 2 Emergency Contact Phone:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="text"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />
            </label>
            <label className="mt-2 flex flex-col">
              {" "}
              Diving Date:
              <input
                className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                type="date"
                name="divingDate"
                value={formData.divingDate}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <button className="m-4 border-solid p-2 border-2 border-sky-500 mt-1 w-20">
            <Link href="/Calendar">Back</Link>
          </button>
          <Link href="">
            <button className="m-4 border-solid p-2 border-2 border-sky-500 mt-1 w-20">Next</button>
          </Link>
        </div>
      </form>
    </section>
  );
};

export default DiverInfo;
