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
import { setLoginId, setMemberType } from "./redux/UserSlice"; // 수정된 부분

function App() {
  const dispatch = useDispatch();
  const loginId = useSelector((state) => state.user.loginId);
  const memberType = useSelector((state) => state.user.memberType);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  console.log("loginddId" + loginId);
  useEffect(() => {
    refreshLogin();
    window.setInterval(refreshLogin, 60 * 60 * 1000); // 한 시간마다 자동으로 로그인 정보 refresh
  }, []);

  const refreshLogin = () => {
    const refreshToken = window.localStorage.getItem("refreshToken");

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
          dispatch(setMemberType(0)); // memberType 초기화
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    }
  };

  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-account" element={<FindeAccount />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
