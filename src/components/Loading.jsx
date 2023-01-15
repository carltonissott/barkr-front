import { Player } from "@lottiefiles/react-lottie-player";
import loadingicon from "../pages/assets/dog-walking.json";

const Loading = () => {
  return (
    <div className="loading">
      <Player
        autoplay
        loop
        src={loadingicon}
        style={{ height: "300px", width: "300px" }}
      ></Player>
      <p>Fetching Data...</p>
    </div>
  );
};

export default Loading;
