import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  Polyline,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Default Leaflet marker fix (since React-Leaflet doesn't auto-load icons)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useMap } from "react-leaflet";
import RotatedMarker from "./RotatedMarker";
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

// New component to handle map invalidation on fullscreen change
const MapFullscreenHandler = () => {
  const map = useMap();
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Invalidate the map size to ensure it renders correctly after a fullscreen toggle
      map.invalidateSize();
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [map]);
  return null;
};

const RecenterButton = ({ position, zoom }) => {
  const map = useMap();
  const recenter = () => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  };

  return (
    <button
      onClick={recenter}
      className="absolute bottom-[190px] right-2.5 z-[1000] p-2 bg-white rounded-full shadow-lg border-[1px] border-gray-300 hover:bg-gray-100 transition-colors"
      disabled={!position}
      title="Recenter Map"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 10.5c0 3.86-1.73 7.54-5 9.87-1.35 1-3.26 1-4.62 0-3.27-2.33-5-6.01-5-9.87a7.5 7.5 0 0 1 15 0Z"
        />
      </svg>{" "}
    </button>
  );
};

// NEW: Component to center the map on the first fix
const RecenterOnFirstFix = ({ position, recenterOnFirstFix }) => {
  const map = useMap();
  useEffect(() => {
    if (position && recenterOnFirstFix.current) {
      map.setView(position, map.getZoom());
      recenterOnFirstFix.current = false; // Reset the flag after recentering
    }
  }, [position, recenterOnFirstFix, map]);
  return null;
};

