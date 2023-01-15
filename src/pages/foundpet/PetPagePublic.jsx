import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Background from "../../components/Background";
import Loading from "../../components/Loading";
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PetPagePublic;
