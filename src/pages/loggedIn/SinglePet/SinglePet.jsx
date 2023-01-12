import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Background from "../../../components/Background";
import PetPageField from "../../../components/PetPageField";
import useAuth from "../../../hooks/useAuth";
import style from "./singlepet.module.css";

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
    <Background>
      {isLoading ? (
        <p>Is loading...</p>
      ) : (
        <div className={style.background}>
          <div className={style.topheader}>
            <h1 className={style.h1}>Hi, I'm {petData.name}!</h1>
            <div className={style.imagecontainer}>
              {isEditing ? (
                <div className={style.imagemodal}>
                  <form
                    className={style.flex}
                    onSubmit={submitImageHandler}
                    encType="multipart/form-data"
                  >
                    <input type="file" />
                    <button type="submit">Submit!</button>
                  </form>
                </div>
              ) : (
                <div onClick={changeImageHandler} className={style.overlay}>
                  <img src="https://img.icons8.com/ios-glyphs/90/ffffff/pencil--v1.png" />
                </div>
              )}
              <img className={style.image} src={petData.image} />
            </div>
          </div>
          <PetPageField
            title={"Description"}
            id={"description"}
            description={petData.description}
            refresh={refreshHandler}
          />
          <button className={style.delete} onClick={deletePetHandler}>
            Delete Pet
          </button>
        </div>
      )}
    </Background>
  );
};

export default SinglePet;
