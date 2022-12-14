import { useEffect } from "react";
import { useNavigate } from "react-router";
import Background from "../../components/Background";
import useAuth from "../../hooks/useAuth";
import addpet from "./addpet.module.css";

const AddPet = () => {
  const navigate = useNavigate();

  useAuth()



  const addPetHandler = async (e) => {
    e.preventDefault();
    let type;
    if (e.target[0].checked) {
      type = "cat";
    } else if (e.target[1].checked) {
      type = "dog";
    } else {
      type = "other";
    }

    const formData = new FormData();
    console.log(e.target[4].value);
    console.log(e);
    formData.append("image", e.target[4].files[0]);
    const imageUrl = await fetch("http://localhost:8080/post-image", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });
    const decoded = await imageUrl.json();
    const image = await decoded.filePath.replace(/\\/g, "/");
    console.log(`"${image}"`);
    const graphqlQuery = {
      query: `
        mutation{
            createPet(petInput:{
                name: "${e.target[3].value}"
                phone:"${e.target[6].value}"
                image: "${image}"
                type: "${type}"
                description: "${e.target[7].value}"
            }){
                breed
            }
        }
        
        `,
    };
    const res = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    await res.json();
    await navigate("/dashboard");
  };

  return (
    <Background>
      <div className={addpet.flex}>
        <h1>Add pet:</h1>
        <form className={addpet.flex} onSubmit={addPetHandler} encType="multipart/form-data">
          <div className={addpet.radiobuttons}>
            <label htmlFor="cat">
              <img src="https://img.icons8.com/ios/100/null/cat-head--v1.png" />
            </label>
            <input id="cat" type="radio" value="Cat" name="type" />
            <label htmlFor="dog">
              <img src="https://img.icons8.com/ios/100/null/wolf.png" />
            </label>
            <input id="dog" type="radio" value="Dog" name="type" />
            <label htmlFor="other">
              <img src="https://img.icons8.com/ios/100/null/frog-face--v2.png" />
            </label>
            <input id="other" type="radio" value="Other" name="type" />
          </div>
          <label htmlFor="petName">Pet Name:</label>
          <input id="petName" type="text" />
          <label htmlFor="petphoto">Upload pet portrait!</label>
          <input type="file" id="petphoto" />
          <label htmlFor="address">Street Address:</label>
          <input id="address" type="text" />
          <label htmlFor="phone">Phone Number:</label>
          <input id="phone" type="tel" />
          <label htmlFor="description">Description:</label>
          <textarea rows="5" cols="33" id="description"></textarea>
          <button className={addpet.button} type="submit">
            +Add Pet!
          </button>
        </form>
      </div>
    </Background>
  );
};

export default AddPet;
