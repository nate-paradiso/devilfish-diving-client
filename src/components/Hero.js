import React from "react";

const Hero = () => {
  return (
    <hero className="relative">
      {/* Container for the text */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
        <h1 className="text-white text-xl  font-bold uppercase">A Seattle Dive Charter</h1>
      </div>

      {/* Image */}
      <img className="block mx-auto opacity-90" src="/images/boat_D611840.png" alt="The Boat" />
    </hero>
  );
};

export default Hero;
