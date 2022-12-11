import Background from "../../components/Background";
import styles from "./register.modules.css";
const Register = () => {

  

  return (
    <Background>
      <form>
        <h1>Create an account.</h1>
        <label htmlFor="firstName">First Name:</label>
        <input id="firstName" type="text"></input>
        <label htmlFor="lastName">Last Name:</label>
        <input id="lastName" type="text"></input>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email"></input>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password"></input>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="confirmPassword" id="confirmPassword"></input>
        <button className="button" type="submit">
          Create Account
        </button>
      </form>
    </Background>
  );
};

export default Register;
