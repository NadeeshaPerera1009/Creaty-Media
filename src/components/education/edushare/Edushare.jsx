import {
  Close,
  EmojiEmotions,
  PermMedia,
  VideoCameraFront,
} from "@mui/icons-material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import React, { useContext, useState } from "react";
import "./edushare.scss";
import { AuthContext } from "./../../../context/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import Picker from "@emoji-mart/react";

const Edushare = () => {
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [img, setImg] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null); // Define pdf state

  const handlePost = async () => {
    let file = img || audio || video || pdf; // Include pdf in the file check
    if (file) {
      const storageRef = ref(storage, "Eduposts/" + uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(collection(db, "eduposts"), {
              uid: currentUser.uid,
              photoURL: currentUser.photoURL,
              displayName: currentUser.displayName,
              input,
              media: file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "pdf",
              url: downloadURL,
              timestamp: serverTimestamp(),
            });

            await updateDoc(doc(db, "usersPosts", currentUser.uid), {
              messages: arrayUnion({
                id: uuid(),
                uid: currentUser.uid,
                photoURL: currentUser.photoURL,
                displayName: currentUser.displayName,
                input,
                media: file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "pdf",
                url: downloadURL,
                timestamp: Timestamp.now(),
              }),
            });
          });
        }
      );
    } else if (img) {
      const storageRef = ref(storage, "Eduposts/" + uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress events
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          // Handle errors during upload
          console.error("Error uploading image:", error);
        },
        () => {
          // Handle successful completion of the upload
          console.log("Upload completed successfully!");
      
          // Now, you can get the download URL and use it as needed
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Use the downloadURL in your application
            console.log("Download URL:", downloadURL);
          });
        }
      );
    }
    // Reset states
    setInput("");
    setImg(null);
    setAudio(null);
    setVideo(null);
    setPdf(null); // Reset pdf state
    setShowEmojis(false);
  };

  const handleKey = (e) => {
    e.code === "Enter" && handlePost();
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const removeImage = () => {
    setImg(null);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img src={currentUser.photoURL} alt="" className="shareProfileImg" />
          <textarea
            type="text"
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder={"What's on your mind " + currentUser.displayName + "?"}
            value={input}
            className="shareInput"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <hr className="shareHr" />
        {img && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(img)} alt="" className="shareImg" />
            <Close className="shareCancelImg" onClick={removeImage} />
          </div>
        )}
        {audio && (
          <div className="shareAudioContainer">
            <audio controls className="shareAudio">
              <source src={URL.createObjectURL(audio)} type={audio.type} />
              Your browser does not support the audio element.
            </audio>
            <Close className="shareCancelAudio" onClick={() => setAudio(null)} />
          </div>
        )}
        {video && (
          <div className="shareVideoContainer">
            <video controls className="shareVideo">
              <source src={URL.createObjectURL(video)} type={video.type} />
              Your browser does not support the video element.
            </video>
            <Close className="shareCancelVideo" onClick={() => setVideo(null)} />
          </div>
        )}
        {pdf && (
          <div className="sharePdfContainer">
            <iframe src={URL.createObjectURL(pdf)} className="sharePdf" title="Shared PDF Document"/>
            <Close className="shareCancelPdf" onClick={() => setPdf(null)} />
          </div>
        )}
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <label htmlFor="file" className="shareOption">
                <UploadFileIcon
                  className="shareIcon"
                  style={{ color: "#bb0000f2" }}
                />
                <span className="shareOptionText">PDF</span>
                <input
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg,.mp3,.wav,.mp4,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file.type.startsWith("image/")) {
                      setImg(file);
                    } else if (file.type.startsWith("audio/")) {
                      setAudio(file);
                    } else if (file.type.startsWith("video/")) {
                      setVideo(file);
                    } else if (file.type === "application/pdf") {
                      setPdf(file);
                    }
                  }}
                />
              </label>
            </div>
            <label htmlFor="file" className="shareOption">
              <PermMedia className="shareIcon" style={{ color: "#2e0196f1" }} />
              <span className="shareOptionText">Photo</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg,.pdf"
                style={{ display: "none" }}
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            <div
              onClick={() => setShowEmojis(!showEmojis)}
              className="shareOption"
            >
              <EmojiEmotions
                className="shareIcon"
                style={{ color: "#bfc600ec" }}
              />
              <span className="shareOptionText">Feelings/Activity</span>
            </div>
          </div>
        </div>
        {showEmojis && (
          <div className="emoji">
            <Picker onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Edushare;
