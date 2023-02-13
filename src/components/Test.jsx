import React from "react";
import GoogleMapReact from "google-map-react";
import googleAPI from "../API";
import TestMark from "./TestMark";

// const Test = ({ text }) => <div>{text}</div>;

export default function SimpleMap(props) {
  const lat = Number(props.lat);
  const long = Number(props.long);

  const defaultProps = {
    center: {
      lat: lat,
      lng: long,
    },
    zoom: 15,
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "90%", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleAPI }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
      >
        <TestMark lat={lat} lng={long} />
      </GoogleMapReact>
    </div>
  );
}
