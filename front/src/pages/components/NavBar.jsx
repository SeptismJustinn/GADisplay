import React, { useState } from "react";
import styles from "./css/NavBar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fetchData } from "../../helpers/common";

function NavBar(props) {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const refreshTkn = sessionStorage.getItem("GAref");
      if (refreshTkn) {
        const { ok, data } = await fetchData(
          "/auth/login",
          sessionStorage.getItem("GAref"),
          "DELETE"
        );
        if (ok) {
          sessionStorage.removeItem("GAref");
          sessionStorage.removeItem("GAacc");
          alert("Logging out");
        } else {
          throw new Error(data);
        }
      } else {
        alert("Session missing, returning to login...");
      }
      setShowLogout(false);
      props.setIsLoggedIn(false);
      navigate("/admin");
    } catch (error) {
      alert("Error logging out, please refresh and/or try again!");
    }
  }

  return (
    <>
      <div className={styles.bar}>
        {props.isLoggedIn ? (
          <img
            src="/GALogo.png"
            alt="GA logo"
            className={styles.home_logo}
            onClick={() => setShowLogout(!showLogout)}
          />
        ) : (
          <Link to="/admin">
            <img src="/GALogo.png" alt="GA logo" className={styles.home_logo} />
          </Link>
        )}

        {props.isLoggedIn && (
          <div className={styles.links_container}>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? styles.navbar_active : styles.navbar_link
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                isActive ? styles.navbar_active : styles.navbar_link
              }
            >
              Courses
            </NavLink>
            <NavLink
              to="/admin/adhoc"
              className={({ isActive }) =>
                isActive ? styles.navbar_active : styles.navbar_link
              }
            >
              Ad-Hoc
            </NavLink>
            <NavLink
              to="/admin/displays"
              className={({ isActive }) =>
                isActive ? styles.navbar_active : styles.navbar_link
              }
            >
              Displays
            </NavLink>
            <NavLink
              to="/admin/administration"
              className={({ isActive }) =>
                isActive ? styles.navbar_active : styles.navbar_link
              }
            >
              Admin
            </NavLink>
          </div>
        )}
      </div>
      {props.isLoggedIn && (
        <div
          className={`${styles.logout_bar} ${
            showLogout ? styles.logout_active : ""
          }`}
          onClick={handleLogout}
        >
          Logout
        </div>
      )}
    </>
  );
}

export default NavBar;
