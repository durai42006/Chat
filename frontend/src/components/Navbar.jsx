import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import "../css/Navbar.css"; // ✅ Import CSS file
import defaultAvatar from "../assets/user.png"; // ✅ Default avatar image
import userAvatar from "../assets/user.png"; // ✅ User avatar image
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // Clear user data
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">AptEx</Link>
      </div>

      <div className="navbar-right">
        <Link to="/" className="navbar-link">Home</Link>
        
        {!user ? (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
            <img src={defaultAvatar} alt="Default User" className="user-avatar" />
          </>
        ) : (
          <>
            <div className="user-info">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <img src={userAvatar} alt="User" className="user-avatar" />
              <span className="username">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
