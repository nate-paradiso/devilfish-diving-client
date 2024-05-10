import React from "react";
import Image from "next/image";
const BlakeIsland = () => {
  return (
    <div className=" pb-3 max-w-[1000px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl">Blake Island Reef</h1>
          <h3 className="text-lg">Depth: 50 to 110 ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>
          <p>
            Created as part of the Washington Department of Fish and Wildlife's artificial reef
            program, it consists of concrete debris scattered across the ocean floor, resembling the
            remnants of an old bridge. This scattered debris forms a complex habitat, attracting a
            variety of marine creatures and providing ample opportunities for exploration.
          </p>
          <p>
            Diving at Blake Island Reef requires careful consideration of the current, as the site
            experiences significant water movement at times. It is recommended to dive here during
            slack before ebb to minimize current-related challenges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlakeIsland;
