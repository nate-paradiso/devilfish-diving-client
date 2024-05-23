import React from "react";
import Image from "next/image";
// import InstagramEmbed from "react-instagram-embed";

const AlkiReef = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4 bg-white shadow-lg rounded-md p-4 border-[1px]">
          <h1 className="text-xl">Alki Reef</h1>
          <h3 className="text-lg">Depth: 50 to 90 ft</h3>
          <h3 className="text-lg">Level: Open Water or Advanced</h3>
          <p>
            Alki Reef is full of life. Schools of rockfish and perch swim about and giant lingcod
            hide in the boulders. The giant pacific octopus also hangs out.Multiple large rock piles
            make up this site. Each pile is about 15 to 20 feet high and up to 100 feet in diameter.
            The rock piles are situated close to one another. Some piles run together while others
            are not connected, but are visible (assuming visibility is reasonable) from one another.{" "}
          </p>
        </div>
        <div className="flex justify-center aspect-video mb-4 bg-white shadow-lg rounded-md p-4 border-[1px]">
          <div className="w-full aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/IGZRuA5xG34"
              title="Alki Reef Video"
              allowFullScreen
            />
          </div>
        </div>{" "}
        {/* <div className="flex justify-center flex-col m-auto ">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/-profile.jpg"}
            alt="The Vertical Barge Site Profile"
            width={400}
            height={400}
          ></Image>
        </div> */}
      </div>
    </div>
  );
};

export default AlkiReef;
