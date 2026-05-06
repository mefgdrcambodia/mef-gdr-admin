import React from "react";
import {
  CircleLoader,
  ClipLoader,
  RotateLoader,
  RingLoader,
  SyncLoader,
  BeatLoader,
} from "react-spinners";

function Loading(props) {
  const styles = {
    overlay: {
      position: "fixed", // Keeps it on top of everything
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(236, 236, 236, 0.74)", // White background with slight transparency
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Ensures it appears on top
    },
  };

  return (
    <div hidden={!props.is_loading} style={styles.overlay}>
      <div>
        <BeatLoader color="darkgreen" loading={true} size={20} />
      </div>
    </div>
  );
}

export default Loading;
