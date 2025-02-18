import React, { useState } from "react";
import "./login.css";
import { login } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const naver_id = process.env.CLIENT_ID_NAVER;
  const kakao_id = process.env.CLIENT_ID_KAKAO;

  const handleNaverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=http://localhost:8080/login/oauth2/code/naver`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao_id}&redirect_uri=http://localhost:8080/login/oauth2/code/kakao`;
  };

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      login({
        id: id,
        password: password,
        loggedIn: true,
      })
    );
  };
  return (
    <div>
      <div className="login">
        <form className="login_form" onSubmit={(e) => handleSubmit(e)}>
          <h1>Login Here </h1>
          <input
            className="input-field"
            type="id"
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button login_submit_btn">
            Submit
          </button>
        </form>
        <div className="login-util">
          <span>회원가입</span>
          <span>아이디/비밀번호찾기</span>
        </div>
        <button
          className="login-button naver-button"
          onClick={handleNaverLogin}
        >
          네이버 로그인
        </button>
        <button
          className="login-button kakao-button"
          onClick={handleKakaoLogin}
        >
          카카오 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
