import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../redux/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const loginId = useSelector((state) => state.user.loginId);
  const memberNo = useSelector((state) => state.user.memberNo);
  const memberName = useSelector((state) => state.user.memberName);
  const memberType = useSelector((state) => state.user.memberType);
  //console.log("Header, memberNo : " + memberNo); 확인용
  const dispatch = useDispatch(); // dispatch 이름 수정
  const loginType = localStorage.getItem("loginType");
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    if (loginType === "naver") {
      axios
        .delete(`${backServer}/auth`, { withCredentials: true })
        .then((res) => {
          console.log("로그아웃 성공!");
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("loginType");
          navigate("/");
        })
        .catch((err) => {
          console.log("로그아웃 실패!");
        });
    } else {
      //로그아웃 액션 호출
      dispatch(logout());
      //Authorization 헤더에 Access Token 삭제
      delete axios.defaults.headers.common["Authorization"];
      //일반 로그인 로직은 리프레쉬토큰을 로컬스토리지에 저장을 한 상태 -> 삭제
      window.localStorage.removeItem("refreshToken");
      //로그인 타입 삭제
      window.localStorage.removeItem("loginType");
      navigate("/");
    }
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
