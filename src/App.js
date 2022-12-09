import Homepage from "./pages/Homepage";
import "./css/app.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/signup/Register";
import Background from "./components/Background";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup/register" element={<Register />} />
      </Routes>
  );
}

export default App;
