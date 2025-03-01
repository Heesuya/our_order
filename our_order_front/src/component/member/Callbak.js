import React, { useEffect, useState } from "react";
import Loading from "../../utils/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Callbak = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const message = params.get("message");
    const accessToken = params.get("accessToken");

    //console.log(params);
    if (status === "success" && accessToken) {
      // 성공 시 accessToken 저장
      //refresh token -> cookie 에 저장
      axios.defaults.headers.common["Authorization"] = `${accessToken}`;
      localStorage.setItem("accessToken", accessToken);
      //console.log(accessToken);
      //navigate("/member/info"); // 메인 페이지 이동
    } else {
      // 실패 시 메시지 표시
      setErrorMessage(message || "로그인 실패");
      alert("오류. 서버에 문의 해주세요.");
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Callbak;
