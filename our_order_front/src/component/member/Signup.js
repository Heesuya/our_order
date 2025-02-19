import React, { useState } from "react";
import "./signup.css";

function Signup() {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwConfirm, setMemberPwConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberAddr, setMemberAddr] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const handleIdChange = (e) => setMemberId(e.target.value);
  const handlePwChange = (e) => setMemberPw(e.target.value);
  const handlePwConfirmChange = (e) => {
    setMemberPwConfirm(e.target.value);
    if (e.target.value !== memberPw) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };
  const handleNameChange = (e) => setMemberName(e.target.value);
  const handlePhoneChange = (e) => setMemberPhone(e.target.value);
  const handleAddrChange = (e) => setMemberAddr(e.target.value);
  const handleBusinessNumberChange = (e) => setBusinessNumber(e.target.value);
  const handleEmailChange = (e) => setMemberEmail(e.target.value);

  // 아이디 중복 확인
  const checkId = () => {
    alert("아이디 중복 확인: " + memberId);
    // 실제 아이디 중복 확인 API 호출 로직을 여기에 추가
  };

  // 이메일 중복 확인
  const checkEmail = () => {
    alert("이메일 중복 확인: " + memberEmail);
    // 실제 이메일 중복 확인 API 호출 로직을 여기에 추가
  };

  // 주소 찾기
  const findAddress = () => {
    alert("주소 찾기 기능 구현 예정");
    // 주소 찾기 기능 구현을 여기에 추가
  };

  // 카카오 로그인
  const kakaoLogin = () => {
    window.location.href =
      "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code";
  };

  // 네이버 로그인
  const naverLogin = () => {
    window.location.href =
      "https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 API 호출 로직을 여기에 추가
    alert("회원가입이 완료되었습니다.");
  };

  return (
    <div className="signup_wrap">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="member_id">아이디</label>
          <input
            type="text"
            id="member_id"
            name="member_id"
            value={memberId}
            onChange={handleIdChange}
            required
          />
          <button type="button" className="btn-small" onClick={checkId}>
            아이디 중복 확인
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="member_pw">비밀번호</label>
          <input
            type="password"
            id="member_pw"
            name="member_pw"
            value={memberPw}
            onChange={handlePwChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="member_pw_confirm">비밀번호 확인</label>
          <input
            type="password"
            id="member_pw_confirm"
            name="member_pw_confirm"
            value={memberPwConfirm}
            onChange={handlePwConfirmChange}
            required
          />
          {passwordError && (
            <small style={{ color: "red" }}>{passwordError}</small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="member_name">이름</label>
          <input
            type="text"
            id="member_name"
            name="member_name"
            value={memberName}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="member_phone">전화번호</label>
          <input
            type="text"
            id="member_phone"
            name="member_phone"
            value={memberPhone}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="member_addr">주소</label>
          <input
            type="text"
            id="member_addr"
            name="member_addr"
            value={memberAddr}
            onChange={handleAddrChange}
            required
          />
          <button type="button" className="btn-small" onClick={findAddress}>
            주소 찾기
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="business_number">사업자 번호</label>
          <input
            type="text"
            id="business_number"
            name="business_number"
            value={businessNumber}
            onChange={handleBusinessNumberChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="member_email">이메일</label>
          <input
            type="email"
            id="member_email"
            name="member_email"
            value={memberEmail}
            onChange={handleEmailChange}
            required
          />
          <button type="button" className="btn-small" onClick={checkEmail}>
            이메일 중복 확인
          </button>
        </div>
        <button type="submit" className="btn">
          회원가입
        </button>
      </form>

      <div className="social-login">
        <button className="social-btn kakao" onClick={kakaoLogin}>
          카카오 로그인
        </button>
        <button className="social-btn naver" onClick={naverLogin}>
          네이버 로그인
        </button>
      </div>
    </div>
  );
}

export default Signup;
