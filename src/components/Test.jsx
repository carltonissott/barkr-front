import React from "react";
import GoogleMapReact from "google-map-react";

const Test = ({ text }) => <div>{text}</div>;

export default function SimpleMap() {
  const defaultProps = {
    center: {
      lat: 29.6282944,
      lng: -82.3666405,
    },
    zoom: 11,
  };
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100%", width: "100%"}}>
      <GoogleMapReact
        bootstrapURLKeys={{key: "AIzaSyAyhjfvlqcKmeAiyyV1-7ybzmcnYPrz7p4"}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
      >
        <Test lat={29.682944} lng={-82.36664054} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
}
