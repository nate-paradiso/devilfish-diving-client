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
      console.error("Error sending form data to backed for email:", error);
      throw error; // Throw the error to handle it in the calling code
    }
  };
  sendEmail();

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
}
