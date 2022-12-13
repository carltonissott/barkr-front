import { useRef, useState } from "react";
import Background from "../../components/Background";
import styles from "./register.module.css";
import loading from "../assets/loading.gif";
import { redirect } from "react-router";
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const passwordRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    passwordRef.current.setCustomValidity("");
    passwordRef.current.reportValidity();

    if (e.target[3].value !== e.target[4].value) {
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
          email: "${e.target[2].value}",
          firstName:"${e.target[0].value}",
          lastName:"${e.target[1].value}",
          password: "${e.target[3].value}",
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
        return redirect("/login");
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
            <label htmlFor="firstName">First Name:</label>
            <input id="firstName" type="text" required />
            <label htmlFor="lastName" required>
              Last Name:
            </label>
            <input id="lastName" type="text" />
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
