import { useState } from "react";
import Background from "../../components/Background";
import styles from "../signup/register.module.css";
import loginPage from "./login.module.css";
import loading from "../assets/loading.gif";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const loginHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const graphqlQuery = {
      query: `
        
       
     {       login(email:"${e.target[0].value}", password: "${e.target[1].value}")
        {
            token
            userId
        }}
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
        return res.json();
      })
      .then((result) => {
        if (!result.errors) {
          return result;
        } else {
          console.log(result.errors[0].message);
          setIsLoading(false);
        }
      })
      .then((loginData) => {
        setToken(loginData.data.login.token);
        setUserId(loginData.data.login.userId);
        localStorage.setItem("token", loginData.data.login.token);
        localStorage.setItem("userId", loginData.data.login.userId);
        const expiration = Date.now() + 7200000;
        localStorage.setItem("expiration", expiration);
        setIsLoading(false);
        props.userInfo(userId);
        navigate("/dashboard");
      });
  };

  return (
    <Background>
      <div className={loginPage.loginForm}>
        {/* <h1>Login:</h1> */}
        {isLoading ? (
         <Loading/>
        ) : (
          <form className={loginPage.loginForm} onSubmit={loginHandler}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" />
            <button className={loginPage.button} type="submit">
              Login
            </button>
          </form>
        )}
        <p className={loginPage.paragraph}>
          Not a user? Sign up <a href="/signup/register">here.</a>
        </p>
      </div>
    </Background>
  );
};

export default Login;
