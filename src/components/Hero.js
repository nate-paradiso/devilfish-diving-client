import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="relative">
      {/* Container for the text */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
        <h1 className="text-white text-xl  font-bold uppercase">A Seattle Dive Charter</h1>
      </div>
      <div className="block mx-auto opacity-90 w-full">
        <Image
          src="/images/boat_D611840.png"
          alt="The Boat"
          layout="responsive"
          width={800}
          height={600}
        />
      </div>{" "}
    </section>
  );
};

export default Hero;
