import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Background from "../../components/Background";
import Petcard from "../../components/Petcard";
import dashboard from "./dashboard.module.css";

const Dashboard = (props) => {
  const [user, setUser] = useState(null);
  const [petArray, setPetArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const graphqlQuery = {
      query: `
        {user{
            firstName
            pets{
                _id
            }
          }}
        
        `,
    };
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setUser(resData.data.user.firstName);
        fetchPetData(resData.data.user.pets);
      });
  }, []);

  const fetchPetData = (array) => {
    console.log("here4");
    array.forEach((element) => {
      const graphqlQuery = {
        query: `
                    {pet(id:"${element._id}")
                          {name
                            image
                        }  
                      }
                    `,
      };

      fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          setPetArray((prevDat) => {
            return [...prevDat, resData.data.pet];
          });
        });
    });
  };

  const addPetHandler = () => {
    navigate("/dashboard/add-pet");
  };

  return (
    <Background>
      <div className={dashboard.main}>
        <h1>Welcome, {user} </h1>
        <h2>Your pets:</h2>
        {petArray.length !== 0 ? (
          petArray.map((pet) => (
            <Petcard image={pet.image} petName={pet.name} />
          ))
        ) : (
          <h2>No pets added! Let's get started!</h2>
        )}
        <button onClick={addPetHandler} className={dashboard.button}>
          + Add Pet
        </button>
      </div>
    </Background>
  );
};

export default Dashboard;
