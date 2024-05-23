import React from "react";
// import Image from "next/image";

const LikersReef = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4 bg-white shadow-lg rounded-md p-4 border-[1px]">
          <h1 className="text-xl">Likers Reef</h1>
          <h3 className="text-lg">Depth: 50 to 70 ft</h3>
          <h3 className="text-lg">Level: Open Water or Advanced</h3>

          <p>
            A large boulder patch with many nooks and crannies to peer into. After you have
            canvassed all the fissures on that pile, finding blennies, kelp greenlings, sea squirts,
            nudibranchs, among others, follow the slope upwards to the next patch, and see what you
            can find. If you’re lucky it may be a red octopus or even a stubby squid! Hopping from
            boulder to boulder one notices the structure changing into a small ruffled ridge, and
            can encounter copper rockfish, schools of black rockfish and perch, a solitary plumose
            anemone or two, decorator crabs, and even a birds cruising the depths looking for food!
            Make sure to scour the ledges as well for you will be rewarded with numerous small
            critters staring back at you.
          </p>
        </div>
        {/* <div className="flex justify-center flex-col m-auto">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/boss-profile.jpeg"}
            alt="China Wall Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div> */}
        <p className="text-xs">Description by Exotic Aquatics </p>
      </div>
    </div>
  );
};

export default LikersReef;
