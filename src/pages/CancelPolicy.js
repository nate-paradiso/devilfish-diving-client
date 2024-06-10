import React from "react";

const CancelPolicy = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] p-4 flex flex-col  bg-white bg-opacity-60 shadow-md rounded-md m-4">
        <h1 className="text-xl">Cancellation Policy</h1>
        <br />
        <p>
          At Devilfish Diving LLC, we understand that plans can change. Our cancellation policy is
          designed to provide flexibility and fairness to all our customers.
        </p>
        <br />
        <h2 className="text-lg">Cancellation and Refund Policy</h2>
        <p>
          If you need to cancel your booking, please notify us as soon as possible. Our cancellation
          policy is as follows:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>
            Cancellations made at least 2 days (48 hours) before the scheduled service will receive
            a 100% refund.
          </li>
          <li>
            Cancellations made within 2 days (48 hours) of the scheduled service will not be
            eligible for a refund.
          </li>
          <li>
            In the event of unforeseen circumstances by the charter or weather-related, a 100%
            refund will be granted.
          </li>
        </ul>
        <br />
        <h2 className="text-lg">How to Cancel</h2>
        <p>
          To cancel your booking, please contact us via email or phone. Be sure to provide your
          booking details so we can process your cancellation promptly.
        </p>
        <br />
        <h2 className="text-lg">Contact Us</h2>
        <p>
          If you have any questions about our cancellation policy, please do not hesitate to contact
          us.
        </p>
        <p>
          By booking with Devilfish Diving LLC, you agree to the terms of this cancellation policy.
        </p>
      </div>
    </div>
  );
};

export default CancelPolicy;
