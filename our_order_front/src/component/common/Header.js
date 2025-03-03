import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../redux/UserSlice";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const loginId = useSelector((state) => state.user.loginId);
  const memberNo = useSelector((state) => state.user.memberNo);
  const memberName = useSelector((state) => state.user.memberName);
  const memberType = useSelector((state) => state.user.memberType); // memberType 상태 가져오기
  console.log("Header, memberNo : " + memberNo);
  const dispatch = useDispatch(); // dispatch 이름 수정

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout()); // 로그아웃 액션 호출
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("loginType");
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
      <div className="header-info">
        {memberName ? ( // loginId가 있으면 로그인된 상태로 판단
          <div>
            <Link to="/member/info">{memberName}</Link>
            <span onClick={handleLogout}>로그아웃</span>
          </div>
        ) : (
          <Link to="/">로그인</Link> // 로그인 페이지로 이동
        )}
      </div>
    </header>
  );
};

export default Header;
