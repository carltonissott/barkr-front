import {
  faAdd,
  faCat,
  faCheck,
  faDog,
  faFemale,
  faMale,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import Background from "../../components/Background";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";
import addpet from "./addpet.module.css";

const AddPet = () => {
  const navigate = useNavigate();

  const inputFile = useRef(null);

  useAuth();

  const [formPage, setFormPage] = useState(1);

  const nextPageHandler = () => {
    setFormPage(formPage + 1);
  };
  const previousPageHandler = () => {
    setFormPage(formPage - 1);
  };

  const petNameHandler = (e) => {
    setPetName(e.target.value);
  };

  const [formInfo, setFormInfo] = useState({ type: "cat" });

  const [selected, setSelected] = useState();

  const typePetHandler = (e) => {
    setSelected(e.target.value);
    setFormInfo({ ...formInfo, type: e.target.value });
  };

  const breedHandler = (e) => {
    console.log(formInfo);
    setFormInfo({ ...formInfo, breed: e.target.value });
  };

  const sexHandler = (e) => {
    setSelected(e.target.value);
    setFormInfo({ ...formInfo, gender: e.target.value });
    console.log(formInfo);
  };

  const descriptionHandler = (e) => {
    setFormInfo({ ...formInfo, description: e.target.value });
  };

  const dateHandler = (e) => {
    setFormInfo({ ...formInfo, birth: e.target.value });
    console.log(formInfo);
  };

  const idHandler = (e) => {
    setFormInfo({ ...formInfo, id: e.target.value });
  };

  const imageUploadHandler = (e) => {
    inputFile.current.click();
  };

  const imageUploadComplete = (e) => {
    setImage(e.target.files[0]);
    setFileUploaded(true);
  };
  const [imageState, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const submitFormHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", imageState);
    const imageUrl = await fetch(`${process.env.REACT_APP_API_SERVER}/post-image`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });
    const decoded = await imageUrl.json();
    const image = await decoded.filePath.replace(/\\/g, "/");
    console.log(`"${image}"`);
    //uploads rest of data

    const description = formInfo.description;

    const graphqlQuery = {
      query: `
        mutation{
            createPet(petInput:{
                name: "${petName}"
                image: "${image}"
                type: "${formInfo.type}"
                gender: "${formInfo.gender}"
                birth:"${formInfo.birth}"
                barkrid:"${formInfo.id}"
                breed: "${formInfo.breed}"
                description:"""${description}"""
            }){
                breed
            }
        }
        
        `,
    };
    console.log(graphqlQuery);
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    setIsLoading(false);
    await res.json();
    await navigate("/dashboard");
  };

  const [fileUploaded, setFileUploaded] = useState(false);
  const [petName, setPetName] = useState("your pet");

  return (
    <Background>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={addpet.flex}>
          {formPage == 1 && (
            <>
              <h1>Let's add your pet!</h1>
              <p>Please have your BarkR Tag # ready.</p>
              <button className={addpet.button} onClick={nextPageHandler}>
                Next
              </button>
            </>
          )}
          {formPage == 2 && (
            <>
              <h1>First, let's get your pet's name!</h1>
              <label htmlFor="petName" hidden>
                Pet Name:
              </label>
              <input
                type="text"
                id="petName"
                onChange={petNameHandler}
                placeholder="Spoilt Pink Princess III"
                required
              />
              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}
          {formPage == 3 && (
            <>
              <h1>What type of animal is {petName}?</h1>
              <div className={addpet.radio}>
                <label
                  htmlFor="dog"
                  className={selected == "dog" && "selected"}
                >
                  <FontAwesomeIcon icon={faDog} />
                </label>
                <input
                  onClick={typePetHandler}
                  type="radio"
                  id="dog"
                  name="pettype"
                  value="dog"
                  hidden
                ></input>
                <label
                  htmlFor="cat"
                  className={selected == "cat" && "selected"}
                >
                  <FontAwesomeIcon icon={faCat} />
                </label>
                <input
                  onClick={typePetHandler}
                  type="radio"
                  id="cat"
                  name="pettype"
                  value="cat"
                  hidden
                ></input>
                <label
                  htmlFor="misc"
                  className={selected == "misc" && "selected"}
                >
                  <FontAwesomeIcon icon={faAdd} />
                </label>
                <input
                  onClick={typePetHandler}
                  type="radio"
                  id="misc"
                  name="pettype"
                  value="misc"
                  hidden
                />
              </div>

              {formInfo.type !== "cat" && formInfo.type !== "dog" && (
                <>
                  <label htmlFor="type">Type of animal:</label>
                  <input
                    onChange={typePetHandler}
                    id="type"
                    type="text"
                    placeholder="T-Rex"
                  />
                </>
              )}

              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}
          {formPage == 4 && (
            <>
              <h1>Awesome! What breed is {petName}?</h1>
              <input
                onChange={breedHandler}
                type="text"
                placeholder="Half Dragon, Half Dog"
              />
              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}
          {formPage == 5 && (
            <>
              <h1>Is {petName} a boy or a girl?</h1>
              <div className={addpet.radio}>
                <label
                  htmlFor="male"
                  className={selected == "male" && "selected"}
                >
                  <FontAwesomeIcon icon={faMale} />
                </label>
                <input
                  onClick={sexHandler}
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  hidden
                />
                <label
                  htmlFor="female"
                  className={selected == "female" && "selected"}
                >
                  <FontAwesomeIcon icon={faFemale} />
                </label>
                <input
                  onClick={sexHandler}
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  hidden
                />
              </div>
              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}
          {formPage == 6 && (
            <>
              <h1>Let's see a picture of {petName}</h1>
              <label htmlFor="imageupload">
                {!fileUploaded ? (
                  <button
                    className={addpet.imageupload}
                    onClick={imageUploadHandler}
                  >
                    <FontAwesomeIcon icon={faUpload} /> Choose Image
                  </button>
                ) : (
                  <button
                    className={addpet.imageupload}
                    onClick={imageUploadHandler}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Uploaded
                  </button>
                )}
              </label>
              <input
                onInput={imageUploadComplete}
                ref={inputFile}
                type="file"
                id="imageupload"
                accept="image/png, image/jpeg"
              />

              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}
          {formPage == 7 && (
            <>
              <h1>Tell us a little more about {petName}</h1>
              <textarea
                onChange={descriptionHandler}
                className={addpet.textarea}
                placeholder="Rufus is a very friendly cat and never gets into trouble. He absolutely would never ever thinking of jumping on the counter. Or eating my shoe. Or eating a whole pork chop off the dinner table after I spent 5 hours making it. Never."
              />
              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}

          {formPage == 8 && (
            <>
              <h1>When was {petName} born?</h1>
              <input onChange={dateHandler} type="date" />
              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={nextPageHandler}>
                  Next
                </button>
              </div>
            </>
          )}

          {formPage == 9 && (
            <>
              <h1>Last question! What is your BarkR Pet ID Number?</h1>
              <input onChange={idHandler} type="text" placeholder="4377FaVs2" />

              <div className={addpet.buttons}>
                <button className={addpet.back} onClick={previousPageHandler}>
                  Back
                </button>
                <button className={addpet.next} onClick={submitFormHandler}>
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Background>
  );
};

export default AddPet;
