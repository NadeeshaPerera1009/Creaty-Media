import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import "./register.scss";
import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";

const Register = () => {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();


//Index start



  //Index end

  const handleRegister = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const indexNumber = e.target[2].value;
    const password = e.target[3].value;
    
    try {
      const res = await createUserWithEmailAndPassword(auth, email,indexNumber, password);
      
      const storageRef = ref(storage, "usersImages/" + displayName);

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          setError(true);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              indexNumber,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "usersPosts", res.user.uid), { messages: [] });
            // console.log(res.user);
          });
        }
      );
    } catch (error) {
      setError(true);
    }
    navigate("/login");
  };
  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <div className="logoimg">
            <img src="/images/posts/logo.png" alt="" className="logoimage" />
          </div>
          <h3 className="registerLogo">Creaty <span className="span">Media</span></h3>
          <span className="registerDesc">
            Feel free to share your creative contents
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <div className="top">
              <img
                src={img ? URL.createObjectURL(img):"/images/profileCover/DefaultProfile.jpg"}
                alt=""
                className="profileImg"
              />
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlined className="icon" />
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".png,.jpeg,.jpg,.mp4,.mp3"
                    style={{ display: "none" }}
                    onChange={(e)=>setImg(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleRegister}className="bottomBox">
                <input
                  type="text"
                  placeholder="Username"
                  id="displayName"
                  className="registerInput"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="registerInput"
                  required
                />
                <input
                  type="text"
                  placeholder="Registration Number"
                  id="indexNumber"
                  className="registerInput"
                 
                  pattern="^(1[6-9]|2[0-2])\d{4}$"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="registerInput"
                  required
                />
                {/*<input
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPasword"
                  className="registerInput"
                  required
  /> */}
                <button type="submit" className="registerButton">
                  Sign Up
                </button>
                <Link to="/login"> 
                  <button className="loginRegisterButton">
                    Log into Account
                  </button>
                </Link>  
                {error && <span className="error">Something went wrong</span>}
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
