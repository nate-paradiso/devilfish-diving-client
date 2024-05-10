import React from "react";
import Image from "next/image";
const ChinaWall = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl">China Wall</h1>
          <h3 className="text-lg">Depth: 60 to 100 ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>

          <p>
            An amazing dive site nestled just off the coast of Bainbridge Island next to Blakely
            Rock. Renowned for its dramatic underwater rock formation resembling a towering wall,
            this site offers an exhilarating dive experience for advanced divers. Starting between
            60 and 70 feet the rock wall is adorned with an abundance of Puget Sound marine fauna.
            Rockfish dart among the crevices, while giant pacific octopus hide amidst the nooks and
            crannies. The depths of China Wall can reach over 100 feet (30 meters) a typical dive
            profile has a maximum operating depth of 85 to 95 feet depending on the tide. Nitrox is
            recommended.
          </p>
        </div>
        <div className="flex justify-center flex-col m-auto">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/china-wall-profile.jpg"}
            alt="China Wall Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default ChinaWall;
