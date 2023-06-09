import React from "react";
import RoomDisplayList from "./components/RoomDisplayList";
import { Link } from "react-router-dom";
import styles from "./pages_css/LandingPage.module.css";
import display_styles from "./components/css/RoomDisplayDark.module.css";

function LandingPage() {
  return (
    <div className={styles.container}>
      <h2 className="display-1">CLASSROOM DISPLAY</h2>
      <hr />
      <RoomDisplayList styles={display_styles} admin={false} />
      <hr />
      <Link to="/admin">
        <img
          src="/GA_banner_horizontal_white.png"
          alt="GA icon login"
          className={styles.banner}
        />
      </Link>
    </div>
  );
}

export default LandingPage;
