import React, { useEffect } from "react";

const NaverLoginButton = () => {
  const client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
  console.log(client_id);
  useEffect(() => {
    // 네이버 로그인 객체를 초기화
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: client_id,
      callbackUrl: "http://localhost:3000/naver/callback", // 로그인 후 리디렉션될 URL
      isPopup: false, // 팝업 방식 여부
      loginButton: { color: "green", type: 3, height: 50 }, // 로그인 버튼 스타일
    });

    naverLogin.init(); // 로그인 버튼을 초기화합니다.
  }, []);

  return <div id="naverIdLogin"></div>;
};

export default NaverLoginButton;
