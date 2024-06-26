import React from "react";
import Image from "next/image";

const FourMileRockBarges = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4 bg-white shadow-lg bg-opacity-60 rounded-md p-4 border-[1px]">
          <h1 className="text-xl">4 Mile Rock Barges</h1>
          <h3 className="text-lg">Depth: 90 ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>
          <p>
            A premiere dive site. These steel barges are very large - about 150 feet in length from
            bow to stern and maybe 40 feet wide. They both sit upright and intact in about 90 feet
            of water with their decks about 20 feet above the substrate. The two barges rest
            somewhat parallel to one another. The western barge rests with her bow pointed south
            while the eastern barge lies with her bow pointed northeast. The barges are only about
            30 feet apart at the south end. Divers can circumnavigate both barges before running low
            on no-deco time if breathing Nitrox. Giant nudibranchs can be found here.
          </p>
        </div>
        <div className="flex justify-center aspect-video mb-4 bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px]">
          <div className="w-full aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/5d0cJ9WY4wk?si=FyaBY83haTsuCyHC"
              title="Vertical Barge Video"
              allowFullScreen
            />
          </div>
        </div>{" "}
        <div className="flex justify-center flex-col m-auto bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px]">
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

export default FourMileRockBarges;
