import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NaverLoginButton from "./NaverLoginButton";
import "./signup.css";

const Signup = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    memberId: "",
    memberPw: "",
    memberPwConfirm: "",
    memberName: "",
    memberPhone: "",
    memberAddr: "",
    businessNumber: "",
    memberEmail: "",
  });

  const [errors, setErrors] = useState({
    memberId: "",
    memberPw: "",
    memberPwConfirm: "",
    memberPhone: "",
    memberEmail: "",
    businessNumber: "",
  });

  const [checks, setChecks] = useState({
    idCheck: 0,
    emailCheck: 0,
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "memberPhone") {
      const cleaned = value.replace(/[^0-9]/g, ""); // 숫자만 추출
      if (cleaned.length > 0) formatted = cleaned.substring(0, 3); // 010
      if (cleaned.length > 3) formatted += "-" + cleaned.substring(3, 7); // 0000
      if (cleaned.length > 7) formatted += "-" + cleaned.substring(7, 11); // 0000
    } else if (name === "businessNumber") {
      const cleaned = value.replace(/[^0-9]/g, ""); // 숫자만 추출
      if (cleaned.length > 0) formatted = cleaned.substring(0, 3); // 123
      if (cleaned.length > 3) formatted += "-" + cleaned.substring(3, 5); // 45
      if (cleaned.length > 5) formatted += "-" + cleaned.substring(5, 10); // 67890
    } else {
      formatted = value;
    }

    setFormData((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 아이디 중복 체크
  const checkId = async () => {
    const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    if (!regex.test(formData.memberId)) {
      setChecks((prev) => ({ ...prev, idCheck: 2 }));
      return;
    }

    try {
      const { data } = await axios.get(
        `${backServer}/member/memberId/${formData.memberId}/check-id`
      );
      setChecks((prev) => ({ ...prev, idCheck: data === 1 ? 3 : 1 }));
    } catch (err) {
      console.error("ID 중복 체크 실패:", err);
      setErrors((prev) => ({
        ...prev,
        memberId: "중복 체크 중 오류가 발생했습니다.",
      }));
    }
  };

  // 비밀번호 유효성 검사
  const handlePwBlur = () => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=[\]{}:;"'<>,.?/])[A-Za-z\d!@#$%^&*()-_+=[\]{}:;"'<>,.?/]{8,}$/;
    if (!regex.test(formData.memberPw)) {
      setErrors((prev) => ({
        ...prev,
        memberPw:
          "비밀번호는 8~20자이며, 영문자, 숫자, 특수문자를 포함해야 합니다.",
      }));
      setFormData((prev) => ({ ...prev, memberPw: "" }));
    }
  };

  // 비밀번호 확인
  const handlePwConfirmChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, memberPwConfirm: value }));
    setErrors((prev) => ({
      ...prev,
      memberPwConfirm:
        value !== formData.memberPw ? "비밀번호가 일치하지 않습니다." : "",
    }));
  };

  // 전화번호 유효성 검사
  const handlePhoneBlur = () => {
    if (!/^010-\d{4}-\d{4}$/.test(formData.memberPhone)) {
      setErrors((prev) => ({
        ...prev,
        memberPhone: "전화번호는 010-0000-0000 형식으로 입력해주세요.",
      }));
      setFormData((prev) => ({ ...prev, memberPhone: "" }));
    }
  };

  // 이메일 중복 체크
  const checkEmail = async () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(formData.memberEmail)) {
      setChecks((prev) => ({ ...prev, emailCheck: 2 }));
      setFormData((prev) => ({ ...prev, memberEmail: "" }));
      return;
    }

    try {
      const { data } = await axios.get(
        `${backServer}/member/memberEmail/${formData.memberEmail}/check-email`
      );
      setChecks((prev) => ({ ...prev, emailCheck: data === 1 ? 3 : 1 }));
    } catch (err) {
      console.error("Email 중복 체크 실패:", err);
      setErrors((prev) => ({
        ...prev,
        memberEmail: "중복 체크 중 오류가 발생했습니다.",
      }));
    }
  };

  // 주소 찾기
  const findAddress = () => {
    window.daum.postcode.load(() => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setFormData((prev) => ({
            ...prev,
            memberAddr: data.roadAddress || data.jibunAddress,
          }));
        },
      }).open();
    });
  };

  // 사업자 번호 유효성 검사
  const handleBusinessNumberBlur = () => {
    if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.businessNumber)) {
      setErrors((prev) => ({
        ...prev,
        businessNumber: "사업자 번호는 123-45-67890 형식으로 입력해주세요.",
      }));
      setFormData((prev) => ({ ...prev, businessNumber: "" }));
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.memberId ||
      !formData.memberPw ||
      !formData.memberName ||
      !formData.memberPhone ||
      !formData.memberEmail ||
      !formData.businessNumber
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (checks.idCheck !== 1 || checks.emailCheck !== 1) {
      alert("아이디와 이메일 중복 체크를 완료해주세요.");
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      alert("입력값에 오류가 있습니다. 확인 후 다시 시도해주세요.");
      return;
    }

    try {
      const res = await axios.post(`${backServer}/member/signup`, formData);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="signup_wrap">
      <div className="social-login">
        <h2>간편가입</h2>
        <div className="social-login-wrap">
          <NaverLoginButton />
        </div>
      </div>
      <hr />
      <h2>Join</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="member_id">아이디</label>
          <input
            type="text"
            id="member_id"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            onBlur={checkId}
            required
          />
          <small
            className={`input-msg ${
              checks.idCheck === 1
                ? "valid"
                : checks.idCheck > 0
                ? "invalid"
                : ""
            }`}
          >
            {checks.idCheck === 0
              ? ""
              : checks.idCheck === 1
              ? "사용 가능한 아이디입니다."
              : checks.idCheck === 2
              ? "영문자와 숫자 조합, 6~20자여야 합니다."
              : "이미 사용 중인 아이디입니다."}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="member_pw">비밀번호</label>
          <input
            type="password"
            id="member_pw"
            name="memberPw"
            value={formData.memberPw}
            onChange={handleChange}
            onBlur={handlePwBlur}
            placeholder="숫자+영문자+특수문자, 8자 이상"
            required
          />
          {errors.memberPw && (
            <small className="invalid">{errors.memberPw}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="member_pw_confirm">비밀번호 확인</label>
          <input
            type="password"
            id="member_pw_confirm"
            name="memberPwConfirm"
            value={formData.memberPwConfirm}
            onChange={handlePwConfirmChange}
            required
          />
          {errors.memberPwConfirm && (
            <small className="invalid">{errors.memberPwConfirm}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="member_name">이름</label>
          <input
            type="text"
            id="member_name"
            name="memberName"
            value={formData.memberName}
            onChange={handleChange}
            maxLength={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="member_phone">전화번호</label>
          <input
            type="text"
            id="member_phone"
            name="memberPhone"
            value={formData.memberPhone}
            onChange={handleChange}
            onBlur={handlePhoneBlur}
            placeholder="010-0000-0000"
            maxLength={13}
            required
          />
          {errors.memberPhone && (
            <small className="invalid">{errors.memberPhone}</small>
          )}
        </div>

        <div className="form-group">
          <div className="addr-wrap">
            <label htmlFor="member_addr">사업장 주소</label>
            <button type="button" className="btn-small" onClick={findAddress}>
              주소 찾기
            </button>
          </div>
          <input
            type="text"
            id="member_addr"
            name="memberAddr"
            value={formData.memberAddr}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="business_number">사업자 번호</label>
          <input
            type="text"
            id="business_number"
            name="businessNumber"
            value={formData.businessNumber}
            onChange={handleChange}
            onBlur={handleBusinessNumberBlur}
            placeholder="123-45-67890"
            maxLength={12}
            required
          />
          {errors.businessNumber && (
            <small className="invalid">{errors.businessNumber}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="member_email">이메일</label>
          <input
            type="email"
            id="member_email"
            name="memberEmail"
            value={formData.memberEmail}
            onChange={handleChange}
            onBlur={checkEmail}
            required
          />
          <small
            className={`input-msg ${
              checks.emailCheck === 1
                ? "valid"
                : checks.emailCheck > 0
                ? "invalid"
                : ""
            }`}
          >
            {checks.emailCheck === 0
              ? ""
              : checks.emailCheck === 1
              ? "사용 가능한 이메일입니다."
              : checks.emailCheck === 2
              ? "유효한 이메일 형식이 아닙니다."
              : "이미 사용 중인 이메일입니다."}
          </small>
        </div>

        <button type="submit" className="btn">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
