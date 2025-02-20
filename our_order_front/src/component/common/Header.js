import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../redux/UserSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const loginId = useSelector((state) => state.user.loginId); // loginId로 상태 가져오기
  //const memberType = useSelector((state) => state.user.memberType); // memberType 상태 가져오기
  console.log(loginId + "ddd");
  const dispatch = useDispatch(); // dispatch 이름 수정

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout()); // 로그아웃 액션 호출
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
        {loginId ? ( // loginId가 있으면 로그인된 상태로 판단
          <span onClick={handleLogout}>로그아웃</span>
        ) : (
          <Link to="/">로그인</Link> // 로그인 페이지로 이동
        )}
      </div>
    </header>
  );
};

export default Header;
