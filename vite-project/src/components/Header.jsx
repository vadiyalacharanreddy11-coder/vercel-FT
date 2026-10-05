import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = {
    unauthenticated: [
      { to: "/", label: "Home" },
      { to: "/user/login", label: "Login" },
      { to: "/user/register", label: "Register" },
      { to: "/foodpartner/login", label: "For Partners" },
    ],
    user: [
      { to: "/", label: "Home" },
      { to: "/search", label: "Search" },
      { to: "/profile", label: "Profile" },
    ],
    foodpartner: [
      { to: "/foodpartner/dashboard", label: "Dashboard" },
      { to: "/store/" + (session.foodpartner?._id || ""), label: "My Store" },
      { to: "/createFood", label: "Add Food" },
    ],
  };

  const currentRoleLinks = navLinks[session.role] || navLinks.unauthenticated;

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  const renderLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) =>
        "nav-link" + (isActive ? " nav-link-active" : "")
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {item.label}
    </NavLink>
  );

  return (
    <header className="site-header">
      <div className="brand-wrap">
        <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
          FoodReels
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <nav className={`nav-list ${isMobileMenuOpen ? "is-open" : ""}`}>
        {session.role === "unauthenticated" || session.role === null
          ? navLinks.unauthenticated.map(renderLink)
          : session.role === "user"
            ? [...navLinks.user.map(renderLink), (
                <button key="logout-user" type="button" className="nav-button" onClick={handleLogout}>
                  Logout
                </button>
              )]
            : [...navLinks.foodpartner.map(renderLink), (
                <button key="logout-partner" type="button" className="nav-button" onClick={handleLogout}>
                  Logout
                </button>
              )]}
      </nav>
    </header>
  );
};

export default Header;
