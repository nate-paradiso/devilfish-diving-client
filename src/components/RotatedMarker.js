import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-rotatedmarker"; // This small library is needed for the rotation to work

const RotatedMarker = props => {
  const markerRef = useRef(null);

  const { rotationAngle, ...rest } = props;

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setRotationAngle(rotationAngle);
    }
  }, [rotationAngle]);

  return <Marker ref={markerRef} {...rest} />;
};

export default RotatedMarker;
