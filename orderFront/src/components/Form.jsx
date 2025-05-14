import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUsername } from "../redux/userSlice"; // adjust path as needed
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";

function Form() {
  const dispatch = useDispatch();
  const [username, setUser] = useState("");

  const handleUsernameChange = (e) => setUser(e.target.value);

  const handleSignIn = () => {
    dispatch(setUsername(username));
  };

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-200 align-center">
      <h1 className="text-5xl font-semibold">Welcome Back!</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Welcome back! Please enter your details.
      </p>
      <div className="mt-8">
        <div>
          <label className="text-lg font-medium" htmlFor="username">Username</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
          <label className="text-lg font-medium mt-4" htmlFor="password">Password</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            type="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="mt-8 flex flex-col gap-y-4">
          <div className="text-center hover:bg-sky-200 border-2 border-gray-700 p-2 rounded-s-lg text-bold">
            <Link to="/customerPage" onClick={handleSignIn}>
              <button className="flex items-center gap-x-2">
                <CiLogin className="text-2xl" />
                SignInAsCustomer
              </button>
            </Link>
          </div>
          <div className="text-center hover:bg-sky-200 border-2 border-gray-700 p-2 rounded-s-lg text-bold">
            <Link to="/ownerPage" onClick={handleSignIn}>
              <button className="flex items-center gap-x-2">
                <CiLogin className="text-2xl" />
                SignInAsShopOwner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
