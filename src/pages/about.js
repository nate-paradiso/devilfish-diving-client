import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className=" flex flex-col m-4 ">
      <div className=" flex pb-3 max-w-[1000px]  m-auto flex-col  ">
        <div className=" flex pb-3 max-w-[1000px] justify-start  m-auto flex-col text-center ">
          <h1 className="text-3xl">About</h1>
          <Image
            className="h-auto w-[125px] md:w-[200px] p-1" // Consistent responsive sizing
            src="/images/gpologo-invert.png"
            alt="Devilfish Logo"
            width={600}
            height={272}
          />{" "}
        </div>
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px]">
          <p>
            The Devilfish has traversed much of the Puget Sound, Neah Bay, and the San Juan Islands.
            It is an efficient small vessel, ideal for a compact diving team or cruise. Featuring an
            Alaskan bulkhead, passengers can seek shelter from the elements and enjoy a wide-ranging
            view of the water. Facilities board include a Porta Potti, fresh water for drinking, a
            dinette table and seats for two passengers and table for cameras.
          </p>
          <br />
          <p>
            The C-Dory 22ft cruiser is a classic vessel known for its durability, versatility, and
            reliability. Originally built in Auburn, WA in 1987 it is a popular choice among boaters
            due to its seaworthiness.
          </p>

          <br />
          <p>
            Safety is paramount. The vessel is outfitted with redundant systems, including two fuel
            tanks separated by a valve, a primary 90hp Suzuki engine, a 9.9hp Suzuki kicker outboard
            motor, dual GPS units, and dual VHF radios. With cutting-edge Garmin depth sounder,
            electronic charts, and radar, navigating the Puget Sound is both safe and dependable.
            Additionally, onboard amenities include an emergency oxygen supply, a first aid kit,
            USCG approved Type I life jackets, visual distress signals, fire extinguisher, throwable
            PFD, and air horn.
          </p>
          <br />
          <p>
            Captain Nate has over 10 years of boating experience and over 900 logged dives. Route
            and dive planning is his specialty.{" "}
          </p>
        </div>
        <Image
          className="bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] mt-4"
          src="https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715717617/about-page/d7mvwab6qpzthb9cetbq.jpg"
          alt="Anchor and Captain"
          width={1200}
          height={800}
        />
      </div>
    </div>
  );
};

export default About;
