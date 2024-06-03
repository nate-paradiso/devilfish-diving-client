import React from "react";
import Link from "next/link";

const Services = () => {
  return (
    <div className=" flex flex-col m-4 ">
      <div className=" flex pb-3 max-w-[1000px] justify-start  m-auto flex-col text-center ">
        <h1 className="text-3xl  ">Boat Services</h1>
        <br />

        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <h2 className="font-bold text-xl"> Two-tank Dive</h2>
          <div className="font-bold">$145 per passenger +tax - 2 person max</div>{" "}
          <p className="italic pt-2">
            Enjoy an unforgettable adventure exploring the hidden gems of the Puget Sound. Discover
            the underwater world teeming with vibrant marine life, accessible only by boat. Dive
            into the depths where you’ll encounter quintessential species like the Giant Pacific
            Octopus, Wolf Eel, Lingcod, Cabezon, Nudibranchs, schooling Rockfish and many more!
            Explore shipwrecks that tell tales of the past, now home to diverse marine ecosystems,
            and traverse rocky reefs bustling with colorful marine species.
          </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <h2 className="font-bold text-xl">
            2.5 Hour Cruise - Elliot Bay to Blakely Rock in the Puget Sound
          </h2>
          <div className="font-bold">$210 +tax - 2 person max</div>
          <p className="italic pt-2">
            Step aboard on a picturesque cruise from Elliot Bay to Blakely Rock in the serene Puget
            Sound. Feel intimately connected to the nature as you glide through the emerald green
            waters, surrounded by breathtaking landscapes. Witness the stunning beauty of the
            Pacific Northwest firsthand, with opportunities to see marine life, including seals, sea
            lions, seabirds, and perhaps even a passing pod of orcas. Enjoy a unique perspective of
            the iconic Seattle skyline from the water, offering stunning views that are perfect for
            photography. This intimate cruise offers a unique vantage point to appreciate the
            natural splendor and urban beauty of the region, providing a tranquil and unforgettable
            experience on the water.{" "}
          </p>
        </div>
        <div className="flex justify-center m-8">
          <Link href="/Calendar">
            <button
              className=" p-2 md:p-4  md:text-3xl transition-colors duration-200 hover:bg-slate-100 text-lg border-[1px]
            bg-opacity-60 bg-white shadow-md rounded-md "
            >
              Book Now!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
