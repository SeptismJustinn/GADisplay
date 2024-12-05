import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./pages/components/NavBar";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCoursePage from "./pages/AdminCoursesPage";
import AdminAddPage from "./pages/AdminAddPage";
import AdminEditPage from "./pages/AdminEditPage";
import AdminAdhocPage from "./pages/AdminAdhocPage";
import AdminDisplayViewerPage from "./pages/AdminDisplayViewerPage";
import AdminAdministrationPage from "./pages/AdminAdministrationPage";
import UserContext from "./context/user";
import jwtDecode from "jwt-decode";
import { fetchData } from "./helpers/common";
import AdminErrorPage from "./pages/AdminErrorPage";
import DisplayPage from "./pages/DisplayPage";

function AdminApp() {
  const [accessToken, setAccessToken] = useState("");
  const [claims, setClaims] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Background refresh when navigating pages
  async function refreshAccessTkn() {
    if (
      new Date(jwtDecode(accessToken).exp * 1000) - new Date() >
      1000 * 60 * 15
    ) {
      // If access token still has more than 15 minutes to expiry, do nothing
      return;
    }
    const refresh = sessionStorage.getItem("GAref");
    if (!refresh) {
      return;
    }
    const refDecoded = jwtDecode(refresh);
    if (new Date(refDecoded.exp * 1000) - new Date() < 0) {
      // If refresh token expired, don't throw error, let session timeout
      return;
    }
    try {
      const { ok, data } = await fetchData("/auth/refresh", refresh, "POST");
      if (ok) {
        setAccessToken(data.access);
      }
    } catch (error) {
      console.log("No auto-refresh");
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      refreshAccessTkn();
    }
  }, [location]);

  return (
    <>
      <UserContext.Provider
        value={{
          accessToken,
          claims,
        }}
      >
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              <AdminLoginPage
                setAccessToken={setAccessToken}
                setClaims={setClaims}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/register" element={<AdminRegisterPage />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <AdminDashboardPage /> : <AdminErrorPage />}
          />
          <Route
            path="/courses"
            element={isLoggedIn ? <AdminCoursePage /> : <AdminErrorPage />}
          />
          <Route
            path="/courses/add"
            element={isLoggedIn ? <AdminAddPage /> : <AdminErrorPage />}
          />
          <Route
            path="/courses/edit/:name"
            element={isLoggedIn ? <AdminEditPage /> : <AdminErrorPage />}
          />
          <Route
            path="/adhoc"
            element={isLoggedIn ? <AdminAdhocPage /> : <AdminErrorPage />}
          />
          <Route
            path="/displays"
            element={
              isLoggedIn ? <AdminDisplayViewerPage /> : <AdminErrorPage />
            }
          />
          <Route
            path="/administration"
            element={
              isLoggedIn ? <AdminAdministrationPage /> : <AdminErrorPage />
            }
          />
          <Route path="/display/:number" element={<DisplayPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default AdminApp;
