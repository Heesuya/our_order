import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/UserSlice";
import Login from "../member/Login";

const Main = () => {
  const { loginId } = useSelector(selectUser); // Redux에서 로그인 상태 가져오기

  return (
    <div className="main">
      {loginId ? (
        <div>메인 페이지</div>
      ) : (
        <Login /> // 로그인되지 않았다면 Login 컴포넌트 렌더링
      )}
    </div>
  );
};

export default Main;
