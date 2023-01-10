import { useEffect } from "react";
import { useNavigate } from "react-router";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      console.log("please log in!");
      navigate("/login");
    }

    //if not logged in navigate home
  });
};

export default useAuth;
