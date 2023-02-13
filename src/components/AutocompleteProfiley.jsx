import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import dedicated from "./autocompleteprofile.module.css";

const PlacesAutocompleteProfile = (props) => {
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

  useEffect(() => {
    setValue(props.address);
  }, []);

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const updateAddress = () => {
    if (!lat || !long) {
      return;
    }

    const graphqlQuery = {
      query: `
      mutation{
        updateUserAddress(address:{
            address:"${address}",
            lat:"${lat}"
            long:"${long}"
        }
        )}
          `,
    };
    const updateDatabase = async () => {
      const updated = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
    };
    updateDatabase();
  };

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [address, setAddress] = useState(null);

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

  const sendFetch = () => {
    updateAddress();
  };

  return (
    <div className={dedicated.whole}>
      <div className={dedicated.inputbutton}>
        <input value={value} onChange={handleInput} disabled={!ready} />
      </div>
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <ul className={dedicated.dropdown}>{renderSuggestions()}</ul>
      )}
    </div>
  );
};

export default PlacesAutocompleteProfile;
