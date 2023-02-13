import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PetPageField from "../../../components/PetPageField";
import useAuth from "../../../hooks/useAuth";
import style from "./singlepet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../../components/Loading";
import SimpleMap from "../../../components/Test";
import UserBar from "../../../components/UserBar";
import { v4 as uuidv4 } from "uuid";
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
  faBell,
  faX,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import AddSection from "../../../components/AddSection";
import Content from "../../../components/Content";
import { createRef } from "react";
import PlacesAutocomplete from "../../../components/Autocomplete";

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
    fetchUserName();
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
              emailNotification
              lost
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
      setPetContent(array);
    };
    content.forEach((element) => {
      fetchPetContent(element);
    });
  };

  const [user, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    long: "29.0",
    lat: "-80.0",
    address: "",
  });

  const fetchUserName = (e) => {
    const graphqlQuery = {
      query: `
    {
      publicUser(
        petId:"${params.petId}"
      ){
        firstName
        lastName
        tel
        long
        lat
        address
      }
    }
        `,
    };
    const fetchUser = async () => {
      const updated = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const user = await updated.json();
      setUserInfo(user.data.publicUser);
    };
    fetchUser();
  };

  const updatePetHandler = (e) => {
    e.preventDefault();
    var gender = "female";
    if (e.target[5].checked) {
      gender = "male";
    }

    const graphqlQuery = {
      query: `
      mutation{
        updatePet(
          id:"${params.petId}",
          petInput:{
          name: "${e.target[4].value}"
          gender:"${gender}"
          birth:"${calRef.current.value}"
          breed: "${e.target[7].value}"
          description: """${e.target[9].value}"""
      
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

  const updateLostModeHandler = (e) => {
    const graphqlQuery = {
      query: `
      mutation{
        updateNotification(
          petId:"${params.petId}",
          content:{
            emailNotification: ${e.target.form[1].checked}
            lost: ${e.target.form[0].checked}
          }
        )
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
    };

    updateDatabase();
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

  const calRef = createRef();

  useAuth();

  const [alert, setAlert] = useState(false);

  const alertModeHandler = () => {
    setAlert(true);
  };

  const alertCloseHandler = () => {
    setAlert(false);
    fetchPet();
  };

  return (
    <>
      <UserBar />

      <div className={style.background}>
        {alert && (
          <>
            <div className={style.modal}>
              <div className={style.sidebar}>
                <form onChange={updateLostModeHandler}>
                  <FontAwesomeIcon icon={faX} onClick={alertCloseHandler} />
                  <div className={style.notifications}>
                    <h4>Lost mode</h4>
                    <h5>
                      If pet gets scanned, popup will let viewer know your pet
                      is lost.
                    </h5>
                    {petData.lost ? (
                      <input type="checkbox" id="switch1" defaultChecked />
                    ) : (
                      <input type="checkbox" id="switch1" />
                    )}

                    <label htmlFor="switch1">Toggle</label>
                  </div>
                  <div className={style.notifications}>
                    <h4>Email notifications</h4>
                    <h5>
                      If pet gets scanned, email will be sent to you with their
                      IP.
                    </h5>
                    {petData.emailNotification ? (
                      <input type="checkbox" id="switch2" defaultChecked />
                    ) : (
                      <input type="checkbox" id="switch2" />
                    )}

                    <label htmlFor="switch2">Toggle</label>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={style.main}>
              <div>
                {!editing ? (
                  <>
                    <div className={style.top}>
                      <div className={style.edit}>
                        <button onClick={editModeHandler}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={alertModeHandler}>
                          <FontAwesomeIcon icon={faBell} />
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
                          key={uuidv4()}
                          data={element.content}
                          edit={editing}
                        />
                      );
                    })}

                    <div className={style.lightpink}>
                      <section className={style.mapsection}>
                        <div className={style.mapbox}>
                          <h3>
                            <FontAwesomeIcon icon={faHome} />
                            My Address
                          </h3>
                          <SimpleMap lat={user.lat} long={user.long} />
                        </div>
                      </section>
                      <section className={style.contactInfo}>
                        <div className={style.icon}>
                          <a href={"tel:" + user.tel}>
                            <FontAwesomeIcon icon={faPhone} />
                          </a>
                        </div>
                        <div className={style.details}>
                          <div className={style.firstName}>
                            <h4>
                              {user.firstName} {user.lastName}
                            </h4>
                          </div>
                          <div className={style.phoneNumber}>
                            <h5>{user.tel}</h5>
                          </div>
                          <div className={style.city}>
                            <h5> {user.address}</h5>
                          </div>
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

                    <form
                      className={style.editForm}
                      onSubmit={updatePetHandler}
                    >
                      <div className={style.top}>
                        <div className={style.edit}>
                          <button onClick={editModeHandler}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={alertModeHandler}>
                            <FontAwesomeIcon icon={faBell} />
                          </button>
                          <button onClick={deletePetHandler}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        <div className={style.editprofilepic}>
                          <div className={style.editprofilepicicon}>
                            <label htmlFor="imageupload">
                              <FontAwesomeIcon icon={faEdit} />
                            </label>
                            <input
                              onChange={uploadImageHandler}
                              type="file"
                              id="imageupload"
                            />
                          </div>
                          <img src={`${petData.image}`} />
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
                              defaultChecked
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
                            key={uuidv4()}
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
                          <div className={style.mapform}>
                            <PlacesAutocomplete />
                          </div>
                          <div className={style.mapbox}>
                            <h3>
                              <FontAwesomeIcon icon={faHome} />
                              My Address
                            </h3>
                            <SimpleMap lat={user.lat} long={user.long} />
                          </div>
                        </section>
                        <section className={style.contactInfo}>
                          <div className={style.icon}>
                            <a href={"tel:" + user.tel}>
                              <FontAwesomeIcon icon={faPhone} />
                            </a>
                          </div>
                          <div className={style.details}>
                            <div className={style.firstName}>
                              <h4>
                                {user.firstName} {user.lastName}
                              </h4>
                            </div>
                            <div className={style.phoneNumber}>
                              <h5>{user.tel}</h5>
                            </div>
                            <div className={style.city}>
                              <h5> {user.address}</h5>
                            </div>
                          </div>
                        </section>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SinglePet;
