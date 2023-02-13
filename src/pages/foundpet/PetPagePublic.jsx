import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  faPhone,
  faLocationPin,
  faMars,
  faVenus,
  faCat,
  faDog,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { createRef } from "react";
import PetPageField from "../../components/PetPageField";
import Loading from "../../components/Loading";
import SimpleMap from "../../components/Test";
import UserBar from "../../components/UserBar";
import Content from "../../components/Content";
import style from "../loggedIn/SinglePet/singlepet.module.css";
import custom from "../foundpet/foundpetpublic.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PetPagePublic = () => {
  const params = useParams();
  const [petData, setPetData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [petContent, setPetContent] = useState([]);
  const [age, setAge] = useState(null);

  useEffect(() => {
    fetchPet();
  }, [PetPageField]);

  useEffect(() => {
    if (petData && petData.lost) {
      setIsLost(true);
    }

    if (petData && petData.emailNotification) {
      sendEmail();
    }
  }, [petData]);

  const [isLost, setIsLost] = useState();

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
              births
              lost
              emailNotification
              content{
                _id
              }
          }}
          `,
    };
    const response = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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

  const sendEmail = () => {
    const petId = JSON.stringify({ petId: params.petId });

    fetch(`${process.env.REACT_APP_API_SERVER}/email-notification`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: petId,
    });
  };

  const closeModal = () => {
    setIsLost(false);
  };

  return (
    <>
      <UserBar />
      {isLost && (
        <div className={custom.modal}>
          <div className={custom.sidebar}>
            <FontAwesomeIcon icon={faX} onClick={closeModal} />
            <h4>THIS PET IS MISSING!</h4>
            <h5>Please contact the owner ASAP at 21 501 4103</h5>
          </div>
        </div>
      )}
      <div className={style.background}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={style.main}>
            <div>
              <>
                <div className={style.top}>
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
                      edit={false}
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
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PetPagePublic;
// <div className={style.background}>
//   {isLoading ? (
//     <Loading />
//   ) : (
//     <div className={style.main}>
//       <div>
//         <div className={style.top}>
//           <div className={style.profilepic}>
//             <img src="https://d17fnq9dkz9hgj.cloudfront.net/uploads/2012/11/153558006-tips-healthy-cat-632x475-390x293.jpg" />{" "}
//           </div>
//         </div>
//         <div className={style.basicdetails}>
//           <div className={style.shortinfo}>
//             <div className={style.name}>
//               <h3>Roxxy</h3>
//             </div>
//             <div />
//             <div className={style.sex}>
//               <img src="https://img.icons8.com/color/96/null/male.png" />
//             </div>
//             <div className={style.breed}>
//               <img src="https://img.icons8.com/ios-glyphs/90/999999/pet-commands-train.png" />
//               <h3>Tabby</h3>
//             </div>
//             <div />
//             <div className={style.age}>
//               <h3>1 year old</h3>
//             </div>
//           </div>
//           <h2>About Pet</h2>
//           <p>
//             I am a playful and curious cat. I love to chase toys around the
//             house and explore my surroundings. I am also quite affectionate
//             with my owners and enjoy cuddling up with them on the couch. I
//             can be independent at times, but I also like to be near my
//             owners and will follow them around the house. I am known to be
//             quite vocal and will often meow to get my owners' attention or
//             to express my happiness. Overall, I am a loving and entertaining
//             companion.
//           </p>
//         </div>
//         <section className={style.vaccination}>
//           <h2>Vaccination/Medical Status</h2>
//           <ul>
//             <li>Revolution (02/03) </li>
//             <li>Rabies (11/29) </li>
//           </ul>
//         </section>
//         <div className={style.lightpink}>
//           <section className={style.mapsection}>
//             <h3>My Home:</h3>
//             <div className={style.mapbox}>
//               <SimpleMap />
//             </div>
//           </section>
//           <section className={style.contactInfo}>
//             <div className={style.icon}>
//               <FontAwesomeIcon icon={faPhone} />
//             </div>
//             <div className={style.firstName}>
//               <h4>Carlton Issott</h4>
//             </div>
//             <div className={style.phoneNumber}>
//               <h5>321-544-0711</h5>
//             </div>
//             <div className={style.city}>
//               <FontAwesomeIcon icon={faLocationPin} />
//               <h5> Gainesville, Fl</h5>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   )}
// </div>
