import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Background from "../../../components/Background";
import PetPageField from "../../../components/PetPageField";
import useAuth from "../../../hooks/useAuth";
import style from "./singlepet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../../components/Loading";
import SimpleMap from "../../../components/Test";
import UserBar from "../../../components/UserBar";
import {
  faEdit,
  faPhone,
  faTrash,
  faLocationPin,
  faMars,
  faVenus,
  faAdd,
  faSignature,
  faCat,
  faDog,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import AddSection from "../../../components/AddSection";
import Content from "../../../components/Content";
import { createRef } from "react";

const SinglePet = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [petData, setPetData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [modal, setModal] = useState(false);
  const [petContent, setPetContent] = useState([]);
  const [age, setAge] = useState(null);

  useEffect(() => {
    fetchPet();
  }, [PetPageField, refreshKey]);

  const updateRefreshKey = (e) => {
    setRefreshKey(refreshKey + 1);
  };

  const navigate = useNavigate();

  const fetchPet = async () => {
    setIsLoading(true);
    const graphqlQuery = {
      query: `
          {pet(id:"${params.petId}"){
              name
              image
              description
              type
              breed
              gender
              birth
              content{
                _id
              }
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
    const birthDate = new Date(data.data.pet.birth);
    const todayDate = new Date();
    var years =
      Math.floor((todayDate - birthDate) / 31556952000) + " years old";
    if (Math.floor((todayDate - birthDate) / 31556952000) == 0) {
      years = Math.floor((todayDate - birthDate) / 2629800000) + " months old";
    }
    setAge(years);
    fetchContent(data.data.pet.content);
    const timer1 = setTimeout(() => setIsLoading(false), 500);
    return () => {
      clearTimeout(timer1);
      setIsLoading(false);
    };
  };

  const fetchContent = (content) => {
    var array = [];
    const fetchPetContent = async (element) => {
      const graphqlQuery = {
        query: `
              {content(id:"${element._id}"){
              type
              bullets
              _id
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
      const i = array.findIndex((e) => e.content.type == "contact");
      if (i > -1 && data.data.content.type == "contact") {
        const tempArray = data.data.content.bullets;
        tempArray.push(data.data.content._id);
        array[i].content.bullets.push(tempArray);
        // );
      } else if (data.data.content.type == "contact") {
        const tempArray = data.data.content.bullets;
        tempArray.push(data.data.content._id);
        array.push({
          content: {
            type: "contact",
            bullets: [tempArray],
          },
        });
      } else {
        array.push(data.data);
      }
      console.log(array);
      setPetContent(array);
    };
    content.forEach((element) => {
      fetchPetContent(element);
    });
  };

  const updatePetHandler = (e) => {
    e.preventDefault();
    var gender = "female";
    if (e.target[3].checked) {
      gender = "male";
    }
    const graphqlQuery = {
      query: `
      mutation{
        updatePet(
          id:"${params.petId}",
          petInput:{
          name: "${e.target[2].value}"
          gender:"${gender}"
          birth:"${calRef.current.value}"
          breed: "${e.target[5].value}"
          description: "${e.target[7].value}"
      
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
      setEditing(false);
    };
    updateDatabase();
  };


  const refreshHandler = (e) => {
    fetchPet();
  };

  const uploadImageHandler = async (e) => {
    e.preventDefault();
    console.log(e);
    if (!e.target.files[0]) {
      return;
    }
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
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
    navigate("/dashboard");
  };

  const editModeHandler = (e) => {
    e.preventDefault();
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    setModal(true);
  };

  const closeModal = (e) => {
    setModal(e);
  };

  const testFunctio = (e) => {
    e.preventDefault();
    console.log(calRef.current.value);
  };

  const calRef = createRef();

  useAuth();

  
  return (
    <>
      <UserBar />

      <div className={style.background}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={style.main}>
            <div>
              {!editing ? (
                <>
                  <div className={style.top}>
                    <div className={style.edit}>
                      <button onClick={editModeHandler}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={deletePetHandler}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className={style.profilepic}>
                      <img src={`${petData.image}`} />
                    </div>
                  </div>
                  <div className={style.basicdetails}>
                    <div className={style.shortinfo}>
                      <div className={style.name}>
                        <h3>{petData.name} </h3>
                      </div>
                      <div className={style.sex}>
                        {petData.gender == "male" && (
                          <FontAwesomeIcon icon={faMars} />
                        )}
                        {petData.gender == "female" && (
                          <FontAwesomeIcon icon={faVenus} />
                        )}
                      </div>
                      <div className={style.breed}>
                        {petData.type == "dog" && (
                          <FontAwesomeIcon icon={faDog} />
                        )}
                        {petData.type == "cat" && (
                          <FontAwesomeIcon icon={faCat} />
                        )}

                        {/* <img src="https://img.icons8.com/ios-glyphs/90/999999/pet-commands-train.png" /> */}
                        <h3>{petData.breed} </h3>
                      </div>
                      <div className={style.age}>
                        <h3>{age}</h3>
                      </div>
                    </div>
                    <h2>About Pet</h2>
                    <p>{petData.description}</p>
                  </div>
                  {petContent.map((element) => {
                    return (
                      <Content
                        key={element}
                        data={element.content}
                        edit={editing}
                      />
                    );
                  })}

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
                </>
              ) : (
                <>
                  {modal && (
                    <AddSection
                      status={closeModal}
                      refreshKey={updateRefreshKey}
                    />
                  )}

                  <form className={style.editForm} onSubmit={updatePetHandler}>
                    <div className={style.top}>
                      <div className={style.edit}>
                        <button onClick={editModeHandler}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={deletePetHandler}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                      <div className={style.editprofilepic}>
                        <div
                          className={style.editprofilepicicon}
                        >
                          <label htmlFor="imageupload">
                            <FontAwesomeIcon icon={faEdit} />
                          </label>
                          <input onChange={uploadImageHandler} type="file" id="imageupload" />
                        </div>
                        <img src={`${petData.image}`}/>
                      </div>
                    </div>
                    <div className={style.basicdetails}>
                      <div className={style.shortinfo}>
                        <div className={style.name}>
                          <FontAwesomeIcon
                            fixedWidth
                            icon={faSignature}
                            color="#999999"
                          />
                          <input type="text" defaultValue={petData.name} />
                        </div>
                        <div className={style.sex}>
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked
                          />
                          <FontAwesomeIcon icon={faMars} />
                          <input type="radio" name="gender" value="female" />
                          <FontAwesomeIcon icon={faVenus} />
                        </div>
                        <div className={style.breed}>
                          <FontAwesomeIcon
                            fixedWidth
                            icon={faCat}
                            color="#999999"
                          />
                          <input type="text" defaultValue={petData.breed} />
                        </div>
                        <div className={style.age}>
                          <input
                            type="date"
                            ref={calRef}
                            defaultValue={petData.birth}
                          />
                        </div>
                      </div>
                      <h2>About Pet</h2>
                      <div className={style.textbox}>
                        <textarea defaultValue={petData.description} />
                      </div>
                      <div className={style.updateDiv}>
                        <button type="submit" className={style.update}>
                          Update <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </div>
                    </div>
                    {petContent.map((element) => {
                      return (
                        <Content
                          key={element}
                          data={element.content}
                          edit={editing}
                          refreshKey={updateRefreshKey}
                        />
                      );
                    })}

                    <div className={style.addsection}>
                      <button onClick={openModal}>
                        Add Section <FontAwesomeIcon icon={faAdd} />
                      </button>
                    </div>

                    <div className={style.lightpink}>
                      <section className={style.mapsection}>
                        <h3>My Home:</h3>
                        <div className={style.mapform}>
                          <input
                            type="text"
                            defaultValue={"2905 SW ARCHER RD 4011"}
                          />
                        </div>
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
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SinglePet;
