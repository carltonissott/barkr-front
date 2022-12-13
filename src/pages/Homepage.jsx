import styles from "../css/homepage.module.css";
import { Link } from "react-router-dom";
import Background from "../components/Background";
const Homepage = () => {
  return (
    <Background>
      <div className={styles.homepagebuttons}>
        <Link className={styles.link}>
          <button className={styles.button}>Found Pet </button>
        </Link>
        <Link className={styles.link}  to='./login'>
          <button className={styles.button}>Register Pet</button>
        </Link>
      </div>
    </Background>
  );
};

export default Homepage;
