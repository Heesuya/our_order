import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./component/common/Main";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";
import Signup from "./component/member/Signup";
import FindeAccount from "./component/member/FindeAccount";
import Login from "./component/member/Login";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import {
  setLoginId,
  setMemberName,
  setMemberType,
  setMemberNo,
} from "./redux/UserSlice"; // 수정된 부분
import NaverLoginCallback from "./component/member/NaverLoginCallback";
import MemberMain from "./component/member/MemberMain";

function App() {
  const dispatch = useDispatch();
  const loginId = useSelector((state) => state.user.loginId);
  const memberType = useSelector((state) => state.user.memberType);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  console.log("loginddId" + loginId);
  console.log("memberType" + memberType);

  useEffect(() => {
    refreshLogin();
    //window.setInterval(refreshLogin, 30 * 1000); // 30초마다 자동으로 로그인 정보 refresh

    window.setInterval(refreshLogin, 60 * 60 * 1000); // 한 시간마다 자동으로 로그인 정보 refresh
  }, []);

  const clearLoginState = () => {
    dispatch(setLoginId("")); // 로그인 상태 초기화
    dispatch(setMemberNo(0));
    dispatch(setMemberType(0)); // memberType 초기화
    dispatch(setMemberName(""));
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("naverAccessToken");
  };

  const refreshLogin = async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    const naverAccessToken = window.localStorage.getItem("naverAccessToken");
    console.log("네이버 리프레시 토큰:", naverAccessToken); // 값 확인용

    if (refreshToken != null) {
      axios.defaults.headers.common["Authorization"] = refreshToken;
      axios
        .post(`${backServer}/member/refresh`)
        .then((res) => {
          console.log(res);
          dispatch(setLoginId(res.data.memberId)); // loginId 업데이트
          dispatch(setMemberType(res.data.memberType)); // memberType 업데이트
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((err) => {
          console.log(err);
          dispatch(setLoginId("")); // 로그인 상태 초기화
          dispatch(setMemberNo(0));
          dispatch(setMemberType(0)); // memberType 초기화
          dispatch(setMemberName(""));
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    } else if (naverAccessToken != null) {
      // 네이버 로그인 토큰 갱신
      try {
        const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_NAVER_CLIENT_SECRET;
        console.log(1);
        const response = await axios.get(`${backServer}/auth/naverRefresh`, {
          params: {
            refreshToken: naverAccessToken,
          },
        });
        console.log("dd" + response);
        console.log("네이버 로그인 토큰 갱신", response.data);
        axios.defaults.headers.common["Authorization"] =
          response.data.accessToken;
        window.localStorage.setItem(
          "naverAccessToken",
          response.data.access_token
        );
      } catch (error) {
        console.log("네이버 로그인 리프레시 실패", error);
        clearLoginState();
      }
    }
  };

  return (
    <div className="wrap">
      <Header />c
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-account" element={<FindeAccount />} />
          <Route path="/naver/callback" element={<NaverLoginCallback />} />
          <Route path="/member/*" element={<MemberMain />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
