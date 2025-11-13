import React from "react";
//import Online from "../online/Online";
//import { Usersonline } from "../../data";
import "./rightbarhome.scss";

const Rightbarhome = () => {
  return (
    <div className="rightbarhome">
      {/* <div className="birthdayContainer">
        <img
          src="/images/birthdaygifts/gift.png"
          alt=""
          className="birthdayImg"
        />
        <span className="birthdayText">
          <b>Tharusha Gimhan</b> and <b>other friends</b> have a birthday today
        </span>
      </div>
      <img src="/images/ads/adv.jpg" alt="" className="rightbarAdvert" /> */}

      <span className="rightbarTitle"></span>

      {/* <ul className="rightbarFriendList">
        {Usersonline.map((u) => (
          <Online key={u.id} onlineuser={u} />
        ))}
      </ul> */}
    </div>
  );
};

export default Rightbarhome;
