import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const VerticalBarge = () => {
  const [images, setImages] = useState([]);
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    // Fetch images from backend endpoint
    const getImages = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/cloudinary/vertical-barge/images`);
        if (response.status === 200) {
          setImages(response.data.images);
        } else {
          console.error("Failed to fetch images:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    getImages();
  }, []);

  return (
    <div className=" pb-3 max-w-[1200px] m-auto ">
      <div className="m-4 flex flex-col">
        <div className="mb-4 bg-white shadow-lg rounded-md p-4 border-[1px]">
          <h1 className="text-xl">Vertical Barge</h1>
          <h3 className="text-lg">Depth: 75 ft</h3>
          <h3 className="text-lg">Level: Advanced</h3>
          <p>
            This is one of the best wreck dives in the Puget Sound. Named the Vertical Barge because
            this wreck was once laying on its starboard side, giving it a vertical orientation.
            After years of strong ocean currents, the wreck has rolled and now lies upright. The
            hull is still intact but resembles a skeleton, offering many opportunities for
            penetration or swimming through. Marine life congregates around this structure, making
            diving here serene. The wreck rests on a sandy bottom at around 75 feet in a North to
            South orientation, with bow facing South. Nitrox is recommended.
          </p>
        </div>
        <div className="flex justify-center aspect-video mb-4 bg-white shadow-lg rounded-md p-4 border-[1px]">
          <div className="w-full aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/tEpf-m-55GA"
              title="Vertical Barge Video"
              allowFullScreen
            />
          </div>
        </div>{" "}
        {/* Display images */}
        <div className="flex flex-wrap mb-4 justify-center m-auto">
          {images.map((imageUrl, index) => (
            <div key={index} className="mb-2 bg-white shadow-lg rounded-md p-4 border-[1px]">
              <Image
                src={imageUrl}
                alt={`Image ${index}`}
                width={1200}
                height={800}
                className="w-[350px] h-auto md:w-[400px]"
              />
            </div>
          ))}
        </div>{" "}
        <div className="flex justify-center flex-col m-auto bg-white shadow-lg rounded-md p-4 border-[1px]">
          <h3 className="text-xl">Typical Dive Profile with Air</h3>
          <Image
            src={"/images/vertical-barge-profile.jpg"}
            alt="The Vertical Barge Site Profile"
            width={400}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default VerticalBarge;
