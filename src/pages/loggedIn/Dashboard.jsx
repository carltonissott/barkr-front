import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Background from "../../components/Background";
import Petcard from "../../components/Petcard";
import UserBar from "../../components/UserBar";
import useAuth from "../../hooks/useAuth";
import dashboard from "./dashboard.module.css";

const Dashboard = (props) => {
  const [user, setUser] = useState(null);
  const [petArray, setPetArray] = useState([]);
  const navigate = useNavigate();

  useAuth();

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

    fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
    array.forEach((element) => {
      const graphqlQuery = {
        query: `
                    {pet(id:"${element._id}")
                          {name
                            image
                            _id
                        }  
                      }
                    `,
      };

      fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
          console.log(resData);
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
        <h1 className={dashboard.heading}>Welcome, {user} </h1>

        {petArray.length !== 0 ? (
          petArray.map((pet) => (
            <Petcard
              key={pet._id}
              id={pet._id}
              image={pet.image}
              petName={pet.name}
            />
          ))
        ) : (
          <h2>No pets added! Let's get started!</h2>
        )}
        <button onClick={addPetHandler} className={dashboard.button}>
          <FontAwesomeIcon icon={faPaw} />  Add Pet
        </button>
      </div>
    </Background>
  );
};

export default Dashboard;
