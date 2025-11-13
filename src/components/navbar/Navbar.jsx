import React from "react";
import SearchIcon from "@mui/icons-material/Search";
// import PersonIcon from "@mui/icons-material/Person";
// import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import "./navbar.scss";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbarContainer">
      <div className="navbarLeft">
        <Link to="/main" style={{ textDecoration: "none" }}>
    <div className="logo">Creaty <span className='span'>Media</span></div>
        </Link>
    </div>
    <div className="navbarCenter">
      <div className="searchBar">
        <SearchIcon className="searchIcon" />
        <input
          type="text" placeholder="Search for users" className="searchInput"
          />
        </div>
      </div>
      <div className="navbarRight">
        <div className="navbarLinks">
          <span className="navbarLink">  hometimeline line     </span>
          <span className="navbarLink"> line ok ok     </span>
        </div>
        {/* <div className="navbarIcons">
          <div className="navbarIconItem">
            <PersonIcon />
            <span className="navbarIconBadge">2</span>
          </div>
          <div className="navbarIconItem">
            <ChatBubbleIcon />
            <span className="navbarIconBadge">10</span>
          </div>
          <div className="navbarIconItem">
            <NotificationsIcon />
            <span className="navbarIconBadge">8</span>
          </div>
        </div> */}
        <Link to={`/profile/${currentUser.displayName}`}>
          <img src={currentUser.photoURL} alt="" className="navbarImg" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
