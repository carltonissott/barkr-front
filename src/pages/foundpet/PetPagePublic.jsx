import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Background from "../../components/Background";
import Loading from "../../components/Loading";
import SimpleMap from "../../components/Test";
import style from "./foundpetpublic.module.css";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";

const PetPagePublic = () => {
  const params = useParams();
  const petId = params.petId;
  const [petData, setPetData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      const graphqlQuery = {
        query: `
              query{
                  lookupPet(id:"${petId}"){
                    name
                    description
                  }
                }
              `,
      };
      try {
        const response = await fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphqlQuery),
        });
        const petData = await response.json();
        setPetData(petData.data.lookupPet);
        const timer1 = setTimeout(() => setIsLoading(false), 500);
        return () => {
          clearTimeout(timer1);
        };
        return petData;
      } catch (error) {
        setPetData({
          name: "No name found!",
        });
        const timer1 = setTimeout(() => setIsLoading(false), 500);
        return () => {
          clearTimeout(timer1);
        };
      }
    };
    getData();
  }, []);

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
                  <h3>Roxxy</h3>
                </div>
                <div />
                <div className={style.sex}>
                  <img src="https://img.icons8.com/color/96/null/male.png" />
                </div>
                <div className={style.breed}>
                  <img src="https://img.icons8.com/ios-glyphs/90/999999/pet-commands-train.png" />
                  <h3>Tabby</h3>
                </div>
                <div />
                <div className={style.age}>
                  <h3>1 year old</h3>
                </div>
              </div>
              <h2>About Pet</h2>
              <p>
                I am a playful and curious cat. I love to chase toys around the
                house and explore my surroundings. I am also quite affectionate
                with my owners and enjoy cuddling up with them on the couch. I
                can be independent at times, but I also like to be near my
                owners and will follow them around the house. I am known to be
                quite vocal and will often meow to get my owners' attention or
                to express my happiness. Overall, I am a loving and entertaining
                companion.
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

export default PetPagePublic;
