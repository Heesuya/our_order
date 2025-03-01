import React, { useEffect } from "react";
import img from "./img/btnG_완성형.png";

const NaverLoginButton = () => {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  // CSRF 방지를 위한 랜덤 상태값 생성
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  const redirectUri = encodeURIComponent(`${backServer}/auth/callback`); // 네이버 로그인 후 리다이렉트할 URL
  // 네이버 로그인 URL 생성
  const state = encodeURIComponent(generateRandomState()); // CSRF 보호를 위한 상태값
  const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}`;

  const handleLogin = () => {
    window.location.href = naverLoginUrl; // 네이버 로그인 페이지로 이동
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        backgroundImage: `url(${img})`, // 문자열 템플릿 사용
        backgroundSize: "cover",
        width: "60%",
        height: "8%",
        border: "none",
        marginBottom: "5px",
        borderRadius: "5px",
      }}
    ></button>
  );
};

export default NaverLoginButton;