// NEW: Component to center the map on location only when the button is active
const FollowLocation = ({ position, tracking, isFollowing }) => {
  const map = useMap();
  useEffect(() => {
    if (tracking && isFollowing && position) {
      map.panTo(position);
    }
  }, [position, tracking, isFollowing, map]);
  return null;
};

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const componentRef = useRef(null); // Create a ref for the component
  const mapContainerRef = useRef(null); // Ref for the map container for fullscreen
  const [heading, setHeading] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [position, setPosition] = useState(null);
  const watchIdRef = useRef(null);
  const [accuracy, setAccuracy] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [trackHistory, setTrackHistory] = useState([]);
  const [initialCenter] = useState([47.69532618372522, -122.39365052155932]);
  const [initialZoom] = useState(10);
  const recenterOnFirstFix = useRef(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [polylineDistance, setPolylineDistance] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  console.log(isFullscreen);

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  // NEW: UseEffect to calculate the total polyline distance whenever trackHistory changes
  useEffect(() => {
    let totalDistance = 0;
    if (trackHistory.length > 1) {
      for (let i = 0; i < trackHistory.length - 1; i++) {
        const [lat1, lng1] = trackHistory[i];
        const [lat2, lng2] = trackHistory[i + 1];
        totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
      }
    }
    // Convert meters to miles (1 meter = 0.000621371 miles)
    setPolylineDistance(totalDistance * 0.000621371);
  }, [trackHistory]);

  // / NEW: useEffect to listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
      {
        name: "Elliot Bay Pier",
        url: "/images/tiles/Elliot-bay-pier.png",
        bounds: [
          [47.625, -122.37592], // Top-left corner
          [47.62628, -122.37266],
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
    { name: "China Wall", position: [47.5941, -122.4823] },
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
    { name: "The General", position: [47.505297, -122.392454] },
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
    { name: "Magnuson Park Boat Launch", position: [47.67693572493897, -122.25001765191007] },
    {
      name: "Newport Shores Boat Launch",
      position: [47.575024355970186, -122.18883747206701],
    },
    {
      name: "Eddie Vine Boat Launch",
      position: [47.68691938752875, -122.40328909825571],
    },
    { name: "520 Burned Hull #2", position: [47.64435, -122.27058333] },
    { name: "Atlantic City Scow", position: [47.5253072, -122.25207042] },
    { name: "Arrowhead Point Barge", position: [47.7373314, -122.26950711] },
    { name: "Avenger", position: [47.67497544, -122.22336867] },
    { name: "Boot", position: [47.52270041, -122.25423467] },
    { name: "Cannery Tender", position: [47.64946306, -122.26731114] },
    { name: "Coal Cars", position: [47.6327, -122.257] },
    { name: "Corsair", position: [47.63433615, -122.27302943] },
    { name: "Dawn", position: [47.52233648, -122.25302539] },
    { name: "Diamond Girl", position: [47.52342604, -122.25704704] },
    { name: "Dowell", position: [47.63022743, -122.27068874] },
    { name: "Elfin", position: [47.66104818, -122.2247931] },
    { name: "Falcon", position: [47.67213997, -122.2341587] },
    { name: "Foss 75", position: [47.69392716, -122.24671061] },
    { name: "Fresno", position: [47.60788889, -122.23966667] },
    { name: "Hauled Barge", position: [47.52552985, -122.25124066] },
    { name: "Hauler", position: [47.52636667, -122.25163333] },
    { name: "Healy's, YMS416", position: [47.6658454, -122.23886194] },
    { name: "Landing Craft", position: [47.51247719, -122.21107051] },
    { name: "Lt Hass, Acme", position: [47.60579179, -122.27509632] },
    { name: "PA-d3 Barge", position: [47.52397019, -122.24986201] },
    { name: "Sailboat - 20'", position: [47.54675867, -122.24264574] },
    { name: "Scattered Barge", position: [47.52208122, -122.25557039] },
    { name: "Scout", position: [47.65795, -122.21801667] },
    { name: "Snickerdoodle", position: [47.52253345, -122.26030243] },
    { name: "Sonny", position: [47.52273449, -122.24876758] },
    { name: "Tilted Barge", position: [47.65651222, -122.25236028] },
    { name: "Valiant", position: [47.70596547, -122.25218452] },
    { name: "Vixen", position: [47.60868282, -122.24307474] },
    { name: "Wave, Zippy", position: [47.68179206, -122.23591624] },
    { name: "Wildcat", position: [47.61281385, -122.25561133] },
    { name: "Wooden Scow #2", position: [47.64522686, -122.27349751] },
    { name: "YMS-118;124;311", position: [47.66785715, -122.24131321] },

    // Add more pins as needed
  ];

  const customIcon = new Icon({ iconUrl: "/images/diving.png", iconSize: [20, 20] });

  // Define your second custom icon
  const customIcon2 = new Icon({ iconUrl: "/images/boat-launch.svg", iconSize: [37, 50] });

  // Nav Icon
  const arrowIcon = new Icon({
    iconUrl: "/images/arrow-icon.png", // path in public folder
    iconSize: [40, 40], // adjust size to your image
    iconAnchor: [20, 20], // center the boat on location
    popupAnchor: [0, -20], // popup appears above the boat
  });

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
  const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  // Function to follow user

  useEffect(() => {
    if (tracking) {
      if (navigator.geolocation) {
        // Start watching the position
        const id = navigator.geolocation.watchPosition(
          pos => {
            // Get all the data from the position object
            const { latitude, longitude, heading, accuracy, speed } = pos.coords;
            const newPosition = [latitude, longitude];

            // All state updates must happen inside this callback function
            setPosition(newPosition);
            setHeading(heading || 0);
            setAccuracy(accuracy);
            setSpeed(speed);

            // This is the correct place to update the track history
            setTrackHistory(prevHistory => [...prevHistory, newPosition]);
          },
          err => {
            console.error(err);
            setTracking(false);
          },
          { enableHighAccuracy: true },
        );
        // Store the ID in a ref
        watchIdRef.current = id;
      } else {
        alert("Geolocation not supported by your browser.");
        setTracking(false);
      }
    } else {
      // Clean up the watcher when tracking is turned off
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setPosition(null);
        // Clear the history when tracking stops

        setIsFollowing(false);
      }
    }

    // Cleanup function for useEffect
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [tracking]); // The effect runs whenever the 'tracking' state changes

  // The toggle function just flips the state
  const toggleTracking = () => {
    setTracking(prevTracking => {
      // Set the flag to true if we are about to start tracking
      recenterOnFirstFix.current = !prevTracking;
      return !prevTracking;
    });
  };

  const toggleFollowing = () => {
    setIsFollowing(prev => !prev);
  };
  // Function to toggle full-screen mode
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (mapContainerRef.current) {
      mapContainerRef.current.requestFullscreen();
    }
  };

  const clearPolyline = () => {
    setTrackHistory([]);
    setPolylineDistance(0); // Reset distance to 0 as well
  };

  return (
    <div className="mb-2 flex flex-col mt-4 ">
      <div className=" flex max-w-[1000px] justify-center items-center  m-auto flex-col text-center ">
        <h1 className="text-3xl">Dive Map</h1>
        <p> Explore the dive sites. </p>
        <Image
          className="h-auto w-[125px] md:w-[200px] p-1" // Consistent responsive sizing
          src="/images/gpologo-invert.png"
          alt="Devilfish Logo"
          width={600}
          height={272}
        />{" "}
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
        {/* The new parent div with relative positioning */}
        <div
          ref={mapContainerRef}
          className="h-[600px] w-full md:h-[500px] shadow-md mb-2 relative"
        >
          <MapContainer
            className="h-full w-full"
            center={[47.69532618372522, -122.39365052155932]}
            zoom={10}
            zoomControl={false}
          >
            <LayersControl position="topright">
              <ScaleControl position="bottomleft" imperial={true} />
              <MapEvents />
              <MapFullscreenHandler /> {/* Add the fullscreen handler here */}
              <ZoomControl position="bottomright" />
              {loadPNGImages()}
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  icon={
                    marker.name === "Don Armeni Boat Launch" ||
                    marker.name === "Newport Shores Boat Launch" ||
                    marker.name === "Magnuson Park Boat Launch" ||
                    marker.name === "Atlantic City Boat Launch" ||
                    marker.name === "Eddie Vine Boat Launch"
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
              {position && (
                <>
                  <RotatedMarker
                    position={position}
                    icon={arrowIcon}
                    rotationAngle={heading || 0}
                    rotationOrigin="center"
                  />
                  {/* <RecenterMap position={position} /> */}
                </>
              )}
              {/* This is the new Polyline component */}
              {trackHistory.length > 0 && (
                <Polyline pathOptions={{ color: "#FFD700", weight: 4 }} positions={trackHistory} />
              )}
              <BaseLayer name="Esri World Imagery">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution=""
                  maxZoom={21}
                />
              </BaseLayer>{" "}
              <BaseLayer name="Nautical Chart - Depth in m">
                <TileLayer
                  url="https://www.marinetraffic.com/TMS/1.0.0/TX97/{z}/{x}/{y}.png?v=3"
                  minZoom={0}
                  maxZoom={18}
                  attribution=""
                />
              </BaseLayer>
              <BaseLayer checked name="Open Street">
                <TileLayer
                  attribution=""
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={20}
                />
              </BaseLayer>
              <LayersControl.Overlay checked name="NOAA Bag Relief Model">
                <TileLayer
                  url="https://tiles.arcgis.com/tiles/C8EMgrsFcRFL6LrL/arcgis/rest/services/bag_hillshades/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; <a href="https://www.ncei.noaa.gov/maps/bathymetry/" target="_blank">NOAA/NCEI</a>'
                  maxNativeZoom={15}
                  maxZoom={21}
                  opacity={0.9}
                />
              </LayersControl.Overlay>{" "}
            </LayersControl>
            {/* SIMPLE CROSS ICON FOR FOLLOW BUTTON */}
            <button
              onClick={toggleFollowing}
              className={`absolute bottom-[240px] right-2.5 z-[1000] p-2 rounded-full shadow-lg border-[1px] border-gray-300 transition-colors ${
                isFollowing
                  ? "bg-sky-700 text-white hover:bg-sky-700 active:bg-sky-700"
                  : "bg-white text-gray-700 active:bg-white md:hover:bg-gray-100"
              }`}
              disabled={!position || !tracking}
              title="Toggle Follow Me"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15M4.5 12h15" />
              </svg>
            </button>{" "}
            <RecenterButton position={position} />
            <RecenterOnFirstFix position={position} recenterOnFirstFix={recenterOnFirstFix} />
            <FollowLocation position={position} tracking={tracking} isFollowing={isFollowing} />
          </MapContainer>
          {/* NEW: Clear Polyline Button */}
          <button
            onClick={clearPolyline}
            className="absolute bottom-[50px] left-2.5 z-[1000] p-2 bg-white rounded-full shadow-lg border-[1px] border-gray-300 hover:bg-gray-100 transition-colors"
            title="Clear Polyline"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.918a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.166m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.918a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12-.562c.34-.059.68-.114 1.022-.166"
              />
            </svg>
          </button>
          {/* This is the new full-screen button */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-[140px] right-2.5 z-[1000] p-2 bg-white rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              // Correct Exit Fullscreen Icon (arrows pointing inward)
              <svg
                className="w-6 h-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Correct Enter Fullscreen Icon (arrows pointing outward)
              <svg
                className="w-6 h-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15.75M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15.75"
                />
              </svg>
            )}
          </button>{" "}
          {/* The Button */}
          <button
            onClick={toggleTracking}
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] text-white bg-opacity-90 p-3 rounded-md shadow-lg text-sm" ${
              tracking ? " bg-red-700 hover:bg-red-600" : "bg-sky-700 hover:bg-sky-600"
            }`}
          >
            {tracking ? "Stop Tracking" : "Start Tracking"}
          </button>
          {/* This is the new floating information box */}
          {tracking && position && (
            <div className="absolute top-[10px] left-2.5 z-[1000] bg-white bg-opacity-90 p-3 rounded-md shadow-lg text-sm">
              <p className="font-bold text-lg">Position Info</p>
              <hr className="my-1" />
              <p>Lat: {position[0].toFixed(6)}</p>
              <p>Lng: {position[1].toFixed(6)}</p>

              <p>
                Distance: <span className="font-bold">{polylineDistance.toFixed(2)} mi</span>
              </p>
              {accuracy !== null && (
                <p>
                  <span className="font-bold text-xl">&plusmn; </span>
                  <span className="font-bold text-xl">{(accuracy * 3.28084).toFixed(1)}ft</span>
                </p>
              )}

              {heading !== null && (
                <p>
                  <span className="font-bold text-xl">{heading.toFixed(0)}°</span>
                </p>
              )}
              {speed !== null && (
                <p>
                  <span className="font-bold text-3xl">{(speed * 2.237).toFixed(1)}mph</span>
                </p>
              )}
            </div>
          )}
        </div>
        <div className="">
          <div className="flex justify-center items-center gap-4 mt-1 mb-4 ml-2 mr-2">
            {/* The Lat/Long Display Div */}
            <div className="text-sm flex flex-col border-[1px] bg-white bg-opacity-60 shadow-md rounded-md p-3">
              <p>Lat: {coordinates.lat.toFixed(6)}</p>
              <p>Lng: {coordinates.lng.toFixed(6)}</p>
            </div>
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
