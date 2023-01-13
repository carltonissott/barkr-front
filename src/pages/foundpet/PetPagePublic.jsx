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
            <section className={style.header}>
              <div className={style.title}>
                <h3>Hi I'm,</h3>
                <h1>BASI</h1>
              </div>
              <img src="https://images.wideopenpets.com/wp-content/uploads/2022/06/orange-cat-breeds-1.png" />
            </section>
            <section className={style.info}>
              <div className={style.info_box}>
                <h2>About Me!</h2>
                <p>
                  I am a playful and curious cat. I love to chase toys around
                  the house and explore my surroundings. I am also quite
                  affectionate with my owners and enjoy cuddling up with them on
                  the couch. I can be independent at times, but I also like to
                  be near my owners and will follow them around the house. I am
                  known to be quite vocal and will often meow to get my owners'
                  attention or to express my happiness. Overall, I am a loving
                  and entertaining companion.
                </p>
              </div>
              <div className={style.info_box}>two</div>
              <div className={style.info_box}>three</div>
            </section>
          </>
        )}
      </div>
    </Background>
  );
};

export default PetPagePublic;
