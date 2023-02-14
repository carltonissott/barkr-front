import styles from "../css/homepage.module.css";
import { Link, useNavigate } from "react-router-dom";
import Background from "../components/Background";
import svg from "./assets/dogwalking.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRegistered,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Homepage = () => {
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate("/signup/register");
  };
  return (
    <Background>
      <div className={styles.main}>
        <div className={styles.containernew}>
          <div className={styles.welcome}>
            <h1 className={styles.title}>Welcome!</h1>
            <h3 className={styles.subtitle}>
              Click an option below or{" "}
              <a onClick={navigateHandler}>sign up </a>for your free account.
            </h3>
          </div>
          <div className={styles.container}>
            <div className={styles.homepagebuttons}>
              <Link className={styles.link} to="./foundpet">
                <button className={styles.button}>
                  <FontAwesomeIcon icon={faSearch} />
                  Found Lost Pet{" "}
                </button>
              </Link>
              <Link className={styles.link} to="./login">
                <button className={styles.button}>
                  <FontAwesomeIcon icon={faPlus} />
                  Register New Pet
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.svg}>
          <img src={svg} />
        </div>
      </div>
    </Background>
  );
};

export default Homepage;
