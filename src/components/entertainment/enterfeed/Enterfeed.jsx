import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
// import { Posts } from "../../data";
import Enterpost from "../enterpost/Enterpost";
import Entershare from "../entershare/Entershare";
//import Stories from "../stories/Stories";
import "./enterfeed.scss";

const Enterfeed = () => {
  const [enterposts, setPosts] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(collection(db, "enterposts"), (snapshot) => {
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
        <Entershare />
        {enterposts
          .sort((a, b) => b.data.timestamp - a.data.timestamp)
          .map((p) => (
            <Enterpost key={p.id} enterpost={p} />
          ))}
      </div>
    </div>
  );
};

export default Enterfeed;
