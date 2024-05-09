import { useEffect, useState } from "react";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import { MapContainer, TileLayer, LayersControl, ImageOverlay, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import "~react-leaflet-markercluster/dist/styles.min.css";
// import Script from "next/script";
import { Icon } from "leaflet"; // Importing L from Leaflet
import ChinaWall from "./ChinaWall";
import BlakelyRock from "./BlakelyRock";
import DecaturReef from "./DecaturReef";
import TheBoss from "./TheBoss";
import LikersReef from "./LikersReef";
import MetridiumWall from "./MetridiumWall";
import NorandersReef from "./NorandersReef";

const { BaseLayer } = LayersControl;

const MapComponent = () => {
  // Bathymetry images
  const loadPNGImages = () => {
    const pngImages = [
      {
        name: "Blakely Rock",
        url: "/images/tiles/blakely-rock.png",
        bounds: [
          [47.59222, -122.48403], // Top-left corner
          [47.59809, -122.47479], // Bottom-right corner
        ],
        opacity: 0.9, // Opacity value (0 to 1)
      },
      {
        name: "Alki Fishing Reef",
        url: "/images/tiles/alki-rock-reef.png",
        bounds: [
          [47.55537, -122.41015],
          [47.55827, -122.40546],
        ],
        opacity: 0.8,
      },
      {
        name: "4-Mile Rock Barges",
        url: "/images/tiles/4mile-rock-barges.png",
        bounds: [
          [47.63892, -122.42866], // Top-left corner
          [47.64147, -122.42537],
        ],
        opacity: 0.85,
      },
      {
        name: "Shilshole Wrecks",
        url: "/images/tiles/shilshole-wrecks.png",
        bounds: [
          [47.67186, -122.42414], // Top-left corner
          [47.67464, -122.42029],
        ],
        opacity: 0.9,
      },
      {
        name: "Blake Island",
        url: "/images/tiles/blake-island.png",
        bounds: [
          [47.52449, -122.51224], // Top-left corner
          [47.55161, -122.4749],
        ],
        opacity: 0.8,
      },
      {
        name: "Unknown",
        url: "/images/tiles/unknown.png",
        bounds: [
          [47.55717, -122.53996], // Top-left corner
          [47.56418, -122.52653],
        ],
        opacity: 0.8,
      },
      {
        name: "Rockaway",
        url: "/images/tiles/rockaway.png",
        bounds: [
          [47.59485, -122.50344], // Top-left corner
          [47.60307, -122.49202],
        ],
        opacity: 0.8,
      },
      {
        name: "The Boss",
        url: "/images/tiles/the-boss.png",
        bounds: [
          [47.59011, -122.49692], // Top-left corner
          [47.59208, -122.49465],
        ],
        opacity: 0.8,
      },
      {
        name: "Decatur Reef",
        url: "/images/tiles/decatur-reef.png",
        bounds: [
          [47.57815, -122.48856], // Top-left corner
          [47.58509, -122.46771],
        ],
        opacity: 0.8,
      },
      {
        name: "Tyee Shoal",
        url: "/images/tiles/tyee-shoal.png",
        bounds: [
          [47.61056, -122.48673], // Top-left corner
          [47.6182, -122.47214],
        ],
        opacity: 0.8,
      },

      {
        name: "Unknown Wreck",
        url: "/images/tiles/unknown-wreck.png",
        bounds: [
          [47.5028, -122.39527], // Top-left corner
          [47.508, -122.38961],
        ],
        opacity: 0.8,
      },
      // Add more PNG images as needed
    ];
    return pngImages.map((image, index) => (
      <ImageOverlay key={index} url={image.url} bounds={image.bounds} opacity={image.opacity} />
    ));
  };

  //dive site pins
  const markers = [
    { name: "China Wall", position: [47.5941, -122.4823], popUp: "hello" },
    { name: "Blakely Rock - Shangri-La", position: [47.5947, -122.477] },
    { name: "The Boss", position: [47.5912, -122.496] },
    { name: "Decatur Reef", position: [47.582, -122.4755] },
    { name: "Noranders Reef", position: [47.5997, -122.4965] },
    { name: "Metridium Wall", position: [47.5974, -122.4961] },
    { name: "Likers Reef", position: [47.5969, -122.4961] },
    { name: "Blakely Harbor", position: [47.5961, -122.4969] },
    { name: "Tyee Shoal", position: [47.6135, -122.479] },
    { name: "4 Mile Rock Barges", position: [47.6403, -122.4267] },
    { name: "Vertical Barge", position: [47.673, -122.4219] },
    { name: "Deep Barge", position: [47.674, -122.423] },
    { name: "Alki Fishing Reef", position: [47.557, -122.408] },
    { name: "Blake Island Reef", position: [47.5295, -122.494] },
    // Add more pins as needed
  ];

  const customIcon = new Icon({ iconUrl: "/images/diving.png", iconSize: [20, 20] });

  // State to manage which component to render under the map
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Function to handle click on link in popup
  const handlePopupLinkClick = componentName => {
    // Set the selected component based on the link clicked
    setSelectedComponent(componentName);
  };
  return (
    <div className="mb-8 ">
      <div className="flex pb-3 max-w-[1000px] justify-center align-middle m-auto  ">
        <p className="m-4">
          Explore Devilfish Diving&rsquo;s current dive sites. Dive site visits depend on weather,
          tides, and currents. They are subject to change by the captain at any moment. Zoom in and
          click on a dive flag for more information, and use the layers button to switch background
          map. The Nautical Chart reveals depths, while the bathymetry overlay unveils the
          underwater topography.
        </p>
      </div>
      <div className="flex justify-center items-center flex-col ">
        {/* <Script src="https://unpkg.com/sql.js@0.3.2/js/sql.js"></Script>
      <Script src="https://unpkg.com/Leaflet.TileLayer.MBTiles@1.0.0/Leaflet.TileLayer.MBTiles.js"></Script> */}
        <MapContainer
          className="h-[400px] w-full md:h-[500px] "
          center={[47.605932, -122.448144]}
          zoom={9}
        >
          <LayersControl position="topright">
            {loadPNGImages()}
            {/* <MarkerClusterGroup> */}
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position} icon={customIcon}>
                <Popup>
                  <button
                    className="text-blue-700 hover:text-blue-900"
                    onClick={() => handlePopupLinkClick(marker.name)}
                  >
                    {marker.name}
                  </button>
                </Popup>{" "}
              </Marker>
            ))}
            {/* </MarkerClusterGroup>{" "} */}
            <BaseLayer name="Esri World Imagery">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            </BaseLayer>{" "}
            <BaseLayer name="Nautical Chart - Depth in Meters">
              <TileLayer
                url="https://www.marinetraffic.com/TMS/1.0.0/TX97/{z}/{x}/{y}.png?v=3"
                minZoom={0}
                maxZoom={20}
                attribution="&copy; Marine Traffic"
              />
            </BaseLayer>
            <BaseLayer name="Esri Ocean Basemap">
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                maxZoom={16}
              />
            </BaseLayer>
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
          </LayersControl>
        </MapContainer>
        <div className="">
          {" "}
          {selectedComponent === "Blakely Rock - Shangri-La" && <BlakelyRock />}
          {selectedComponent === "China Wall" && <ChinaWall />}
          {selectedComponent === "Decatur Reef" && <DecaturReef />}
          {selectedComponent === "The Boss" && <TheBoss />}
          {selectedComponent === "Likers Reef" && <LikersReef />}
          {selectedComponent === "Metridium Wall" && <MetridiumWall />}
          {selectedComponent === "Noranders Reef" && <NorandersReef />}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
