import React from "react";
import Image from "next/image";
import Link from "next/link";

const Services = () => {
  return (
    <div className=" flex flex-col m-4 ">
      <div className=" flex pb-3 max-w-[1000px] justify-start  m-auto flex-col text-center ">
        <div className=" flex max-w-[1000px] justify-center items-center  m-auto flex-col text-center ">
          <h1 className="text-3xl  ">Boat Services</h1>
          <Image
            className="h-auto w-[125px] md:w-[200px] p-1" // Consistent responsive sizing
            src="/images/gpologo-invert.png"
            alt="Devilfish Logo"
            width={600}
            height={272}
          />
        </div>

        <div className="flex justify-center m-4">
          <Link href="/calendar">
            <button
              className="p-3 md:p-4 md:text-3xl transition-colors duration-200 hover:bg-slate-100 
          text-xl text-center border-[1px] font-bold bg-white bg-opacity-90 shadow-md rounded-md"
            >
              Book Now!
            </button>
          </Link>
        </div>
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <h2 className="font-bold text-xl"> Two-tank Rec Dive</h2>
          <div className="font-bold">$145 per diver +tax</div>{" "}
          <p className="italic pt-2">
            Enjoy an adventure exploring the hidden gems of the Puget Sound and the wrecks of Lake
            Washington. Discover an underwater world teeming with vibrant marine life, accessible
            only by boat. Dive into the depths where you will encounter iconic species like the
            Giant Pacific Octopus, Wolf Eel, Lingcod, Cabezon, Nudibranchs, schooling Rockfish, and
            many more! Explore shipwrecks that tell tales of the past and traverse rocky reefs
            bustling with colorful marine species. Whether you are diving in the Puget Sound or
            exploring the wrecks of Lake Washington, each dive offers a unique experience.{" "}
          </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <h2 className="font-bold text-xl"> 1 Tec Dive</h2>
          <div className="font-bold">$145 per diver +tax</div>{" "}
          <p className="italic pt-2">
            Perform a single technical dive in the Puget Sound or Lake Washington. The dive location
            will be determined in advance, and an SMB is required. A detailed dive plan must be
            confirmed and communicated with the captain in advance.{" "}
          </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <h2 className="font-bold text-xl">
            2.5 Hour Cruise - Elliot Bay to Blakely Rock in the Puget Sound
          </h2>
          <div className="font-bold">$210 +tax</div>
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
      </div>
    </div>
  );
};

export default Services;
