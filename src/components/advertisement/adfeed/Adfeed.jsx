import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
// import { Posts } from "../../data";
import Adpost from "../adpost/Adpost";
import Adshare from "../adshare/Adshare";
//import Stories from "../stories/Stories";
import "./adfeed.scss";

const Adfeed = () => {
  const [adposts, setPosts] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(collection(db, "adposts"), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return () => {
      unSub();
    };
  }, []);
  // console.log(posts);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* <Stories /> */}
        <Adshare />
        {adposts
          .sort((a, b) => b.data.timestamp - a.data.timestamp)
          .map((p) => (
            <Adpost key={p.id} adpost={p} />
          ))}
      </div>
    </div>
  );
};

export default Adfeed;
