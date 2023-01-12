import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Background from "../../components/Background";
import style from "./foundpetpublic.module.css";

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
        setIsLoading(false);
        return petData;
      } catch (error) {
        setPetData({
          name: "No name found!",
        });
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <Background>
      <div className={style.background}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className={style.name_and_photo}>
              <h1>Hi I'm Basi!</h1>
              <div className={style.profilePic} />
            </div>
            <p>
              I am a playful and curious cat. I love to chase toys around the
              house and explore my surroundings. I am also quite affectionate
              with my owners and enjoy cuddling up with them on the couch. I can
              be independent at times, but I also like to be near my owners and
              will follow them around the house. I am known to be quite vocal
              and will often meow to get my owners' attention or to express my
              happiness. Overall, I am a loving and entertaining companion.
            </p>
            <section className={style.medical}>
              <h2>Medical History:</h2>
              <ul>
                <li>Flea Treatment</li>
                <li>Rabies Vaccination (Expires 10/24)</li>
                <li>Neutered</li>
                <li>HeartWorm Protection</li>
              </ul>
            </section>
            <section className={style.funfacts}>
              <h2>Some Fun Facts:</h2>
              <ul>
                <li>I love cuddles with mom!</li>
                <li>My favorite treats are temptations!</li>
              </ul>
            </section>
            <section className={style.location}>
              <iframe
                className={style.map}
                src="https://storage.googleapis.com/maps-solutions-5xfllzox8w/commutes/wtgq/commutes.html"
                width="100%"
                height="100%"
                loading="lazy"
              ></iframe>
            </section>
          </>
        )}
      </div>
    </Background>
  );
};

export default PetPagePublic;
