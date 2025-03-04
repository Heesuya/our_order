import React, { useState } from "react";
import "./login.css";
import {
  setMemberName,
  setMemberNo,
  setMemberType,
} from "../../redux/UserSlice"; // 수정된 부분
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios를 사용하여 서버와 통신
import NaverLoginButton from "./NaverLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [member, setMember] = useState({ memberId: "", memberPw: "" });

  //redux에서 dispatch는 action을 reducer로 전달
  const dispatch = useDispatch();

  const login = () => {
    axios //password 노출을 막기 위해 post 사용
      .post(`${backServer}/member/login`, member)
      .then((res) => {
        console.log(res);
        //리덕스를 이용해서 로그인 상태 저장
        dispatch(setMemberNo(res.data.memberName));
        dispatch(setMemberType(res.data.memberLevel));
        dispatch(setMemberName(res.data.memberName));
        //로그인 이후 axios요청 시 발급받은 토큰값을 자동으로 axios에 추가하는 설정
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;
        //로그인 상태를 지속적으로 유지시키기위해 발급받은 refreshToken을 브라우저에 저장
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        window.localStorage.setItem("loginType", "home");
        navigate("/");
      })
      .catch((err) => {
        alert("아이디와 비밀번호를 확인해주세요.");
      });
  };

  return (
    <div>
      <div className="login">
        <form
          className="login_form"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <h1>Login Here</h1>
          <input
            className="input-field"
            type="text"
            placeholder="ID"
            value={member.memberId}
            onChange={(e) => setMember({ ...member, memberId: e.target.value })}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={member.memberPw}
            onChange={(e) => setMember({ ...member, memberPw: e.target.value })}
            required
          />
          <button type="submit" className="login-button login_submit_btn">
            Submit
          </button>
        </form>
        <div className="login-util">
          <span onClick={() => navigate("/signup")}>회원가입</span>
          <span onClick={() => navigate("/find-account")}>
            아이디/비밀번호찾기
          </span>
        </div>
        <NaverLoginButton />
      </div>
    </div>
  );
};

export default Login;
