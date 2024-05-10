// src/pages/MyPage.tsx
import dynamic from "next/dynamic";
import { useMemo } from "react";

const DiveSites = () => {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("../components/MapComponent"), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    [],
  );

  return (
    <div className=" ">
      <MapComponent />
    </div>
  );
};

export default DiveSites;
