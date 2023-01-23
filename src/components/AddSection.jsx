import style from "./addsection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClipboard,
  faPhone,
  faPlus,
  faSyringe,
  faUserDoctor,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useParams } from "react-router";

const AddSection = (props) => {
  const params = useParams();

  const [format, setFormat] = useState("medical");
  const [fieldCount, setFieldCount] = useState([1]);

  const closeModal = (e) => {
    props.status(false);
  };

  const addFieldCount = (e) => {
    e.preventDefault();

    setFieldCount([...fieldCount, 1]);
  };

  const changeFormatHandler = (e) => {
    setFormat(e.target.value);
    setFieldCount([1]);
  };

  const addSection = async (e) => {
    e.preventDefault();
    console.log(e);

    const type = e.target[0].value;

    var graphqlQuery

    if (type == "contact") {
      const name = e.target[1].value;
      const tel = e.target[2].value;
      const occupation = e.target[3].value;

      graphqlQuery = {
        query: `
            mutation{
                updatePetContent(id:"${params.petId}",
                content:{
                    type: "contact"
                    bullets: ["${name}", "${tel}","${occupation}"]
                }){
                    type
                }
            }`,
      };
    } else if (type == "medical") {
        const length = fieldCount.length + 1

        const medicineArray = []

        for (let index = 1; index <length; index++) {
            medicineArray.push(e.target[index].value) 
        }

        const stringify = JSON.stringify(medicineArray) //stringify's array

        graphqlQuery = {
            query: `
                mutation{
                    updatePetContent(id:"${params.petId}",
                    content:{
                        type: "medical"
                        bullets: ${stringify}
                    }){
                        type
                    }
                }`,
          };

          console.log(medicineArray)
    

    } else {
      const title = e.target[1].value;
      const miscbody = e.target[2].value;

      graphqlQuery = {
        query: `
            mutation{
                updatePetContent(id:"${params.petId}",
                content:{
                    type: "misc"
                    bullets: ["${title}", "${miscbody}"]
                }){
                    type
                }
            }`,
      };

    }

    const updateDatabase = async () => {
      const updated = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const updatedContent = await updated.json();
     closeModal()
    };
    updateDatabase();
  
  };

  return (
    <div className={style.modal}>
      <form className={style.modalinner} onSubmit={addSection}>
        <h3>Add section.</h3>
        <div className={style.select}>
          <FontAwesomeIcon icon={faClipboard} />
          <select onChange={changeFormatHandler} name="format">
            <option value="medical">Medical</option>
            <option value="contact">Additional Contact</option>
            <option value="misc">Misc</option>
          </select>
        </div>
        <hr />
        {format == "medical" && (
          <>
            {fieldCount.map((misc) => {
              return (
                <div className={style.fieldinput}>
                  <FontAwesomeIcon icon={faSyringe} />{" "}
                  <input
                    type="text"
                    placeholder="Ex. Revolution (applied 12/31)"
                  />
                </div>
              );
            })}

            <button className={style.addField} onClick={addFieldCount}>
              <FontAwesomeIcon icon={faPlus} /> Add Field
            </button>
          </>
        )}
        {format == "contact" && (
          <>
            <div className={style.name}>
              <label htmlFor="name">
                <FontAwesomeIcon fixedWidth icon={faUserPlus} />
              </label>
              <input id="name" type="text" placeholder="John Smith" />
            </div>
            <div className={style.telephone}>
              <label htmlFor="tel">
                <FontAwesomeIcon fixedWidth icon={faPhone} />
              </label>
              <input id="tel" type="tel" placeholder="321 544 0711" />
            </div>
            <div className={style.occupation}>
              <label htmlFor="occupation">
                <FontAwesomeIcon fixedWidth icon={faUserDoctor} />
              </label>
              <input id="occupation" type="text" placeholder="Vet" />
            </div>
          </>
        )}
        {format == "misc" && (
          <>
            <label htmlFor="title" hidden>
              Title:
            </label>
            <input type="text" id="title" placeholder="Enter your title here" />
            <label htmlFor="body" hidden>
              Body:
            </label>
            <textarea placeholder="Enter your body text here! Tux is a great cat and his favorite treat is bacon!"></textarea>
          </>
        )}
        <div className={style.bottombutton}>
          <button className={style.submit} type="submit">
            <FontAwesomeIcon icon={faCheck} /> Add Section
          </button>
          <button className={style.cancel} onClick={closeModal}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSection;
