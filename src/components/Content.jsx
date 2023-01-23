import {
  faArrowRight,
  faPhone,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import style from "./content.module.css";

const Content = (props) => {
  const [contentType, setContentType] = useState();
  return (
    <div>
      {props.data.type == "medical" && (
        <section className={style.vaccination}>
          <h2>Vaccination/Medical Status</h2>
          <ul>
            {props.data.bullets.map((index) => {
              return <li>{props.data.bullets[0]}</li>;
            })}
          </ul>
        </section>
      )}
      {props.data.type == "contact" && (
        <section className={style.contact}>
          <h2>Important Contacts</h2>
          <ul>
            <li>
              <FontAwesomeIcon fixedWidth icon={faPerson} />{" "}
              {props.data.bullets[0]}
            </li>
            <li>
              <FontAwesomeIcon icon={faPhone} fixedWidth />{" "}
              {props.data.bullets[1]}
            </li>
            <li>
              <FontAwesomeIcon icon={faArrowRight} fixedWidth />{" "}
              {props.data.bullets[2]}
            </li>
          </ul>
        </section>
      )}
      {props.data.type == "misc" && <h2>Misc</h2>}
    </div>
  );
};

export default Content;

{
}
{
  /* <div className={style.editdeleteicons}>
<FontAwesomeIcon icon={faTrash} />
</div> */
}
