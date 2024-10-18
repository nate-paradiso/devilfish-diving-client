import React, { useState } from "react";
import Image from "next/image";
import Hero from "../components/Hero";
import Link from "next/link";

export default function Home() {
  const [hoveredDiv, setHoveredDiv] = useState(null);

  const handleMouseEnter = divId => {
    setHoveredDiv(divId);
  };

  const handleMouseLeave = () => {
    setHoveredDiv(null);
  };

  return (
    <>
      <Hero />

      <div className="flex justify-center m-8 bg-cover bg-center">
        <Link href="/Calendar">
          <button className="p-3 md:p-4 md:text-3xl transition-colors duration-200 hover:bg-slate-100 text-2xl border-[1px] bg-white bg-opacity-90 shadow-md rounded-md">
            Book Now!
          </button>
        </Link>
      </div>

      <section className="flex justify-center items-center flex-col ml-4 mr-4">
        <div className="flex w-full">
          <div
            className={`${
              hoveredDiv === "div1" ? "w-auto" : "w-full"
            } bg-cover bg-center flex justify-center items-center h-[250px] md:h-[500px] lg:h-[600px] bg-white bg-opacity-60 shadow-md rounded-md p-3 mr-1`}
            onMouseEnter={() => handleMouseEnter("div2")}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715708252/home-page/fkdpzulur1hqt7v3f6mj.jpg')`,
            }}
          >
            <Link href="/DivingPhotos">
              <h2 className="text-white md:text-6xl text-2xl font-oleoScript tracking-wider transition-colors duration-200 hover:text-slate-300 text-center">
                Diving
              </h2>
            </Link>
          </div>
          <div
            className={`${
              hoveredDiv === "div2" ? "w-auto" : "w-full"
            } bg-cover bg-center flex justify-center items-center h-[250px] md:h-[500px] lg:h-[600px] bg-white bg-opacity-60 shadow-md rounded-md p-3 ml-1`}
            onMouseEnter={() => handleMouseEnter("div1")}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715721182/home-page/eh5pc2bco2fu18csvu9t.jpg')`,
            }}
          >
            <Link href="/SightsPhotos">
              <h2 className="text-white md:text-6xl text-2xl font-oleoScript tracking-wider transition-colors duration-200 hover:text-slate-300 text-center">
                Sight Seeing
              </h2>
            </Link>
          </div>
        </div>
        <div>
          <h1 className="bg-white bg-opacity-60 shadow-md text-center rounded-md p-3 border-[1px] m-8 md:text-2xl text-lg">
            Discover the Puget Sound and Lake Washington!
          </h1>
        </div>
        <div
          className="bg-cover bg-center w-full flex justify-center items-center bg-white bg-opacity-60 shadow-md rounded-md p-3 mr-4 ml-4 mb-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/images/MA10-1.jpg')`,
          }}
        >
          <div>
            <h2 className="m-10 lg:m-16 text-xl text-center text-#0E1111 border-[1px] bg-white bg-opacity-90 shadow-md rounded-md p-2">
              Launching at Alki and Rainier Beach
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
