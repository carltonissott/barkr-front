import { useRef, useState } from "react";
import Background from "../../components/Background";
import styles from "./register.module.css";
import loading from "../assets/loading.gif";
import { redirect, useNavigate } from "react-router";
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const passwordRef = useRef();

  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    passwordRef.current.setCustomValidity("");
    passwordRef.current.reportValidity();

    if (e.target[8].value !== e.target[7].value) {
      passwordRef.current.setCustomValidity("Passwords do not match!");
      passwordRef.current.reportValidity();
      setIsInvalid(true);
      return;
    }

    setIsLoading(true);

    const graphqlQuery = {
      query: `

      mutation{
        createUser(userInput:{
          email: "${e.target[6].value}",
          firstName:"${e.target[0].value}",
          lastName:"${e.target[1].value}",
          password: "${e.target[7].value}",
          tel: "${e.target[5].value}",
          street:"${e.target[2].value}",
          city:"${e.target[3].value}",
          zip:"${e.target[4].value}",
        }){
          firstName
        }
      }

      `,
    };

    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        setIsLoading(false);
        return res.json();
      })
      .then((res) => {
        navigate("/login");
      });
  };

  return (
    <Background>
      <form onSubmit={onSubmitHandler}>
        <h1>Create an account.</h1>
        {isLoading ? (
          <>
            <img id={styles.loading} src={loading} />
          </>
        ) : (
          <>
            <div className={styles.form}>
              <div className={styles.col1}>
                <label htmlFor="firstName">First Name:</label>
                <input id="firstName" type="text" required />
                <label htmlFor="lastName" required>
                  Last Name:
                </label>
                <input id="lastName" type="text" />
                <label htmlFor="street">Street Address:</label>
                <input id="street" type="text" />
                <label htmlFor="city">City:</label>
                <input type="text" id="city"></input>
                <label htmlFor="zip">Zip Code:</label>
                <input id="zip" name="zip" type="text" pattern="[0-9]*" />
              </div>
              <div className={styles.col2}>
                <label htmlFor="tel">Phone Number:</label>
                <input id="tel" type="tel" />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required />
                <label htmlFor="password">Password:</label>
                <input
                  className={isInvalid ? styles.invalid : undefined}
                  ref={passwordRef}
                  type="password"
                  id="password"
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  className={isInvalid ? styles.invalid : undefined}
                  type="password"
                  id="confirmPassword"
                  required
                />
              </div>
            </div>

            <button className={styles.button} type="submit">
              Create Account
            </button>
          </>
        )}
      </form>
    </Background>
  );
};

export default Register;
