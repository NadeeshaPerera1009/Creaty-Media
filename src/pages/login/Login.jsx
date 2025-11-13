import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { auth } from "../../firebase";

const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
    } 
    catch (error) {
      setError(true);
      navigate("/");
    }
    
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <img src="/images/posts/logo.png" alt="" className="loginimg" />
          <h3 className="loginLogo">Creaty <span className="logo">Media</span></h3>
          <span className="loginDesc">
            Feel free to share your creative contents
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <div className="bottom">
              <form onSubmit={handleLogin} className="bottomBox">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="loginInput"
                  required
                 // onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="loginInput"
                 // minLength={6}
                  required
                 // onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="loginButton">
                  Sign In
                </button>
                <Link to="/register">
                  <button className="loginRegisterButton">
                    Create a New Account
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

export default Login;
