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
      <img
        className={card.hamburger}
        alt="hamburger-menu"
        src="https://img.icons8.com/external-tal-revivo-regular-tal-revivo/384/null/external-hamburger-menu-list-with-parallel-navigation-button-basic-regular-tal-revivo.png"
      />
    </div>
  );
};
export default Petcard;
