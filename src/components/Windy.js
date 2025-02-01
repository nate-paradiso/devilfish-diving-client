import React, { useEffect } from "react";

const WindyMap = () => {
  useEffect(() => {
    // Load Leaflet script first
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.js";
    leafletScript.async = true;
    document.body.appendChild(leafletScript);

    // Once Leaflet is loaded, load the Windy API script
    leafletScript.onload = () => {
      const windyScript = document.createElement("script");
      windyScript.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
      windyScript.async = true;
      document.body.appendChild(windyScript);

      // After Windy script is loaded, initialize the map
      windyScript.onload = () => {
        const options = {
          key: "MVNRvpDJ87Ip8mjAKOoS7u62Fvjte8Vj", // Replace with your Windy API key
          lat: 47.6062, // Seattle latitude
          lon: -122.3321, // Seattle longitude
          zoom: 10,
          hourFormat: "12h",
        };

        windyInit(options, windyAPI => {
          const { map } = windyAPI;
          L.popup()
            .setLatLng([47.6062, -122.3321])
            .setContent("Check the wind before the dive!")
            .openOn(map);
        });
      };
    };

    return () => {
      // Clean up the scripts when the component unmounts
      document.body.removeChild(leafletScript);
    };
  }, []);

  return <div id="windy" className="w-full h-[400px]"></div>;
};

export default WindyMap;
