import React, { useState, useEffect } from "react";
import Image from "next/image";
import Hero from "../components/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="flex justify-center p-4 bg-cover bg-center">
        <Link href="/Calendar">
          <button className="p-2  md:p-4 md:text-3xl transition-colors duration-200 hover:bg-slate-100 text-2xl border-[1px] bg-white shadow-md rounded-md">
            Book Now!
          </button>
        </Link>
      </div>

      <section className="flex justify-center items-center flex-col ml-4 mr-4">
        <div className="flex w-full ">
          <div
            className="bg-cover bg-center w-full flex justify-center items-center h-[250px] md:h-[500px] lg:h-[600px] bg-white shadow-md rounded-md p-3  mr-1"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715708252/home-page/fkdpzulur1hqt7v3f6mj.jpg')`,
            }}
          >
            <Link href="/Photos">
              <h2 className="text-white md:text-6xl text-2xl font-oleoScript tracking-wider  ">
                Diving
              </h2>
            </Link>
          </div>
          <div
            className="bg-cover bg-center w-full flex justify-center items-center bg-white shadow-md rounded-md p-3  ml-1"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/hrdoqhgcp/image/upload/v1715721182/home-page/eh5pc2bco2fu18csvu9t.jpg')`,
            }}
          >
            <Link href="/Photos">
              <h2 className="text-white md:text-6xl text-center text-2xl font-oleoScript tracking-wider ">
                Sight Seeing
              </h2>
            </Link>
          </div>
        </div>
        <div>
          <h1 className="bg-white shadow-md rounded-md p-3 m-4 text-2xl">
            Discover the Puget Sound!
          </h1>
        </div>
        <div
          className="bg-cover bg-center w-full flex justify-center items-center bg-white shadow-md rounded-md p-3 m-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/images/MA10-1.jpg')`,
          }}
        >
          {/* <Link href="/Calendar"> */}
          <div className="">
            <h2 className="m-8 text-xl text-#0E1111 border-[1px]  bg-white shadow-md rounded-md p-2">
              Launching from Alki
            </h2>
          </div>
          {/* </Link> */}
        </div>
      </section>
    </>
  );
}
