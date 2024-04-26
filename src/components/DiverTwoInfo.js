import React from "react";

const DiverTwoInfo = () => {
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
<h2 className="text-xl">Diver 2</h2>
                <label className=" mt-2 flex flex-col  ">Diver 2 First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border-solid p-2  border-2 border-darkBlue   w-full"
                  />
                {validationErrors.firstName && (
                    <span className="text-red-500">{validationErrors.firstName}</span>
                )}
                <label className="mt-2 flex flex-col">Diver 2 Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  />
                {validationErrors.lastName && (
                    <span className="text-red-500">{validationErrors.lastName}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 2 Email:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  />
                {validationErrors.email && (
                    <span className="text-red-500">{validationErrors.email}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 2 Birthday:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  />
                {validationErrors.birthday && (
                    <span className="text-red-500">{validationErrors.birthday}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 2 Address:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  />
                {validationErrors.address && (
                    <span className="text-red-500">{validationErrors.address}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 2 Certifying Agency:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="text"
                  name="certifyingAgency"
                  value={formData.certifyingAgency}
                  onChange={handleChange}
                  />
                {validationErrors.certifyingAgency && (
                    <span className="text-red-500">{validationErrors.certifyingAgency}</span>
                )}
                <label className="mt-2 flex flex-col"> Diver 2 Certification Number:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full"
                  type="text"
                  name="certificationNumber"
                  value={formData.certificationNumber}
                  onChange={handleChange}
                  />
                {validationErrors.certificationNumber && (
                    <span className="contact__error-message">
                    {validationErrors.certificationNumber}
                  </span>
                )}

                <label className="mt-2 flex flex-col"> Diver 2 DAN Insurance Number:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                  type="text"
                  name="danInsuranceNumber"
                  value={formData.danInsuranceNumber}
                  onChange={handleChange}
                  />
                {validationErrors.danInsuranceNumber && (
                    <span className="contact__error-message">
                    {validationErrors.danInsuranceNumber}
                  </span>
                )}

                <label className="mt-2 flex flex-col"> Diver 2 Emergency Contact Name:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  />
                {validationErrors.emergencyContactName && (
                    <span className="contact__error-message">
                    {validationErrors.emergencyContactName}
                  </span>
                )}

                <label className="mt-2 flex flex-col"> Diver 2 Emergency Contact Phone:</label>
                <input
                  className="border-solid p-2  border-2 border-darkBlue  w-full mb-2"
                  type="text"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  />
                {validationErrors.emergencyContactPhone && (
                    <span className="contact__error-message">
                    {validationErrors.emergencyContactPhone}
                  </span>
                )}
            <div className="m-4">
              <h2 className="text-xl">Liability Waiver</h2>
              <p>
                By signing below, I acknowledge that I have read and understood the terms of the
                liability waiver.
                <br />
                [Your liability waiver text goes here]
              </p>

                              <label className="mt-2 flex flex-col">
                Diver 2 Signature:
                <input
                  type="text"
                  name="secondDiverSignature"
                  value={formData.secondDiverSignature}
                  onChange={handleChange}
                  className="border-solid p-2 border-2 border-darkBlue w-full"
                />
              </label>
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
export default DiverTwoInfo;
