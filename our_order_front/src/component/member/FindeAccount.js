import React, { useState, useEffect } from "react";
import axios from "axios";
import "./findeAccount.css";
import { Provider } from "react-redux";

const FindAccount = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [activeTab, setActiveTab] = useState(true); // true: 아이디 찾기, false: 비밀번호 찾기
  const [timer, setTimer] = useState(0); // 초기 타이머 0
  const [formData, setFormData] = useState({
    memberId: "",
    memberPhone: "",
    memberEmail: "",
    memberName: "",
  });
  const [error, setError] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 인증번호 발송 여부

  // 폼 입력값 변경 처리
  const formChange = (e) => {
    const { name, value } = e.target;

    // 핸드폰 번호 입력 시 형식 제한 (010-0000-0000)
    if (name === "memberPhone") {
      const cleaned = value.replace(/[^0-9]/g, ""); // 숫자만 남김
      let formatted = "";
      if (cleaned.length > 0) formatted = cleaned.substring(0, 3); // 010
      if (cleaned.length > 3) formatted += "-" + cleaned.substring(3, 7); // 0000
      if (cleaned.length > 7) formatted += "-" + cleaned.substring(7, 11); // 0000
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  // 타이머 로직
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setError("시간 초과! 다시 시도해주세요.");
            setIsVerificationSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // 탭 전환
  const toggleTab = (type) => {
    setActiveTab(type);
    setFormData({
      memberId: "",
      memberPhone: "",
      memberEmail: "",
      memberName: "",
    });
    setError("");
    setTimer(0);
    setIsVerificationSent(false);
  };

  // 아이디 찾기 API 호출
  const findId = async () => {
    if (!formData.memberName || !formData.memberPhone) {
      setError("이름과 핸드폰 번호를 모두 입력해주세요.");
      return;
    }
    if (!/^010-\d{4}-\d{4}$/.test(formData.memberPhone)) {
      setError("핸드폰 번호는 010-0000-0000 형식이어야 합니다.");
      return;
    }
    try {
      const response = await axios.post(`${backServer}/member/find-id`, {
        memberName: formData.memberName,
        memberPhone: formData.memberPhone,
      });
      console.log(response);
      if (response.data.provider === "naver") {
        alert("네이버 간편 로그인을 이용해주세요.");
      } else {
        alert(`당신의 아이디는 ${response.data.memberId}입니다.`);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("가입된 회원이 없습니다. 이름과 핸드폰 번호를 확인해주세요.");
      } else {
        setError("아이디 찾기에 실패했습니다. 다시 시도해주세요.");
      }
      console.error(err);
    }
  };

  // 이메일 인증번호 발송 API 호출
  const sendVerificationCode = async () => {
    if (!formData.memberId || !formData.memberPhone || !formData.memberEmail) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (!/^010-\d{4}-\d{4}$/.test(formData.memberPhone)) {
      setError("핸드폰 번호는 010-0000-0000 형식이어야 합니다.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.memberEmail)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      await axios.post(`${backServer}/member/find-pw`, {
        member_id: formData.memberId,
        member_phone: formData.memberPhone,
        member_email: formData.memberEmail,
      });
      setIsVerificationSent(true);
      setTimer(180); // 인증번호 발송 후 3분 타이머 시작
      alert("인증번호가 이메일로 발송되었습니다.");
    } catch (err) {
      setError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  // 타이머 포맷팅
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="find-container">
      <h2>아이디 / 비밀번호 찾기</h2>
      <div className="button-container">
        <button
          className={activeTab ? "active" : ""}
          onClick={() => toggleTab(true)}
        >
          아이디 찾기
        </button>
        <button
          className={!activeTab ? "active" : ""}
          onClick={() => toggleTab(false)}
        >
          비밀번호 찾기
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* 아이디 찾기 폼 */}
      {activeTab ? (
        <div className="find-form">
          <label htmlFor="memberName">이름</label>
          <input
            type="text"
            id="memberName"
            name="memberName"
            value={formData.memberName}
            onChange={formChange}
            required
          />
          <label htmlFor="memberPhone">핸드폰 번호</label>
          <input
            type="text"
            id="memberPhone"
            name="memberPhone"
            value={formData.memberPhone}
            onChange={formChange}
            placeholder="010-0000-0000"
            maxLength="13"
            required
          />
          <button className="submit-btn" onClick={findId}>
            아이디 찾기
          </button>
        </div>
      ) : (
        <div className="find-form">
          <label htmlFor="memberId">아이디</label>
          <input
            type="text"
            id="memberId"
            name="memberId"
            value={formData.memberId}
            onChange={formChange}
            required
          />
          <label htmlFor="memberPhone">핸드폰 번호</label>
          <input
            type="text"
            id="memberPhone"
            name="memberPhone"
            value={formData.memberPhone}
            onChange={formChange}
            placeholder="010-0000-0000"
            maxLength="13"
            required
          />
          <label htmlFor="memberEmail">가입한 이메일</label>
          <input
            type="email"
            id="memberEmail"
            name="memberEmail"
            value={formData.memberEmail}
            onChange={formChange}
            required
          />
          <button className="submit-btn" onClick={sendVerificationCode}>
            이메일 인증하기
          </button>
          {isVerificationSent && (
            <div id="verification-time">
              <span id="time-left">남은 시간: {formatTime(timer)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAccount;
