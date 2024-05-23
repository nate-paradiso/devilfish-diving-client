import React from "react";
import Image from "next/image";

const BlakelyRock = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4 bg-white shadow-lg rounded-md p-4 border-[1px]">
          <h1 className="text-xl">Blakely Rock - Shangri-La</h1>
          <h3 className="text-lg">Depth: 20 to 100+ ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>

          <p>
            A premiere dive site. Blakely Rock is a submerged pinnacle or reef rising from the
            depths of Puget Sound. It&rsquo;s known for its diverse marine life, including various
            species of fish, invertebrates, and colorful underwater flora. Divers often encounter
            rockfish, lingcod, wolf eels, nudibranchs, anemones, and giant pacific octopus while
            exploring the site. Nitrox is recommended
          </p>
          <p>
            The depth of Blakely Rock varies, with shallow areas around the pinnacle and deeper
            waters surrounding it. Divers can expect depths ranging from around 20 feet (6 meters)
            to over 100 feet (30 meters) or more.
          </p>
        </div>
        <div className="flex justify-center flex-col m-auto bg-white shadow-lg rounded-md p-4 border-[1px]">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/blakely-rock-profile.jpg"}
            alt="Blakely Rock Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default BlakelyRock;
