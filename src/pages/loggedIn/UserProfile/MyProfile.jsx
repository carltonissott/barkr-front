import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Background from "../../../components/Background";
import Loading from "../../../components/Loading";
import useAuth from "../../../hooks/useAuth";

import styles from "./myprofile.module.css";

const MyProfile = () => {
  useAuth();
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("userId", "");
    //redirect user to main page
    navigate("/");
  };

  const [user, setUser] = useState(null);
  const [updated, setUpdated] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const graphqlQuery = {
      query: `
    {user{
        firstName
        lastName
        email
        street
        zip
        tel
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
        setUser(resData.data.user);
        const timer1 = setTimeout(() => setLoading(false), 500);
        return () => {
          clearTimeout(timer1);
        };
      });
  }, [updated]);

  const [edit, setEdit] = useState(false);

  const editHandler = () => {
    setEdit(true);
  };

  const formHandler = (e) => {
    e.preventDefault();

    const graphqlQuery = {
      query: `
        mutation{
            updateUser(
                userInput:{
                    firstName:"${e.target[1].value}"
                    lastName:"${e.target[2].value}"
                    email:"${e.target[0].value}"
                    tel:"${e.target[3].value}"
                    street:"${e.target[4].value}"
                    zip:"${e.target[5].value}"
                }
            ){
                firstName
            }
        }
        `,
    };

    const updateUser = async () => {
      const updated = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const updatedUser = await updated.json();
      setUpdated(updated + 1);
    };
    updateUser();

    setEdit(false);
  };

  const deleteAccountHandler = () => {
    const graphqlQuery = {
      query: `
      mutation{
        deleteUser(
          id: "${localStorage.getItem("userId")}"
        )
      }`,
    };
    const deleteUser = async () => {
      const deleted = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      localStorage.setItem("token", "");
      navigate("/");
    };
    deleteUser();
  };

  return (
    <>
      <Background>
        {loading ? (
          <>
            <Loading />
          </>
        ) : (
          <div className={styles.background}>
            {edit ? (
              <form className={styles.form} onSubmit={formHandler}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" defaultValue={user.email} />
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  defaultValue={user.firstName}
                />
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" defaultValue={user.lastName} />
                <label htmlFor="tel">Telephone:</label>
                <input type="tel" id="tel" defaultValue={user.tel} />
                <label htmlFor="street">Street Address:</label>
                <input type="text" id="street" defaultValue={user.street} />
                <label htmlFor="zip">Zip Code:</label>
                <input id="zip" type="text" defaultValue={user.zip} />
                <button className={styles.edit} type="submit">
                  Update
                </button>
              </form>
            ) : (
              <>
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <p className={styles.text}> {user.email} </p>
                <p className={styles.text}>{user.tel}</p>
                <p className={styles.text}>
                  {user.street} {user.zip}
                </p>
                <div className={styles.button}>
                  <button onClick={editHandler} className={styles.edit}>
                    Edit Profile
                  </button>
                  <button onClick={logoutHandler} className={styles.logout}>
                    Log Out
                  </button>
                  <button
                    onClick={deleteAccountHandler}
                    className={styles.delete}
                  >
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Background>
    </>
  );
};

export default MyProfile;
