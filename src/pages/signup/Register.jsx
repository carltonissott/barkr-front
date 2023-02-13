import { useRef, useState } from "react";
import Background from "../../components/Background";
import styles from "./register.module.css";
import loading from "../assets/loading.gif";
import { redirect, useNavigate } from "react-router";
import PlacesAutocompleteProfile from "../../components/AutocompleteProfiley";
import dedicated from "../../components/autocompleteprofile.module.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Loading from "../../components/Loading";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const passwordRef = useRef();

  const navigate = useNavigate();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();
      setAddress(description);

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        setLat(lat);
        setLong(lng);
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [address, setAddress] = useState(null);

  const onSubmitHandler = (e) => {
    console.log(e);

    e.preventDefault();
    passwordRef.current.setCustomValidity("");
    passwordRef.current.reportValidity();

    if (e.target[5].value !== e.target[6].value) {
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
          email: "${e.target[4].value}",
          firstName:"${e.target[0].value}",
          lastName:"${e.target[1].value}",
          password: "${e.target[5].value}",
          tel: "${e.target[3].value}",
          address:"${e.target[2].value}"
          lat:"${lat}"
          long: "${long}"
        }){
          firstName
        }
      }

      `,
    };

    fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
            <Loading />
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

                <div className={dedicated.whole}>
                  <div className={dedicated.inputbutton}>
                    <input
                      value={value}
                      onChange={handleInput}
                      disabled={!ready}
                    />
                  </div>
                  {/* We can use the "status" to decide whether we should display the dropdown or not */}
                  {status === "OK" && (
                    <ul className={dedicated.dropdown}>
                      {renderSuggestions()}
                    </ul>
                  )}
                </div>

                <label htmlFor="tel">Phone Number:</label>
                <input id="tel" type="tel" />

                {/* <label htmlFor="street">Street Address:</label>
                <input id="street" type="text" />
                <label htmlFor="city">City:</label>
                <input type="text" id="city"></input>
                <label htmlFor="zip">Zip Code:</label>
                <input id="zip" name="zip" type="text" pattern="[0-9]*" /> */}
              </div>
              <div className={styles.col2}>
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
