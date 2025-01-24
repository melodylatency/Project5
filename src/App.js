import React from "react";
import { Outlet } from "react-router-dom";
import "./index.css";
import NavBar from "./components/Navbar";

const App = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default App;
