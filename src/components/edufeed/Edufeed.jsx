import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
// import { Posts } from "../../data";
import Edupost from "../education/edupost/Edupost";
import Edushare from "../education/edushare/Edushare";
//import Stories from "../stories/Stories";
import "./edufeed.scss";

const Edufeed = () => {
  const [eduposts, setPosts] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(collection(db, "eduposts"), (snapshot) => {
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
        <Edushare />
        {eduposts
          .sort((a, b) => b.data.timestamp - a.data.timestamp)
          .map((p) => (
            <Edupost key={p.id} edupost={p} />
          ))}
      </div>
    </div>
  );
};

export default Edufeed;