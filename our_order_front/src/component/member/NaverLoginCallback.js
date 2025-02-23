import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  setMemberNo,
  setMemberType,
  setMemberName,
} from "../../redux/UserSlice";
import { useDispatch } from "react-redux";

const NaverLoginCallback = () => {
  //URL의 위치(location) 정보를 가져오는 훅
  const location = useLocation();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loading, setLoading] = useState(true); // 로딩 상태
  const dispatch = useDispatch();

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace("#", "")); // hash에서 #을 제거하고 파라미터 파싱
    const accessToken = hashParams.get("access_token");
    const state = hashParams.get("state");
    const tokenType = hashParams.get("token_type");
    const expiresIn = hashParams.get("expires_in");

    console.log("access_token:", accessToken); // 인증 토큰
    console.log("state:", state); // 상태 값
    console.log("token_type:", tokenType); // 토큰 타입
    console.log("expires_in:", expiresIn); // 만료 시간

    if (accessToken && state) {
      // 인증 정보를 서버로 전송
      axios
        .post(
          `${backServer}/auth/naverlogin`,
          { accessToken, state, tokenType, expiresIn } // 인증 정보 전송
        )
        .then((res) => {
          console.log("서버에서 naverLogin 응답 옴!");
          console.log(res);

          if (res.data.status === "failure") {
            if (res.data.errorCode === "502") {
              //  alert("Artify 계정으로 로그인 하세요");
            }
          } else {
            //naverAccessToken 저장
            axios.defaults.headers.common["Authorization"] =
              res.data.accessToken;
            window.localStorage.setItem(
              "naverAccessToken",
              res.data.accessToken
            );
            const { memberLevel, memberNo, memberName } = res.data;
            const naverAccessToken =
              window.localStorage.getItem("naverAccessToken");

            console.log("네이버 리프레시 토큰 콜백:", naverAccessToken); // 값 확인용

            // Redux 상태 업데이트
            dispatch(setMemberType(memberLevel));
            dispatch(setMemberNo(memberNo));
            dispatch(setMemberName(memberName));

            // 로그인 성공시 인덱스 페이지로 이동
            //window.location.href = "/";
          }
        })
        .catch((error) => {
          console.error("서버에서 naverlogin 에러 옴!");
          console.error(error);
        })
        .finally(() => {
          setLoading(false); // 로딩 완료
        });
    }
  }, [location.hash, backServer]); // hash와 backServer가 변경되면 useEffect 실행

  return <div>{loading ? "로그인 중..." : "로그인 완료!"}</div>;
};

export default NaverLoginCallback;
