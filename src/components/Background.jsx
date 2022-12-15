import React from "react";
import UserBar from "./UserBar";
const Background = (props) => {
  return (
    <>
      <UserBar />
      <div className="window">{props.children}</div>
    </>
  );
};
export default Background;
