import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faHome, faMessage, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import PlacesAutocomplete from "../../../components/Autocomplete";
import PlacesAutocompleteProfile from "../../../components/AutocompleteProfiley";
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
  const [success, setSuccess] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

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
        membership
        address
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
        setUser(resData.data.user);
        const timer1 = setTimeout(() => setLoading(false), 500);
        return () => {
          clearTimeout(timer1);
        };
      });
    if (searchParams.get("session_id")) {
      setSuccess(true);
    }
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
      const updated = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
      const deleted = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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

  const editMembership = async (e) => {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/customer-portal`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });

    const response = await res.json();

    window.location.href = response.url;
  };

  const upgradeMembership = async (e) => {
    const priceId = JSON.stringify({
      priceId: "price_1MZ0RiIyEliCATcCkgMEjUTF",
    });

    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/create-checkout-session`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: priceId,
    });

    const response = await res.json();

    window.location.href = response.url;
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
                <PlacesAutocompleteProfile address={user.address} />
                {/* <label htmlFor="zip">Zip Code:</label>
                <input id="zip" type="text" defaultValue={user.zip} /> */}
                <button className={styles.edit} type="submit">
                  Update
                </button>
              </form>
            ) : (
              <>
                {success && <h3>You're now a pro member!</h3>}
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <p className={styles.text}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  {user.email}
                </p>
                <p className={styles.text}>
                  <FontAwesomeIcon icon={faPhone} />
                  {user.tel}
                </p>
                <p className={styles.text}>
                  <FontAwesomeIcon icon={faHome} />

                  {user.address}
                </p>
                <div className={styles.button}>
                  {user.membership ? (
                    <button
                      onClick={editMembership}
                      type="submit"
                      className={styles.upgrade}
                    >
                      Edit Membership
                    </button>
                  ) : (
                    <button
                      onClick={upgradeMembership}
                      type="submit"
                      className={styles.upgrade}
                    >
                      Upgrade to Pro!
                    </button>
                  )}

                  <button onClick={editHandler} className={styles.edit}>
                    Edit Profile
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
