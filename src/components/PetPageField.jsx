import style from "../pages/loggedIn/SinglePet/singlepet.module.css";
import { useParams } from "react-router";
import { useState } from "react";

const PetPageField = (prop) => {
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();

  const setEditHandler = (e) => {
    setIsEditing(true);
  };

  const updatePetHandler = async (e) => {
    const desiredField = e.target[0].id; //takes id to know what to mutate
    e.preventDefault();
    const updated = e.target[0].value; // takes value from first input only
    const graphqlQuery = {
      query: `
      mutation{
        updatePet(
          id:"${params.petId}",
          petInput:{
          ${desiredField}: """${updated}"""
        }){
          description
        }
      }
          `,
    };
    console.log(graphqlQuery);
    const updateDatabase = async () => {
      const updated = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const updatedDescription = await updated.json();
      setIsEditing(false);
    };
    await updateDatabase();
    await prop.refresh(1);
  };

  return (
    <div className={style.generalinfo}>
      <h2>{prop.title}</h2>
      {!isEditing ? (
        <p>{prop.description}</p>
      ) : (
        <form className={style.flex} onSubmit={updatePetHandler}>
          <textarea
            id={prop.id}
            rows="5"
            cols="33"
            defaultValue={prop.description}
          />
          <button type="submit">Update</button>
        </form>
      )}

      <div className={style.edit}>
        <img
          onClick={setEditHandler}
          src="https://img.icons8.com/ios-glyphs/90/null/pencil--v1.png"
        />
      </div>
    </div>
  );
};

export default PetPageField;
