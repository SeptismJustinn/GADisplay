import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./pages_css/AdminLoginPage.module.css";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { fetchData } from "../helpers/common";

function AdminLoginPage(props) {
  const emailRef = useRef();
  const pwRef = useRef();
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    if (emailRef.current.value == "") {
      alert("Please enter email!");
      return emailRef.current.focus();
    } else if (pwRef.current.value == "") {
      alert("Please enter password!");
      return pwRef.current.focus();
    }
    try {
      const { ok, data } = await fetchData("/auth/login", undefined, "POST", {
        email: emailRef.current.value,
        password: pwRef.current.value,
      });

      if (ok) {
        if (data.access == "" || data.refresh == "") {
          navigate("/admin/dashboard");
          return alert("Account pending approval");
        }
        sessionStorage.setItem("GAacc", data.access);
        sessionStorage.setItem("GAref", data.refresh);
        props.setAccessToken(data.access);
        const decoded = jwtDecode(data.access);
        props.setClaims(decoded);
        props.setIsLoggedIn(decoded.role == "User" || decoded.role == "Admin");
        alert(
          `Logged in as user: ${decoded.name}, current role: ${decoded.role}`
        );
        navigate("/admin/dashboard");
      } else {
        throw new Error(data);
      }
    } catch (error) {
      console.log(error.message);
      alert("Error logging in, please try again");
    }
  }

  return (
    <>
      <div className={styles.banner}>
        <img src="/GA_banner_horizontal_black.png" alt="GA banner" />
      </div>
      <form onSubmit={handleLogin}>
        <div className={styles.input_grid}>
          <label htmlFor="email">GA Email: </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
            placeholder="user@generalassemb.ly"
            pattern=".+@generalassemb\.ly"
            title="General Assembly email (@generalassemb.ly)"
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            ref={pwRef}
            required
            placeholder="password"
          />
          <input type="submit" className={styles.button} value="Log in" />
        </div>
      </form>
      <hr />
      <div className={styles.register_prompt}>
        Require access? Please <Link to="/admin/register">register</Link> and
        inform an admin.
      </div>
    </>
  );
}

export default AdminLoginPage;
