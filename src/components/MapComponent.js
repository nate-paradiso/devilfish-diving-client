import React from "react";
import { MapContainer, TileLayer, LayersControl, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer } = LayersControl;

const MapComponent = () => {
  // Function to load PNG images as overlays
  const loadPNGImages = () => {
    const pngImages = [
      {
        url: "/images/tiles/blakely-rock.png",
        bounds: [
          [47.59222, -122.48403], // Top-left corner
          [47.59809, -122.47479], // Bottom-right corner
        ],
        opacity: 0.8, // Opacity value (0 to 1)
      },
      {
        url: "/images/tiles/alki-rock-reef.png",
        bounds: [
          [47.55537, -122.41015],
          [47.55827, -122.40546],
        ],
        opacity: 0.7,
      },
      {
        url: "/images/tiles/4mile-rock-barges.png",
        bounds: [
          [47.63892, -122.42866], // Top-left corner
          [47.64147, -122.42537],
        ],
        opacity: 0.7,
      },
      // Add more PNG images as needed
    ];

    return pngImages.map((image, index) => (
      <ImageOverlay key={index} url={image.url} bounds={image.bounds} opacity={image.opacity} />
    ));
  };

  return (
    <div className="flex justify-center">
      <MapContainer
        className="h-[400px] w-full md:w-[1000px] md:h-[600px]"
        center={[47.605932, -122.448144]}
        zoom={10}
      >
        {loadPNGImages()}
        <LayersControl position="topright">
          <BaseLayer checked name="Esri Ocean Basemap">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Stadia.AlidadeSatellite">
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}"
              minZoom={0}
              maxZoom={20}
              attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="jpg"
            />
          </BaseLayer>
          <BaseLayer name="Nautical Chart">
            <TileLayer
              url="https://www.marinetraffic.com/TMS/1.0.0/TX97/{z}/{x}/{y}.png?v=3"
              minZoom={0}
              maxZoom={20}
              attribution="&copy; Marine Traffic"
            />
          </BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
