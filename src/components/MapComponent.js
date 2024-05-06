import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const { BaseLayer } = LayersControl;

const MapComponent = () => {
  return (
    <div className="flex justify-center">
      <MapContainer
        className="h-[400px] w-full md:w-[1000px] md:h-[600px]"
        center={[47.605932, -122.448144]}
        zoom={10}
      >
        <LayersControl position="topright">
          <BaseLayer name="Esri Ocean Basemap">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={13}
            />
          </BaseLayer>
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer checked name="USGS.USImagery">
            <TileLayer
              attribution="Imagery provided by services from the U.S. Geological Survey"
              url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19} // Maximum zoom level supported by the USGS Imagery service
            />{" "}
          </BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
