import React from "react";
import Edufeed from "../../components/edufeed/Edufeed";
import Navbar from "../../components/navbar/Navbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./eduhome.scss";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="homeContainer">
        <Sidebar />
        <Edufeed />
        <Rightbar />
      </div>
    </div>
  );
};

export default Home;