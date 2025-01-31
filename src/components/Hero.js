import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="relative  mt-4 mb-4 ">
      {/* Container for the text */}
      <div
        className="absolute top-[5px] right-[10px] z-10 pr-2 md:p-4 text-white text-end max-w-[350px] 
      md:max-w-[800px] md:top-[20px] md:right-[50px] xl:max-w-[1000px] xl:top-[50px]  "
      >
        <h1
          className="text-[2.8em] md:text-8xl xl:text-[11rem] font-oleoScript drop-shadow-custom 
        leading-[1] pt-5 pr-3"
        >
          A Seattle Dive Charter
        </h1>
      </div>
      <div className="mx-auto opacity-90 w-full flex justify-center  ">
        <div style={{ maxWidth: "100%", height: "auto" }}>
          <Image
            src="/images/hero-image-boat.jpg"
            alt="The Boat"
            width={2560}
            height={1440}
            className=" shadow-md "
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
