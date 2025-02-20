// Header.js
import React from "react";
import { useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const user = useSelector(selectUser);
  const dispath = useDispatch();
  const handleLogout = (e) => {
    e.preventDefault();
    dispath(logout());
  };
  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
      <div>
        {user ? (
          <span onClick={(e) => handleLogout(e)}>로그아웃</span>
        ) : (
          <Link to="/">로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
