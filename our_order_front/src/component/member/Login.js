import React, { useState } from "react";
import "./login.css";
import { setLoginId, setMemberType } from "../../redux/UserSlice"; // 수정된 부분
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios를 사용하여 서버와 통신

const Login = () => {
  const navigate = useNavigate();
  const naver_id = process.env.CLIENT_ID_NAVER;
  const kakao_id = process.env.CLIENT_ID_KAKAO;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const handleNaverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=http://localhost:8080/login/oauth2/code/naver`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao_id}&redirect_uri=http://localhost:8080/login/oauth2/code/kakao`;
  };

  const [member, setMember] = useState({ memberId: "", memberPw: "" });

  //redux에서 dispatch는 action을 reducer로 전달
  const dispatch = useDispatch();

  const login = () => {
    axios //password 노출을 막기 위해 post 사용
      .post(`${backServer}/member/login`, member)
      .then((res) => {
        console.log(res);
        //리덕스를 이용해서 로그인 상태 저장
        dispatch(setLoginId(res.data.memberId));
        dispatch(setMemberType(res.data.memberType));
        //로그인 이후 axios요청 시 발급받은 토큰값을 자동으로 axios에 추가하는 설정
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;
        //로그인 상태를 지속적으로 유지시키기위해 발급받은 refreshToken을 브라우저에 저장
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
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
