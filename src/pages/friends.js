import React from "react";
import Link from "next/link";
import Image from "next/image";

const Friends = () => {
  return (
    <div className=" flex flex-col m-4 ">
      <div className=" flex pb-3 max-w-[500px] justify-start  m-auto flex-col text-center ">
        <div className=" flex max-w-[1000px] justify-center items-center  m-auto flex-col text-center ">
          <h1 className="text-3xl  ">Friends of Devilfish Diving</h1>
          <Image
            className="h-auto w-[125px] md:w-[200px] p-1" // Consistent responsive sizing
            src="/images/gpologo-invert.png"
            alt="Devilfish Logo"
            width={600}
            height={272}
          />
        </div>{" "}
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.nateparadisophotography.com" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/natep.png"
                alt="Kiliii Yuyan Photography Logo"
                width={300}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Photographer. </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.tongassonthefly.com" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/tongassonthefly.png"
                alt="Tongass on the Fly Logo"
                width={400}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Alaskan Fly Fishing Charter. </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a
              href="https://corvuscrafts.printavo.com/merch/salish-sea-impressions/"
              target="blank"
            >
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/Nam-stamp.png"
                alt="Tongass on the Fly Logo"
                width={60}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Salish Sea Impressions. </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.pnwdiving.com" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/pnwdiving.png"
                alt="PNW Diving Logo"
                width={400}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">
            A go-to resource for Pacific Northwest divers, offering visibility reports, dive site
            info, currents, tides, and more.{" "}
          </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.kiliii.com" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/kiliii.png"
                alt="Nate Paradiso Photography Logo"
                width={300}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Photographer. </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.8diving.com" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/eight.png"
                alt="8 Diving Logo"
                width={200}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Dive Shop. </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.underwatersports.com" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/underwaterSports.png"
                alt="Underwater Sports Logo"
                width={200}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Dive Shop. </p>
        </div>
        <br />
        <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px] ">
          <div className="flex justify-center">
            <a href="https://www.seattleaquarium.org" target="blank">
              <Image
                className="hover:opacity-70 duration-300 "
                src="/images/seattleaquarium.png"
                alt="PNW Diving Logo"
                width={200}
                height={100}
              />
            </a>
          </div>{" "}
          <p className="italic pt-2">Aquarium. </p>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Friends;
