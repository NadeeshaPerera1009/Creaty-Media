import React,{useState} from 'react';
import "./main.scss";
import logo from './logo.png';
import edu from './edu2.png';
import ad from './ad.jpg';
import cre from './cre.jpg';
import ent from './ent.jpg';
//import {Link} from 'react-scroll';
import Featurebox from './Featurebox';
import { Link } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";
import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function Main() {
    const { currentUser } = useContext(AuthContext);
    const [nav,setnav]=useState(false);

    const changeBackground = ()=>{
        if(window.scrollY >= 50){
            setInterval(true);
        }
        else{
            setnav(false);
        }
    }
    window.addEventListener('scroll',changeBackground);

    //const navigate = useNavigate();
    //navigate("/login");
     
  return (
    <div id='main'>
        <Link to='#' className='logo'>
       <img src={logo} alt=''/>
    </Link>
        
    <nav className={nav ? "nav active" : "nav"}>
        <h2 className='id'>Creaty <span className='clr'> Media </span></h2>
   
   <br></br>

    <input className='menu-btn' type='checkbox' id='menu-btn'/>
    <label className='menu-icon' for='menu-btn'>
       <span className='nav-icon'></span>
    </label>
    <ul className='menu'>
       <li><Link to='#'>Home</Link></li>
       <li><Link to='/login'>Sign In</Link></li>
       <li><Link to='/register'>Sign Up</Link></li>
       <li><Link to='#'>About</Link></li>
       <span onClick={() => signOut(auth)}>
       <li><Link to='#'>Log Out</Link></li>
       </span>
    </ul>

    
          <img src={currentUser.photoURL} alt="" className="navbarImg" />
        
     
   </nav>
   <hr className='hr'></hr>
   <br></br><br></br>
   
   <div className='header-heading'>
    </div>
    <div id='features'>
    <h1 className='h2'>Wayamba University of Sri Lanka</h1>
    <h2 className='h2'>Faculty of Applied Sciences</h2>
    <h2 className='h2'>Department of Computing and Information Systems</h2>
    <br></br>
        <div className='a-container'>

        <Link to='/eduhome'><Featurebox image={edu} title="Education"/></Link>
        <Link to='/adhome'><Featurebox image={ad} title="Advertisements"/></Link>
        <Link to='/crehome'><Featurebox image={cre} title="Creativity"/></Link>
        <Link to='/enterhome'> <Featurebox image={ent} title="Education"/></Link>
        </div>
        <h2 className='h2'>Feel free to Share your Contents  here</h2>
    </div>
    

   <div className='header-btns'>
    <br></br>
    <Link to="/register"><button className='header-btn'> Join Us</button></Link>
             </div>



    </div>

  )
}

export default Main;
