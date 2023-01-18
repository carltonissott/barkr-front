import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Background from "../../../components/Background";
import PetPageField from "../../../components/PetPageField";
import useAuth from "../../../hooks/useAuth";
import style from "./singlepet.module.css";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../../components/Loading";
import SimpleMap from "../../../components/Test";
import UserBar from "../../../components/UserBar";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const SinglePet = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [petData, setPetData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchPet();
  }, [PetPageField, refreshKey]);

  const navigate = useNavigate();

  const fetchPet = async () => {
    setIsLoading(true);
    const graphqlQuery = {
      query: `
          {pet(id:"${params.petId}"){
              name
              image
              description
          }}
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
    setPetData(data.data.pet);
    setIsLoading(false);
  };

  const updatePetHandler = (e) => {
    const desiredField = e.target[0].id; //takes id to know what to mutate
    console.log(desiredField);
    e.preventDefault();
    const updated = e.target[0].value; // takes value from first input only
    const graphqlQuery = {
      query: `
      mutation{
        updatePet(
          id:"${params.petId}",
          petInput:{
          ${desiredField}: "${updated}"
        }){
          description
        }
      }
          `,
    };
    const updateDatabase = async () => {
      const updated = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const updatedDescription = await updated.json();
      setRefreshKey(refreshKey + 1);
      setIsEditing(false);
    };
    updateDatabase();
  };

  const changeImageHandler = () => {
    setIsEditing(true);
  };

  const refreshHandler = (e) => {
    fetchPet();
  };

  const submitImageHandler = async (e) => {
    e.preventDefault();
    console.log(e);
    if (!e.target[0].files[0]) {
      setIsEditing(false);
      return;
    }
    const formData = new FormData();
    formData.append("image", e.target[0].files[0]);
    const imageUrl = await fetch("http://localhost:8080/post-image", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });
    const decoded = await imageUrl.json();
    const image = await decoded.filePath.replace(/\\/g, "/");
    console.log(image);
    const graphqlQuery = {
      query: `
      mutation{
        updatePet(
          id:"${params.petId}",
          petInput:{
            image: "${image}"
        }){
          description
        }
      }`,
    };
    await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    setIsEditing(false);
    setRefreshKey(refreshKey + 1);
  };

  const deletePetHandler = async () => {
    const graphqlQuery = {
      query: `
        mutation{
          deletePet(petId:"${params.petId}")
        
      }`,
    };
    await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    navigate('/dashboard')
  };

  useAuth()

  return (
    <div className={style.background}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={style.main}>

          <div>
            <div className={style.top}>
              <div className={style.profilepic}>
                <img src="https://d17fnq9dkz9hgj.cloudfront.net/uploads/2012/11/153558006-tips-healthy-cat-632x475-390x293.jpg" />{" "}
              </div>
            </div>
            <div className={style.basicdetails}>
              <div className={style.shortinfo}>
                <div className={style.name}>
                  <h3>{petData.name} <FontAwesomeIcon className={style.iconedit} icon={faEdit}/></h3>
                  
                </div>
                <div />
                <div className={style.sex}>
                  <img src="https://img.icons8.com/color/96/null/male.png" />
                </div>
                <div className={style.breed}>
                  <img src="https://img.icons8.com/ios-glyphs/90/999999/pet-commands-train.png" />
                  <h3>Tabby <FontAwesomeIcon className={style.iconedit} icon={faEdit}/></h3>
                </div>
                <div />
                <div className={style.age}>
                  <h3>1 year old</h3>
                </div>
              </div>
              <h2>About Pet</h2>
              <p>
                {petData.description} <FontAwesomeIcon className={style.iconedit} icon={faEdit}/>
              </p>
            </div>
            <section className={style.vaccination}>
              <h2>Vaccination/Medical Status</h2>
              <ul>
                <li>Revolution (02/03) </li>
                <li>Rabies (11/29) </li>
              </ul>
            </section>
            <div className={style.lightpink}>
              <section className={style.mapsection}>
                <h3>My Home:</h3>
                <div className={style.mapbox}>
                  <SimpleMap />
                </div>
              </section>
              <section className={style.contactInfo}>
                <div className={style.icon}>
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className={style.firstName}>
                  <h4>Carlton Issott</h4>
                </div>
                <div className={style.phoneNumber}>
                  <h5>321-544-0711</h5>
                </div>
                <div className={style.city}>
                  <FontAwesomeIcon icon={faLocationPin} />
                  <h5> Gainesville, Fl</h5>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePet;


// <Background>
// {isLoading ? (
//   <p>Is loading...</p>
// ) : (
//   <div className={style.background}>
//     <div className={style.topheader}>
//       <h1 className={style.h1}>Hi, I'm {petData.name}!</h1>
//       <div className={style.imagecontainer}>
//         {isEditing ? (
//           <div className={style.imagemodal}>
//             <form
//               className={style.flex}
//               onSubmit={submitImageHandler}
//               encType="multipart/form-data"
//             >
//               <input type="file" />
//               <button type="submit">Submit!</button>
//             </form>
//           </div>
//         ) : (
//           <div onClick={changeImageHandler} className={style.overlay}>
//             <img src="https://img.icons8.com/ios-glyphs/90/ffffff/pencil--v1.png" />
//           </div>
//         )}
//         <img className={style.image} src={petData.image} />
//       </div>
//     </div>
//     <PetPageField
//       title={"Description"}
//       id={"description"}
//       description={petData.description}
//       refresh={refreshHandler}
//     />
//     <button className={style.delete} onClick={deletePetHandler}>
//       Delete Pet
//     </button>
//   </div>
// )}
// </Background>