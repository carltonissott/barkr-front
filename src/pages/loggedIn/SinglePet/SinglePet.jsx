import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Background from "../../../components/Background";
import style from "./singlepet.module.css";

const SinglePet = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [petData, setPetData] = useState({});

  useEffect(() => {
    const fetchPet = async () => {
      setIsLoading(true);
      const graphqlQuery = {
        query: `
            {pet(id:"${params.petId}"){
                name
                image
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
    fetchPet();
  }, []);

  return (
    <Background>
      {isLoading ? (
        <p>Is loading...</p>
      ) : (
        <div className={style.background}>
          <div className={style.topheader}>
            <h1 className={style.h1}>Hi, I'm {petData.name}!</h1>
            <img className={style.image} src={petData.image} />
          </div>
          <div className={style.description}>
            <h2>A little about me:</h2>
            <p>
              Hi I'm Tux! Lorem ipsum dolor sit amet, consectetur adipisicing
              elit. Minus veritatis asperiores dolores delectus harum animi
              aperiam repellat quibusdam laborum tempore! Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Modi vitae alias qui molestiae
              corporis optio?
            </p>
          </div>
        </div>
      )}
    </Background>
  );
};

export default SinglePet;
