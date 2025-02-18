// Header.js
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/UserSlice";

const Header = () => {
  const user = useSelector(selectUser);
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
      <div>{user ? "로그아웃" : "로그인"}</div>
    </header>
  );
};

export default Header;
