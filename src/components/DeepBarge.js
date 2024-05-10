import React from "react";
import Image from "next/image";

const DeepBarge = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl">Deep Barge aka Horizontal Barge</h1>
          <h3 className="text-lg">Depth: 100 ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>

          <p>
            Not far from the Vertical Barges lies another barge called the deep barge. The bow rests
            in about 100 feet of water, while the stern settled at about 90 feet. This barge is
            intact, upright, and lies in an east-west direction with the bow facing west. The site
            offers similar marine life to the Vertical Barge but the wreck itself is not penetrable.
          </p>
        </div>
        <div className="flex justify-center flex-col m-auto">
          <h3 className="text-xl">Typical Dive Profile with EAN36</h3>
          <Image
            src={"/images/deep-barge-profile.jpg"}
            alt="The Deep Barge Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default DeepBarge;
