import React, { useContext, useEffect, useState } from "react";
import "./edupost.scss";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
  ChatBubbleOutline,
  MoreVert,
  Favorite,
  SaveOutlined,
  ThumbUp,
  ThumbUpAltOutlined,
  //ShareOutlined,
  Delete,
  Edit
} from "@mui/icons-material";
import { getDownloadURL, ref } from "firebase/storage";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
// import downloadjs from 'downloadjs';
//import CorsProxy from 'cors-anywhere';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { AuthContext } from "../../../context/AuthContext";

const Edupost = ({ edupost }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [editing, setEditing] = useState(false); // State for editing mode
  const [editedInput, setEditedInput] = useState(""); // Edited input
  const [error, setError] = useState(""); // State for error message
 
  const { currentUser } = useContext(AuthContext);
  //const corsProxy = new CorsProxy();

  //@@@@@@@@@@@@@@@@@@@@@@@@@@
  // const handleDownloadImage = async () => {
  //   try {
  //     const imageRef = ref(storage, edupost.data.img);
  //     const imageUrl = await getDownloadURL(imageRef);
  //     console.log("Image URL:", imageUrl);
  
  //     // Fetch the image as a blob
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  
  //     // Use 'downloadjs' to initiate the download
  //     downloadjs(blob, edupost.data.img, "image/jpeg");
  //   } catch (error) {
  //     console.error("Error downloading image: ", error);
  //   }
  // };
  

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "eduposts", edupost.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
    return () => {
      unSub();
    };
  }, [edupost.id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser.uid]);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "eduposts", edupost.id, "comments"),
      (snapshot) => {
        setComments(
          snapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            data: snapshot.data(),
          }))
        );
      }
    );
    return () => {
      unSub();
    };
  }, [edupost.id]);

  const handleComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "eduposts", edupost.id, "comments"), {
      comment: input,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setCommentBoxVisible(false);
    setInput("");
  };

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "eduposts", edupost.id, "likes", currentUser.uid));
    } else {
      await setDoc(doc(db, "eduposts", edupost.id, "likes", currentUser.uid), {
        userId: currentUser.uid,
      });
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };



  const handleDeletePost = async () => {
    try {
      // Check if the current user is the owner of the post
      if (currentUser.uid === edupost.data.uid) {
        await deleteDoc(doc(db, "eduposts", edupost.id)); // Assuming "posts" is your collection name
        console.log("Post deleted successfully");
      } else {
        console.error("You are not authorized to delete this post.");
        // You can display an error message to the user
      }
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleEditPost = () => {
    if (currentUser.uid === edupost.data.uid) {
      setEditing(true);
      setEditedInput(edupost.data.input);
      setError(""); // Reset error message
    } else {
      setError("You are not authorized to edit this post."); // Set error message
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "eduposts", edupost.id), {
        input: editedInput
      });
      setEditing(false);
      edupost.data.input = editedInput; // Update post data
    } catch (error) {
      console.error("Error editing post: ", error);
    }
  };

  // const downloadFile=() =>{
  //   const element = document.createElement("a");
  //   element.setAttribute(
  //     "href",
  //     "data:text/plain;charset=utf-8," + encodeURIComponent(fileData)

  //   );
  //   element.setAttribute("download",currentUser.data.url);
  //   element.setAttribute("target","_blank");
  //   element.style.display="none";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };
  

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to="/profile/userId">
              <img src={edupost.data.photoURL} alt="" className="postProfileImg" />
            </Link>
            <span className="postUsername">
              {edupost.data.displayName}
            </span>
            <span className="postDate">
              <TimeAgo
                date={new Date(edupost.data?.timestamp?.toDate()).toLocaleString()}
              />
            </span>
          </div>
          <div className="postTopRight">
            <IconButton onClick={handleOpenMenu}>
              <MoreVert className="postVertButton" />
            </IconButton>
            <Menu
              id="post-options-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleEditPost}>
                <Edit />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDeletePost}>
                <Delete />
                Delete
              </MenuItem>
            </Menu>
            {editing && (
              <IconButton onClick={handleSaveEdit}>
                <SaveOutlined className="postSaveButton" />
              </IconButton>
            )}
          </div>
        </div>
        <div className="postCenter">
        {editing ? (
            <textarea
              value={editedInput}
              onChange={(e) => setEditedInput(e.target.value)}
              rows={2}
              cols={150}
            />
          ) : (
            <>
          <span className="postText">{edupost.data.input}</span>
          <img src={edupost.data.img} alt="" className="postImg" />
          </>)}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite className="bottomLeftIcon" style={{ color: "red" }} />
            <ThumbUp
              onClick={(e) => {
                likePost();
              }}
              className="bottomLeftIcon"
              style={{ color: "#011631" }}
            />
            {likes.length > 0 && (
              <span className="postLikeCounter">{likes.length}</span>
            )}
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => setCommentOpen(!commentOpen)}
            >
              {comments.length} · comments 
            </span>
          </div>
        </div>

        <hr className="footerHr" />
        <div className="postBottomFooter">
          <div
            className="postBottomFooterItem"
            onClick={(e) => {
              likePost();
            }}
          >
            {liked ? (
              <ThumbUp style={{ color: "#011631" }} className="footerIcon" />
            ) : (
              <ThumbUpAltOutlined className="footerIcon" />
            )}
            <span className="footerText">Like</span>
          </div>
          <div
            className="postBottomFooterItem"
            onClick={() => setCommentBoxVisible(!commentBoxVisible)}
          >
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">Comment</span>
          </div>
          <div className="postBottomFooterItem">
            <FileDownloadIcon className="footerIcon" />
            <span className="footerText" >Download</span>
          </div>
        </div>
      </div>
      {commentBoxVisible && (
        <form onSubmit={handleComment} className="commentBox">
          <textarea
            type="text"
            placeholder="Write a comment ..."
            className="commentInput"
            rows={1}
            style={{ resize: "none" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input} className="commentPost">
            Comment
          </button>
        </form>
      )}

      {commentOpen > 0 && (
        <div className="comment">
          {comments
            .sort((a, b) => b.data.timestamp - a.data.timestamp)
            .map((c) => (
              <div>
                <div className="commentWrapper">
                  <img
                    className="commentProfileImg"
                    src={c.data.photoURL}
                    alt=""
                  />
                  <div className="commentInfo">
                    <span className="commentUsername">
                      {c.data.displayName}
                    </span>
                    <p className="commentText">{c.data.comment}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Edupost;
