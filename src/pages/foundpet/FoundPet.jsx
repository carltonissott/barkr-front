import { faMap, faMapLocation, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router";
import Background from "../../components/Background";
import UserBar from "../../components/UserBar";

import styles from "./foundpet.module.css";

const FoundPet = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState();

  const findPetHandler = async (e) => {
    e.preventDefault();
    const petId = e.target[0].value;

    //first serach database to make sure its a valid pet

    const graphqlQuery = {
      query: `
        query{
            lookupPet(id:"${petId}"){
              name
            }
          }
        `,
    };
    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      console.log("uh oh...");
      setAlert("This pet hasn't been registered yet!");
    } else {
      navigate(`./${petId}`);
    }

    //if not, tell user "May have not been registered yet"

    //if valid, forward user to /foundpet/PARAMNUMBER
  };
  return (
    <Background>
      <div className={styles.mainbackground}>
        <FontAwesomeIcon icon={faMapPin}/>
        <h1>Let's get this pet back home.</h1>

        <div className={styles.main}>
          <div className={styles.heading}>
            <h3>Please enter the code found on the pets collar.</h3>
          </div>
          <form onSubmit={findPetHandler}>
            <label htmlFor="pettag" hidden>
              Pet Tag ID Code:
            </label>
            <input
              type="text"
              id="pettag"
              placeholder="Ex. 9445S4Fw542"
              required
            />
            {alert && <p className={styles.alert}>{alert}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </Background>
  );
};

export default FoundPet;
