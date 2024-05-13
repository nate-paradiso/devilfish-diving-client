import React from "react";

const Services = () => {
  return (
    <div className=" flex flex-col m-4 ">
      <div className=" flex pb-3 max-w-[1000px] justify-start  m-auto flex-col text-center ">
        <h1 className="text-3xl  ">Boat Services</h1>
        <br />
        <div className="">
          <h2>Two-tank Dive</h2>
          <div className="font-bold">$140 per passenger +tax</div>{" "}
          <p>Experience boat only and unique dive sites in the Puget Sound around Seattle</p>
        </div>
        <br />
        <div className="">
          <h2>3 Hour Cruise - Elliot Bay to Blakely Rock in the Puget Sound</h2>
          <div className="font-bold">$100 per passenger +tax</div>
          <p className="">
            Step aboard and enjoy a picturesque cruise from Elliot Bay to Blakely Rock in the Puget
            Sound on a small craft, where you&aposll feel intimately connected to the water and have
            the opportunity to witness the stunning beauty of the surroundings firsthand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
