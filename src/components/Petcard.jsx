import card from "./petcard.module.css";
const Petcard = (props) => {
  return (
    <div className={card.card}>
      <img
        alt="pet avatar"
        class={card.petavatar}
        src="https://dogsbestlife.com/wp-content/uploads/2022/06/cutest-dog-breeds-scaled-e1655990275393.jpeg"
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
