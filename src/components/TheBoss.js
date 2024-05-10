import React from "react";
import Image from "next/image";
const TheBoss = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl">The Boss</h1>
          <h3 className="text-lg">Depth: 50 ft</h3>

          <p>
            Resting on the sandy bottom lies a rubble pile comprising of two wrecks stacked one atop
            the other. Partially disintegrated cabin cruisers form a small reef. Among the tangled
            wreckage, remnants of the vessels can be discerned—a flattened stern, a pointed bow, and
            even a solitary toilet from the head. This dive site is easily accessible and suitable
            even on days with heavy currents.
          </p>
        </div>
        <div className="flex justify-center flex-col m-auto">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/boss-profile.jpg"}
            alt="The Boss Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default TheBoss;
