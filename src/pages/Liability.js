import React from "react";
import DiverLiability from "../components/DiverLiability";
const Liability = () => {
  return (
    <div className="m-4">
      <div className="max-w-[800px] mx-auto ">
        <div className=" flex pb-3 max-w-[1000px] justify-center items-center  m-auto flex-col text-center ">
          <h1 className="text-3xl">Liability Form</h1>
          <p>Please complete this form for each day you plan to dive.</p>
          <br />
        </div>
        {/* <div className="bg-white shadow-lg bg-opacity-60 rounded-md p-4 border-[1px]  "></div> */}

        <div className="bg-white shadow-lg bg-opacity-60 rounded-md p-4 border-[1px] ">
          <DiverLiability></DiverLiability>
        </div>
      </div>
    </div>
  );
};

export default Liability;
