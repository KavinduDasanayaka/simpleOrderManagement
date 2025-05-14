import React from "react";
import { useSelector } from "react-redux";
import Logout from "./LogoutButton";

const Header = () => {
  const username = useSelector((state) => state.user.username); // ✅ get username from Redux

  return (
    <header style={{ padding: "1rem", background: "#1976d2", color: "#fff" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://img.freepik.com/premium-vector/online-food-logo-design_523404-883.jpg"
            alt="Logo"
            style={{
              width: "75px",
              height: "50px",
              borderRadius: "50%",
              paddingLeft: "20px",
              paddingRight: "20px"
            }}
          />
          <h1 className="text-xl font-bold">Simple Order Management</h1>
        </div>

        {/* ✅ Display username on the right */}
        <div className="flex items-center gap-4 pr-4">
          <span className="text-sm font-medium">
            {username ? `Welcome, ${username}` : "Welcome, Guest"}
          </span>
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
