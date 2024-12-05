import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminErrorPage() {
  return (
    <div style={{ margin: "5vh 5%" }}>
      <h4>Please contact an Admin and wait for them to grant you access.</h4>
      <Link to="/admin">
        <button>Back to Login</button>
      </Link>
    </div>
  );
}

export default AdminErrorPage;
