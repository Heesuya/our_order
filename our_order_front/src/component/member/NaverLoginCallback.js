import React, { useEffect } from "react";
import axios from "axios";

const NaverLoginCallback = () => {
  useEffect(() => {
    const backServer = process.env.REACT_APP_BACK_SERVER;

    const processNaverLogin = async () => {
      // URL의 해시 부분에서 query parameter들을 추출
      //access_token, state, token_type, expires_in
      const queryParams = window.location.hash.substring(1).split("&");
      const params = {};

      queryParams.forEach((param) => {
        const [key, value] = param.split("=");
        params[key] = value;
      });

      try {
        const response = await axios.post(
          `${backServer}/auth/naverlogi`,
          params
        );

        // console.log("서버에서 naverLogin 응답 옴!");
        // console.log(response);

        if (response.data.status === "failure") {
          if (response.data.errorCode == "502") {
            alert("Artify 계정으로 로그인 하세요");
          }
        }
        window.location.href = "/"; // 인덱스 페이지로 이동
      } catch (error) {
        // console.error("서버에서 naverlogin 에러 옴!");
        // console.error(error);
      }
    };
    processNaverLogin();
  }, []);

  return <div>로그인 중...</div>;
};

export default NaverLoginCallback;
