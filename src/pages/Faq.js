import React from "react";

const FAQ = () => {
  // <div className=" flex pb-3 max-w-[1000px] justify-start  m-auto flex-col text-center ">
  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] p-4 flex flex-col bg-white bg-opacity-60 shadow-md rounded-md m-4">
        <h1 className="text-xl text-center">Frequently Asked Questions (FAQ)</h1>
        <br />
        <h2 className="text-lg">How do I book a dive trip?</h2>
        <p className="italic text-gray-900">
          You can book a dive trip directly through our website by selecting a Dive date on the
          calender and then filling out the form and processing payment.
        </p>
        <br />
        <h2 className="text-lg">What should I bring to my dive?</h2>
        <p className="italic text-gray-900">
          {" "}
          You must bring all your own dive gear. We do not provide any equipment.{" "}
          <span className="Bold"> Do not </span>
          bring large totes, space is limited. We provide snacks and water.
        </p>
        <br />
        <h2 className="text-lg">What is your cancellation policy?</h2>
        <p className="italic text-gray-900">
          {" "}
          Cancellations made at least 2 days (48 hours) before the scheduled service will receive a
          100% refund. Cancellations made within 2 days (48 hours) of the scheduled service will not
          be eligible for a refund. In the event of unforeseen circumstances by the charter or
          weather-related, a 100% refund will be granted.
        </p>

        <br />
        <h2 className="text-lg">How can I contact Devilfish Diving LLC?</h2>
        <p className="italic text-gray-800">
          You can contact us via email at{" "}
          <a href="mailto:devilfishdiving@gmail.com" className="text-blue-500 underline">
            devilfishdiving@gmail.com
          </a>{" "}
          or by phone at{" "}
          <a href="tel:+13035256924" className="text-blue-500 underline">
            (303) 525-6924
          </a>
          .
        </p>
        <br />
        <h2 className="text-lg">What is the minimum diver requirement?</h2>
        <p className="italic text-gray-800">
          We require exactly two divers to run a dive trip. As we operate a small, compact dive
          boat, we cannot accommodate more than two divers at a time.
        </p>
        <br />
        <h2 className="text-lg">Do you provide snacks during the dive trip?</h2>
        <p className="italic text-gray-800">
          Yes, we provide light snacks and water on all dive trips. If you have any dietary
          restrictions, please let us know in advance, and we will do our best to accommodate you.
        </p>

        <br />
        <h2 className="text-lg">How many dives should I have completed within the last year?</h2>
        <p className="italic text-gray-800">
          For safety reasons, we recommend that divers have completed at least four dives within the
          last year. If you haven't dived recently, we suggest a refresher course before your trip.
        </p>
        <br />
        <h2 className="text-lg">Is there a toilet on the dive boat?</h2>
        <p className="italic text-gray-800">
          Yes, our dive boat is equipped with a small porta-potty for your convenience. Please be
          mindful of others and keep the area clean.
        </p>
        <br />
        <h2 className="text-lg">What certification level is required for advanced dives?</h2>
        <p className="italic text-gray-800">
          We require divers to have an Advanced Open Water certification or equivalent. Please bring
          your certification card with you on the day of the dive.
        </p>
        <br />
        <h2 className="text-lg">Do you offer dive training?</h2>
        <p className="italic text-gray-800"> No</p>
      </div>
    </div>
  );
};
export default FAQ;
