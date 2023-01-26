import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import card from "./petcard.module.css";

const Petcard = (props) => {
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(`./${props.id}`);
  };

  return (
    <div onClick={onClickHandler} className={card.card}>
      <img
        alt="pet avatar"
        className={card.petavatar}
        src={`${props.image}`} //need to fix when launched
      />
      <h1 className={card.petName}>{props.petName}</h1>
      <FontAwesomeIcon icon={faBars} className={card.hamburger}/>
    </div>
  );
};
export default Petcard;
