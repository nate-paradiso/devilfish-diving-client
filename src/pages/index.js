import React from "react";
import Image from "next/image";
import Hero from "../components/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="flex justify-center m-8">
        <Link href="/Calendar">
          <button className=" p-2  transition-colors duration-200 hover:bg-slate-100 text-lg  font-bold border-[1px] bg-white shadow-md rounded-md ">
            Book a Dive
          </button>
        </Link>
      </div>
      <section className="flex justify-center items-center flex-col">
        <div
          className="bg-cover bg-center w-full flex justify-center items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/MA10-1.jpg')`,
            height: "300px", // Adjust height as needed
          }}
        >
          <div className="justify-evenly flex flex-wrap items-center m-4 ">
            <div className="flex justify-evenly flex-col md:flex-row">
              <Image
                className="md:m-4 m-2"
                src="/images/scuba.png"
                alt="Mask"
                width={64}
                height={64}
              />
              <Image
                className="md:m-4 m-2"
                src="/images/tank.png"
                alt="Scuba Tanks"
                width={64}
                height={64}
              />
            </div>
            <div className="flex justify-evenly flex-col md:flex-row">
              <Image
                className=" md:m-4 m-2"
                src="/images/boat.png"
                alt="Boat"
                width={64}
                height={64}
              />
              <Image
                className="md:m-4 m-2"
                src="/images/life.png"
                alt="Life Ring"
                width={64}
                height={64}
              />
            </div>
            <div className="flex justify-evenly flex-col md:flex-row">
              <Image
                className="md:m-4 m-2"
                src="/images/camera.png"
                alt="Camera"
                width={64}
                height={64}
              />
              <Image
                className="md:m-4 m-2"
                src="/images/fins.png"
                alt="Fins"
                width={64}
                height={64}
              />
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="m-8 text-xl text-#0E1111 border-[1px]  bg-white shadow-md rounded-md p-2">
            Serving Marine Area 10
          </h2>
        </div>
      </section>
    </>
  );
}
