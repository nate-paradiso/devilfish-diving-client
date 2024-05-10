import React from "react";

const MetridiumWall = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl">Metridium Wall</h1>
          <h3 className="text-lg">Depth: 35 to 75+ ft</h3>
          <h3 className="text-lg">Level: Open Water or Advanced</h3>

          <p>
            Metridium, named after the anemone that can be found in abundance here, is a perfect
            site for beginning divers and veterans alike. Divers can get a glimpse of what Northwest
            Diving is all about, or confirm exactly why it is they love diving here, with this site
            that is rife with scores of plumose anemones, many a tiny nudibranch, numerous varieties
            of sea stars, and even an octopus den or two. Make sure to scour the hulks of giant
            barnacles long past for grunt sculpins curled serenely inside. Metridium showcases the
            best of natural rock formations, with a small canyon/swim through, a mini wall, a nice
            sloping ridged reef, and an oblong main rocky reef structure with ribbons of seaweed
            draping over and cascading down it.
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

export default MetridiumWall;
