import React, { useContext, useEffect, useState } from "react";
import "./enterpost.scss";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
  ChatBubbleOutline,
  MoreVert,
  Favorite,
  ThumbUp,
  ThumbUpAltOutlined,
  ShareOutlined,
  SaveOutlined,
  Delete,
  Edit
} from "@mui/icons-material";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
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
import { db } from "../../../firebase";
import { AuthContext } from "../../../context/AuthContext";

const Enterpost = ({ enterpost }) => {
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

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "enterposts", enterpost.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
    return () => {
      unSub();
    };
  }, [enterpost.id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser.uid]);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "enterposts", enterpost.id, "comments"),
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
  }, [enterpost.id]);

  const handleComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "enterposts", enterpost.id, "comments"), {
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
      await deleteDoc(doc(db, "enterposts", enterpost.id, "likes", currentUser.uid));
    } else {
      await setDoc(doc(db, "enterposts", enterpost.id, "likes", currentUser.uid), {
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
      if (currentUser.uid === enterpost.data.uid) {
        await deleteDoc(doc(db, "enterposts", enterpost.id)); // Assuming "posts" is your collection name
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
    if (currentUser.uid === enterpost.data.uid) {
      setEditing(true);
      setEditedInput(enterpost.data.input);
      setError(""); // Reset error message
    } else {
      setError("You are not authorized to edit this post."); // Set error message
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "enterposts", enterpost.id), {
        input: editedInput
      });
      setEditing(false);
      enterpost.data.input = editedInput; // Update post data
    } catch (error) {
      console.error("Error editing post: ", error);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to="/profile/userId">
              <img src={enterpost.data.photoURL} alt="" className="postProfileImg" />
            </Link>
            <span className="postUsername">
              {enterpost.data.displayName}
            </span>
            <span className="postDate">
              <TimeAgo
                date={new Date(enterpost.data?.timestamp?.toDate()).toLocaleString()}
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
          <span className="postText">{enterpost.data.input}</span>
          <img src={enterpost.data.img} alt="" className="postImg" />
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
            <ShareOutlined className="footerIcon" />
            <span className="footerText">Share</span>
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

export default Enterpost;
