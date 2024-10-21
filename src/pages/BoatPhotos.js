import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const BoatPhotos = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    // Fetch images from backend endpoint
    const getImages = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/cloudinary/boat-page/images`);
        if (response.status === 200) {
          // Extract creation date from image URLs and sort the images
          const sortedImages = response.data.images.sort((a, b) => {
            // Extract timestamp from image URLs
            const getDateFromUrl = url => {
              const match = url.match(/\/v(\d+)\/[^/]+\/[^/]+\.jpg$/);
              return match ? parseInt(match[1]) : 0;
            };

            // Compare timestamps for sorting
            return getDateFromUrl(b) - getDateFromUrl(a);
          });

          // Reverse the array to display images in reverse order
          const reversedImages = sortedImages.reverse();

          setImages(reversedImages);
          setLoading(false);
        } else {
          console.error("Failed to fetch images:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    getImages();
  }, []);

  // Convert image URLs to the required format for the react-grid-gallery component
  const formattedImages = images.map((imageUrl, index) => ({
    src: imageUrl,
    thumbnail: imageUrl,
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    caption: `Image ${index + 1}`,
  }));

  return (
    <div className="w-full flex m-auto flex-col mt-4">
      <div className=" flex pb-3 max-w-[1000px] justify-center items-center  m-auto flex-col text-center ">
        <h1 className="text-3xl">The Boat</h1>
        <p>Adventures Captured</p>
        <Image
          className="h-auto w-[125px] md:w-[200px] p-1" // Consistent responsive sizing
          src="/images/gpologo-invert.png"
          alt="Devilfish Logo"
          width={200} // The largest size (matches md:w-[200px])
          height={64} // Keep the correct aspect ratio
        />{" "}
      </div>
      {loading ? (
        <div className="m-4">Loading...</div>
      ) : (
        <div className="flex  m-auto mb-4 flex-wrap justify-center ">
          {images.map((imageUrl, index) => (
            <div key={index} className="bg-white  shadow-lg rounded-md p-2 border-[1px] m-2">
              <Image
                src={imageUrl}
                alt={`Image ${index}`}
                width={1200}
                height={1}
                className="w-full h-auto md:w-[250px] lg:w-[500px] p-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoatPhotos;
