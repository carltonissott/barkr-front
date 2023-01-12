import Homepage from "./pages/Homepage";
import "./css/app.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/signup/Register";
import Background from "./components/Background";
import Login from "./pages/login/Login";
import Dashboard from "./pages/loggedIn/Dashboard";
import { useState } from "react";
import AddPet from "./pages/loggedIn/AddPet";
import SinglePet from "./pages/loggedIn/SinglePet/SinglePet";
import Error from "./pages/Error";
import MyProfile from "./pages/loggedIn/UserProfile/MyProfile";
import FoundPet from "./pages/foundpet/FoundPet";
import PetPagePublic from "./pages/foundpet/PetPagePublic";

function App() {
  const [user, setUser] = useState(null);

  const userHandler = (e) => {
    setUser(e);
  };

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup/register" element={<Register />} />
      <Route path="/login" element={<Login userInfo={userHandler} />} />
      <Route path="/dashboard/add-pet" element={<AddPet />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="/dashboard/:petId" element={<SinglePet />} />
      <Route path="/dashboard/myprofile" element={<MyProfile />} />
      <Route path="/foundpet" element={<FoundPet />} />
      <Route path="/foundpet/:petId" element={<PetPagePublic />} />
      <Route path="/error" element={<Error />} />
    </Routes>
  );
}

export default App;
