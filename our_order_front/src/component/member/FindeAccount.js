import React, { useState, useEffect } from "react";
import axios from "axios";
import "./findeAccount.css";
import { Navigate, useNavigate } from "react-router-dom";

const FindAccount = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(true);
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({
    memberId: "",
    memberPhone: "",
    memberEmail: "",
    memberName: "",
  });
  const [error, setError] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증번호
  const [serverVerificationCode, setServerVerificationCode] = useState(""); // 서버에서 받은 인증번호
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 폼 입력값 변경 처리 (기존 코드 유지)
  const formChange = (e) => {
    const { name, value } = e.target;
    if (name === "memberPhone") {
      const cleaned = value.replace(/[^0-9]/g, "");
      let formatted = "";
      if (cleaned.length > 0) formatted = cleaned.substring(0, 3);
      if (cleaned.length > 3) formatted += "-" + cleaned.substring(3, 7);
      if (cleaned.length > 7) formatted += "-" + cleaned.substring(7, 11);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  // 타이머 로직 (기존 코드 유지)
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setError("인증 시간이 초과되었습니다.");
            setIsVerificationSent(false);
            setVerificationCode("");
            setServerVerificationCode("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // 탭 전환 (기존 코드 유지)
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
    setIsVerified(false);
    setVerificationCode("");
    setServerVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 아이디 찾기 (기존 코드 유지)
  const findId = async () => {
    // ... (기존 코드)
  };

  // 이메일 인증번호 발송
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
      const response = await axios.post(`${backServer}/member/find-pw`, {
        memberId: formData.memberId,
        memberPhone: formData.memberPhone,
        memberEmail: formData.memberEmail,
      });
      setIsVerificationSent(true);
      setTimer(180);
      setServerVerificationCode(response.data.verificationCode); // 서버에서 받은 인증번호 저장
      alert("인증번호가 이메일로 발송되었습니다.");
    } catch (err) {
      setError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  // 인증번호 확인 (프론트에서 검증)
  const verifyCode = () => {
    if (verificationCode === serverVerificationCode) {
      setIsVerified(true);
      setError("");
      alert("인증이 완료되었습니다.");
    } else {
      alert("인증번호가 틀렸습니다. 다시 확인해주세요.");
      setVerificationCode("");
    }
  };

  // 비밀번호 변경
  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("비밀번호를 모두 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await axios.post(`${backServer}/member/update-pw`, {
        memberId: formData.memberId,
        memberEmail: formData.memberEmail,
        memberPw: newPassword,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/");
    } catch (err) {
      setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  // 타이머 포맷팅 (기존 코드 유지)
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

      {activeTab ? (
        <div className="find-form">
          {/* 아이디 찾기 폼 (기존 코드 유지) */}
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
            disabled={isVerificationSent || isVerified}
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
            disabled={isVerificationSent || isVerified}
          />
          <label htmlFor="memberEmail">가입한 이메일</label>
          <input
            type="email"
            id="memberEmail"
            name="memberEmail"
            value={formData.memberEmail}
            onChange={formChange}
            required
            disabled={isVerificationSent || isVerified}
          />

          {!isVerificationSent && !isVerified && (
            <button className="submit-btn" onClick={sendVerificationCode}>
              이메일 인증하기
            </button>
          )}

          {isVerificationSent && !isVerified && timer > 0 && (
            <div>
              <label htmlFor="verificationCode">인증번호 입력</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <div id="verification-time">
                <span id="time-left">남은 시간: {formatTime(timer)}</span>
              </div>
              <button className="submit-btn" onClick={verifyCode}>
                인증하기
              </button>
            </div>
          )}

          {timer === 0 && isVerificationSent && !isVerified && (
            <button className="submit-btn" onClick={sendVerificationCode}>
              재인증하기
            </button>
          )}

          {isVerified && (
            <div>
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button className="submit-btn" onClick={changePassword}>
                비밀번호 변경
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAccount;
