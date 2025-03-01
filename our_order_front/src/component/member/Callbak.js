import React, { useEffect, useState } from "react";
import Loading from "../../utils/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // useDispatch를 최상위로 이동
import { setMemberNo } from "../../redux/UserSlice";
const Callbak = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // useDispatch를 최상위로 이동
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const message = params.get("message");
    const accessToken = params.get("accessToken");
    const memberNo = params.get("memberNo"); // memberNo 값 가져오기

    if (status === "success" && accessToken) {
      // 성공 시 accessToken 저장
      axios.defaults.headers.common["Authorization"] = `${accessToken}`;
      localStorage.setItem("naverAccessToken", accessToken);

      //const naverAccessToken = window.localStorage.getItem("naverAccessToken");
      //console.log("naverAccessToken : ", naverAccessToken); // 값 확인용

      // memberNo 값을 숫자 타입으로 변환하여 저장
      dispatch(setMemberNo(Number(memberNo)));

      // 페이지 이동 (추가)
      navigate("/member/info"); // 필요한 페이지로 이동
    } else {
      // 실패 시 메시지 표시
      alert("오류. 서버에 문의 해주세요.");
      navigate("/"); // 실패 시 홈으로 이동
    }
  }, [location, navigate, dispatch]); // 의존성에 dispatch 추가

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Callbak;
