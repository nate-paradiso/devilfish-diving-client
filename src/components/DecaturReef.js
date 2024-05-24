import Image from "next/image";

const DecaturReef = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4 bg-white shadow-lg rounded-md p-4  bg-opacity-60 border-[1px]">
          <h1 className="text-xl">Decatur Reef - Restoration Point</h1>
          <h3 className="text-lg">Depth: 20 to 130 ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>

          <p>
            This site is similar to Blakely Rock, but featuring several large rocky reefs. The
            depths range from 20 to 130ft. Divers can encounter rockfish, lingcod, wolf eels,
            nudibranchs, anemones, and giant pacific octopus while exploring the site. Nitrox is
            recommended.
          </p>
        </div>
        {/* <div className="flex justify-center flex-col m-auto">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/blakely-rock-profile.jpeg"}
            alt="China Wall Dive Site Profile"
            width={400}
            height={400}
          ></Image>
        </div> */}
      </div>
    </div>
  );
};

export default DecaturReef;
