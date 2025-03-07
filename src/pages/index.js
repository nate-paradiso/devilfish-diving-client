import React, { useState } from "react";
import Image from "next/image";
import Hero from "../components/Hero";
import Link from "next/link";
import Windy from "../components/Windy";

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

      <div className="flex justify-center items-center m-8 bg-cover bg-center">
        <Image
          className="h-auto w-[140px] md:w-[200px] p-1" // Consistent responsive sizing
          src="/images/gpologo-invert.png"
          alt="Devilfish Logo"
          width={600}
          height={272}
        />
        <Link href="/calendar">
          <button
            className="p-3 md:p-4 md:text-3xl transition-colors duration-200 hover:bg-slate-100 
          text-xl text-center border-[1px] font-bold bg-white bg-opacity-90 shadow-md rounded-md"
          >
            Book Now!
          </button>
        </Link>
        <Image
          className="h-auto w-[140px] md:w-[200px] p-1 transform scale-x-[-1]" // Consistent responsive sizing and mirror effect
          src="/images/gpologo-invert.png"
          alt="Devilfish Logo"
          width={600}
          height={272}
        />
      </div>

      <section className="flex justify-center items-center flex-col ">
        <div className="flex w-full">
          <div
            className={`${
              hoveredDiv === "div1" ? "w-auto" : "w-full"
            } bg-cover bg-center flex justify-center items-center h-[250px] md:h-[500px] lg:h-[600px] bg-white bg-opacity-60 shadow-md  p-3 `}
            // onMouseEnter={() => handleMouseEnter("div2")}
            // onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715708252/home-page/fkdpzulur1hqt7v3f6mj.jpg')`,
            }}
          >
            <Link href="/diving-photos">
              <h2 className="drop-shadow-custom text-white md:text-6xl text-2xl font-oleoScript tracking-wider transition-colors duration-200 hover:text-slate-300 text-center">
                Diving
              </h2>
            </Link>
          </div>
          <div
            className={`${
              hoveredDiv === "div2" ? "w-auto" : "w-full"
            } bg-cover bg-center flex justify-center items-center h-[250px] md:h-[500px] lg:h-[600px] bg-white bg-opacity-60 shadow-md  p-3 `}
            // onMouseEnter={() => handleMouseEnter("div1")}
            // onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715721182/home-page/eh5pc2bco2fu18csvu9t.jpg')`,
            }}
          >
            <Link href="/sights-photos">
              <h2 className=" drop-shadow-custom text-white md:text-6xl text-2xl font-oleoScript tracking-wider transition-colors duration-200 hover:text-slate-300 text-center">
                Sight Seeing
              </h2>
            </Link>
          </div>
        </div>
        <div>
          <h1 className="bg-white bg-opacity-60 shadow-md text-center rounded-md p-3 border-[1px] m-8 md:text-3xl text-xl">
            Discover the Puget Sound and Lake Washington!
          </h1>
        </div>
        <Windy />
        <div>
          <h1 className="bg-white bg-opacity-60 shadow-md text-center rounded-md p-3 border-[1px] m-8 md:text-3xl text-xl">
            Your Next Dive Adventure Starts Here!
          </h1>
        </div>
        <div
          className="bg-cover bg-center w-full flex justify-center items-center bg-white bg-opacity-60 shadow-md h-[300px] md:h-[400px] lg:h-[600px]  p-3 mr-4 ml-4 m"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/images/boat-dive-flag.jpg')`,
          }}
        >
          <div>
            <h2 className="m-10 lg:m-16 md:text-2xl text-xl text-center text-#0E1111 border-[1px] bg-white bg-opacity-90 shadow-md rounded-md p-2">
              Launching at Alki, Shilshole, Rainier Beach, Bellevue and Magnuson
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
