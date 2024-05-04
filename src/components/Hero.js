import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="relative">
      {/* Container for the text */}
      <div className="absolute top-[5px] right-[10px] z-10 p-4 text-white text-end max-w-[300px] md:max-w-[800px] md:top-[20px] md:right-[50px] xl:max-w-[1000px] xl:top-[50px]  ">
        <h1 className="text-3xl md:text-7xl xl:text-9xl font-bold font-serif">
          A Seattle Dive Charter
        </h1>
      </div>
      <div className="mx-auto opacity-90 w-full flex justify-center">
        <div style={{ maxWidth: "100%", height: "auto" }}>
          <Image
            src="/images/boat-sky-blank_D611840.jpg"
            alt="The Boat"
            width={2560}
            height={1440}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
