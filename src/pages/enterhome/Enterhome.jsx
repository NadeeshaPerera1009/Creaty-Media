import React from "react";
import Enterfeed from "../../components/entertainment/enterfeed/Enterfeed";
import Navbar from "../../components/navbar/Navbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./enterhome.scss";

const Enterhome = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="homeContainer">
        <Sidebar />
        <Enterfeed />
        <Rightbar />
      </div>
    </div>
  );
};

export default Enterhome;
