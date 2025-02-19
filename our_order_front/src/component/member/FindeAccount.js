import React, { useState } from "react";

const FindeAccount = () => {
  const [formData, setFormData] = useState({
    member_id: "",
    member_pw: "",
    member_name: "",
    member_phone: "",
    member_addr: "",
    business_number: "",
    member_email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 데이터:", formData);
    // 여기에 회원가입 API 호출 로직 추가 (백엔드 연동 필요)
  };

  const kakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
  };

  const naverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
  };

  return (
    <div className="container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="member_id"
            value={formData.member_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="member_pw"
            value={formData.member_pw}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="member_name"
            value={formData.member_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>전화번호</label>
          <input
            type="text"
            name="member_phone"
            value={formData.member_phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
            required
          />
        </div>
        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            name="member_addr"
            value={formData.member_addr}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>사업자 번호</label>
          <input
            type="text"
            name="business_number"
            value={formData.business_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="member_email"
            value={formData.member_email}
            onChange={handleChange}
            required
          />
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
};

export default FindeAccount;
