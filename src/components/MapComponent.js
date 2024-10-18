import { useState, useRef, useEffect } from "react";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ImageOverlay,
  Marker,
  Popup,
  useMapEvents,
  ScaleControl,
} from "react-leaflet";
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
import VerticalBarge from "./VerticalBarge";
import DeepBarge from "./DeepBarge";
import FourMileRockBarges from "./FourMileRockBarges";
import AlkiReef from "./AlkiReef";
import BlakeIsland from "./BlakeIsland";

const { BaseLayer } = LayersControl;

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const componentRef = useRef(null); // Create a ref for the component

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
        name: "Alki Reef",
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
      {
        name: "Sekiu",
        url: "/images/tiles/sekiu.png",
        bounds: [
          [48.25439, -124.30327], // Top-left corner
          [48.2853, -124.24267],
        ],
        opacity: 0.8,
      },
      {
        name: "Hoko",
        url: "/images/tiles/hoko1.png",
        bounds: [
          [48.26792, -124.35416], // Top-left corner
          [48.29231, -124.30095],
        ],
        opacity: 0.8,
      },
      {
        name: "Bullman",
        url: "/images/tiles/bullman.png",
        bounds: [
          [48.34537, -124.5664], // Top-left corner
          [48.37947, -124.5161],
        ],
        opacity: 0.8,
      },
      {
        name: "Neah",
        url: "/images/tiles/neah.png",
        bounds: [
          [48.36877, -124.62317], // Top-left corner
          [48.395, -124.56549],
        ],
        opacity: 0.8,
      },
      {
        name: "Kydaka",
        url: "/images/tiles/kydaka.png",
        bounds: [
          [48.2844848450342354, -124.4134099999999989], // Top-left corner
          [48.3061851549657462, -124.3533199999999965],
        ],
        opacity: 0.8,
      },
      {
        name: "Day Island",
        url: "/images/tiles/day-island.png",
        bounds: [
          [47.23833, -122.57213], // Top-left corner
          [47.25467, -122.55162],
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
    { name: "Alki Reef", position: [47.557, -122.408] },
    { name: "Blake Island Reef", position: [47.5295, -122.494] },
    { name: "Waterman Wall", position: [47.585167, -122.570667] },
    { name: "UNKNOWN WRECK", position: [47.505297, -122.392454] },
    { name: "Elliot Bay Pier", position: [47.626, -122.374] },
    { name: "Possession Point Ferry", position: [47.897, -122.3932] },
    { name: "YMS359", position: [47.66289027, -122.24050778] },
    { name: "PBM Mariner", position: [47.50560736, -122.21399939] },
    { name: "PV2 Harpoon", position: [47.69425, -122.25866667] },
    { name: "PB4Y", position: [47.67621733, -122.24121458] },
    { name: "Wolf Bay Wreck", position: [47.66498528, -122.25984639] },
    { name: "Wheeler", position: [47.5260778, -122.24347482] },
    { name: "Don Armeni Boat Launch", position: [47.5928, -122.38203] },
    { name: "Atlantic City Boat Launch", position: [47.5227802048354, -122.26314582769103] },

    // Add more pins as needed
  ];

  const customIcon = new Icon({ iconUrl: "/images/diving.png", iconSize: [20, 20] });

  // Define your second custom icon
  const customIcon2 = new Icon({ iconUrl: "/images/boat-launch.svg", iconSize: [37, 50] });

  // State to manage which component to render under the map
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Function to handle click on link in popup
  const handlePopupLinkClick = componentName => {
    // Set the selected component based on the link clicked
    setSelectedComponent(componentName);
    componentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const MapEvents = () => {
    useMapEvents({
      mousemove: e => {
        setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });

    return null;
  };

  return (
    <div className="mb-2 flex flex-col ">
      <div className=" flex pb-3 max-w-[1000px] justify-start  m-auto flex-col text-center ">
        <h1 className="text-3xl">Dive Map</h1>
        <p> Explore the dive sites. </p>
      </div>
      <div className="flex pb-3 max-w-[1000px] justify-center align-middle m-auto  ">
        <p className="m-4 bg-white shadow-lg rounded-md p-4 border-[1px] bg-opacity-60">
          Zoom in and click on a dive flag for more information, and use the layers button to switch
          background maps. The Nautical Chart reveals depths, while the bathymetry overlay unveils
          the underwater topography. Dive site visits depend on weather, tides, and currents. They
          are subject to change by the captain at any moment.
        </p>
      </div>
      <div className="flex justify-center flex-col z-1 ">
        {/* <Script src="https://unpkg.com/sql.js@0.3.2/js/sql.js"></Script>
      <Script src="https://unpkg.com/Leaflet.TileLayer.MBTiles@1.0.0/Leaflet.TileLayer.MBTiles.js"></Script> */}
        <MapContainer
          className="h-[550px] w-full md:h-[500px] shadow-md mb-2 "
          center={[47.69532618372522, -122.39365052155932]}
          zoom={10}
        >
          <LayersControl position="topright">
            <ScaleControl position="bottomleft" imperial={true} />
            <MapEvents />
            {loadPNGImages()}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={
                  marker.name === "Don Armeni Boat Launch" ||
                  marker.name === "Atlantic City Boat Launch"
                    ? customIcon2
                    : customIcon
                }
              >
                <Popup>
                  <button
                    className="text-blue-700 hover:text-blue-900"
                    onClick={() => handlePopupLinkClick(marker.name)}
                  >
                    {marker.name}
                  </button>
                </Popup>{" "}
              </Marker>
            ))}{" "}
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
          <div className=" text-sm mt-2  justify-evenly flex flex-col border-[1px] bg-white bg-opacity-60 shadow-md rounded-md p-3  w-[180px] m-auto">
            {" "}
            <p>Latitude: {coordinates.lat.toFixed(6)}</p>
            <p>Longitude: {coordinates.lng.toFixed(6)}</p>
          </div>{" "}
          <div ref={componentRef}>
            {selectedComponent === "Blakely Rock - Shangri-La" && <BlakelyRock />}
            {selectedComponent === "China Wall" && <ChinaWall />}
            {selectedComponent === "Decatur Reef" && <DecaturReef />}
            {selectedComponent === "The Boss" && <TheBoss />}
            {selectedComponent === "Likers Reef" && <LikersReef />}
            {selectedComponent === "Metridium Wall" && <MetridiumWall />}
            {selectedComponent === "Noranders Reef" && <NorandersReef />}
            {selectedComponent === "Vertical Barge" && <VerticalBarge />}
            {selectedComponent === "Deep Barge" && <DeepBarge />}
            {selectedComponent === "4 Mile Rock Barges" && <FourMileRockBarges />}
            {selectedComponent === "Alki Reef" && <AlkiReef />}
            {selectedComponent === "Blake Island Reef" && <BlakeIsland />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
