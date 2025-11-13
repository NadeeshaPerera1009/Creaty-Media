import React from "react";
import Adfeed from "../../components/advertisement/adfeed/Adfeed";
import Navbar from "../../components/navbar/Navbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./adhome.scss";

const Adhome = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="homeContainer">
        <Sidebar />
        <Adfeed />
        <Rightbar />
      </div>
    </div>
  );
};

export default Adhome;