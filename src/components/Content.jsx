import {
  faArrowRight,
  faPhone,
  faPerson,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { createRef, useState } from "react";
import { useParams } from "react-router";
import style from "./content.module.css";
import { v4 as uuidv4 } from "uuid";

const Content = (props) => {

  const params = useParams();


  const elementRef = useRef(props.data.bullets.map(() => createRef()));

  const removeContent = async (id) => {
    const graphqlQuery = {
      query: `
          mutation{deleteContent(petId:"${params.petId}", contentId:"${id}" )
          }
          `,
    };
    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    const data = await response.json();
    props.refreshKey(data);
  };

  const deleteHandler = (e) => {
    e.preventDefault();
    var id;
    if (props.data.type == "medical" || props.data.type == "misc") {
      id = props.data._id;
    } else {
      id = elementRef.current[e.currentTarget.id].current.id;
    }
    removeContent(id);
  };

  return (
    <div key={uuidv4()}>
      {props.data.type == "medical" && (
        <section className={style.vaccination} key={uuidv4()}>
          <h2>Vaccination/Medical Status</h2>
          <ul>
            {props.data.bullets.map((index) => {
              return <li key={uuidv4()}>{index}</li>;
            })}
          </ul>
          {props.edit && (
            <button className={style.none} onClick={deleteHandler}>
              <FontAwesomeIcon className={style.trashvaccine} icon={faTrash} />
            </button>
          )}
        </section>
      )}
      {props.data.type == "contact" && (
        <section className={style.contact} key={uuidv4()}>
          <h2>Important Contacts</h2>
          <div className={style.contactgrid}>
            {props.data.bullets.map((e, i) => {
              return (
                <ul ref={elementRef.current[i]} id={e[3]} key={uuidv4()}>
                  <li>
                    <FontAwesomeIcon fixedWidth icon={faPerson} /> {e[0]}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faPhone} fixedWidth />{" "}
                    <a href={"tel:" + e[1]}>{e[1]}</a>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faArrowRight} fixedWidth /> {e[2]}
                  </li>
                  {props.edit && (
                    <button
                      className={style.none}
                      onClick={deleteHandler}
                      id={i}
                    >
                      <FontAwesomeIcon className={style.trash} icon={faTrash} />
                    </button>
                  )}
                </ul>
              );
            })}
          </div>
        </section>
      )}
      {props.data.type == "misc" && (
        <section className={style.misc} key={uuidv4()}>
          <h2>{props.data.bullets[0]}</h2>
          <p>{props.data.bullets[1]}</p>
          {props.edit && (
            <button className={style.none} onClick={deleteHandler}>
              <FontAwesomeIcon className={style.trashvaccine} icon={faTrash} />
            </button>
          )}
        </section>
      )}
    </div>
  );
};

export default Content;
