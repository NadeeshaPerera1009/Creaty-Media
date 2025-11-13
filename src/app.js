import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import Main from "./pages/main/Main";
import Home from "./pages/home/Home";
import Eduhome from "./pages/eduhome/Eduhome";
import Adhome from "./pages/adhome/Adhome";
import Crehome from "./pages/crehome/Crehome";
import Enterhome from "./pages/enterhome/Enterhome";
//import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import EditProfile from "./pages/editProfile/EditProfile";
import Profile from "./pages/profile/Profile";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const AuthRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    // {
    //   path: "/main",
    //   element: <Main />,
    // },
    
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/main",
      element: (
        <AuthRoute>
          <Main />
        </AuthRoute>
      ),
    },
    {
      path: "/adhome",
      element: (
        <AuthRoute>
          <Adhome />
        </AuthRoute>
      ),
    },
    {
      path: "/enterhome",
      element: (
        <AuthRoute>
          <Enterhome />
        </AuthRoute>
      ),
    },
    {
      path: "/crehome",
      element: (
        <AuthRoute>
          <Crehome />
        </AuthRoute>
      ),
    },

    {
      path: "/eduhome",
      element: (
        <AuthRoute>
          <Eduhome />
        </AuthRoute>
      ),
    },
    {
      path: "/",
      element: (
        <AuthRoute>
          <Home />
        </AuthRoute>
      ),
    },
    {
      path: "/profile/:username",
      element: (
        <AuthRoute>
          <Profile />
        </AuthRoute>
      ),
    },
    {
      path: "/profile/:username/edit",
      element: (
        <AuthRoute>
          <EditProfile />
        </AuthRoute>
      ),
    },
  ]);
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <RouterProvider router={router} />
      
    </div>
  );
}

export default App;
