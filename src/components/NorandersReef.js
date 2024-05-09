import React from "react";
import Image from "next/image";
const NorandersReef = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl">Noranders Reef </h1>
          <h3 className="text-lg">Depth: 35 to 85 ft</h3>

          <p>
            Norranders Reef consists of a number of rock outcrops that run from depths of about 35
            feet to 85 feet. The major outcrops start at about 50 feet and end at about 70 feet. The
            bottom to the sides of the outcrops is a mix of rocks, cobbles, shell and sand. The
            outcrops rise nearly vertically from the bottom to heights of 10 feet or more. Numerous
            cracks and crevices provide hiding holes for lots of small critters.{" "}
          </p>
        </div>
        <div className="flex justify-center flex-col m-auto">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/noranders-reef-profile.jpeg"}
            alt="Noranders Reef Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default NorandersReef;
