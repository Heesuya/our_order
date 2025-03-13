import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/UserSlice";
import Login from "../member/Login";
import MemberMain from "../member/MemberMain";
import "./default.css";

const Main = () => {
  const { memberNo } = useSelector(selectUser); // Redux에서 로그인 상태 가져오기

  return (
    <div className="main">
      {memberNo ? (
        <MemberMain />
      ) : (
        <Login /> // 로그인되지 않았다면 Login 컴포넌트 렌더링
      )}
    </div>
  );
};

export default Main;
