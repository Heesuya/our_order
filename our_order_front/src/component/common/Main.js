import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/UserSlice";
import Login from "../member/Login";

const Main = () => {
  const user = useSelector(selectUser); // Redux에서 로그인 상태 가져오기

  return (
    <div className="main">{user ? <div>메인 페이지</div> : <Login />}</div>
  );
};

export default Main;
