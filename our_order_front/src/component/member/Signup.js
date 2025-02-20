import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
const Signup = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwConfirm, setMemberPwConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberAddr, setMemberAddr] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const handleIdChange = (e) => {
    setMemberId(e.target.value);
  };

  //아이디 중복체크 결과에 따라서 바뀔 state
  //0 : 검사하지 않은 상태, 1 : 정규표현식,중복체크 모두 통과한 경우
  //2 : 정규표현식을 만족하지 못한 상태, 3 : 아이디가 중복인 경우
  const [idCheck, setIdCheck] = useState(0);
  const checkId = () => {
    // 아이디 유효성 검사: 영문자 반드시 포함 + 숫자 조합, 6~20자
    //1. 정규표현식 검사
    //2. 정규표현식 검사 성공하면, DB에 중복체크
    const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    if (!regex.test(memberId)) {
      setIdCheck(2);
    } else {
      axios
        .get(`${backServer}/member/memberId/${memberId}/check-id`) //회원 정보 get 하는게 아니라 확인 이기에, 주소 한개 더 다르게 처리
        .then((res) => {
          console.log(res);
          if (res.data === 1) {
            setIdCheck(3);
          } else if (res.data === 0) {
            setIdCheck(1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePwChange = (e) => {
    setMemberPw(e.target.value); // memberPw 상태만 업데이트
  };

  const handlePwBlur = () => {
    const pw = memberPw;

    const regex = new RegExp(
      "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()-_+=}{\\[\\]:;\"'<>,.?/])[A-Za-z\\d!@#$%^&*()-_+=}{\\[\\]:;\"'<>,.?/]{8,}$"
    );
    // 유효성 검사
    if (regex.test(pw)) {
      // 비밀번호가 유효한 경우 처리
    } else {
      alert(
        "비밀번호는 8~20자이며, 대문자, 소문자, 숫자, 특수문자 중 최소 1개 이상 포함해야 합니다."
      );
      setMemberPw("");
    }
  };

  const handlePwConfirmChange = (e) => {
    setMemberPwConfirm(e.target.value);
    if (e.target.value !== memberPw) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };
  const handleNameChange = (e) => setMemberName(e.target.value);
  // 전화번호 입력 시 변경되는 값
  const handlePhoneChange = (e) => {
    setMemberPhone(e.target.value); // 핸드폰 번호 상태 업데이트
  };
  const [phoneError, setPhoneError] = useState(""); // 전화번호 유효성 검사 오류 메시지 상태
  // 전화번호 입력 후 블러 시 유효성 검사
  const handlePhoneBlur = () => {
    const regex = /^\d{3}-\d{4}-\d{4}$/; // 010-1234-5678 형식의 정규 표현식

    // 전화번호가 유효한 형식인지 확인
    if (!regex.test(memberPhone)) {
      setPhoneError("전화번호는 010-1234-5678 형식으로 입력해주세요.");
      setMemberPhone(""); // 잘못된 경우에는 입력 초기화 할 수도 있음
    } else {
      setPhoneError(""); // 유효한 경우 오류 메시지 초기화
    }
  };

  const [emailCheck, setEmailCheck] = useState(0);
  const handleEmailChange = (e) => setMemberEmail(e.target.value);

  const checkEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(memberEmail)) {
      setEmailCheck(2);
      setMemberEmail("");
    } else {
      axios
        .get(`${backServer}/member/memberEmail/${memberEmail}/check-email`) //회원 정보 get 하는게 아니라 확인 이기에, 주소 한개 더 다르게 처리
        .then((res) => {
          console.log(res);
          if (res.data === 1) {
            setEmailCheck(3);
          } else if (res.data === 0) {
            setEmailCheck(1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 주소 찾기
  const findAddress = () => {
    window.daum.postcode.load(function () {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setMemberAddr(data.roadAddress || data.jibunAddress);
        },
      }).open();
    });
  };

  const handleBusinessNumberChange = (e) => setBusinessNumber(e.target.value);

  const handleBusinessNumberBlur = () => {
    const regex = /^\d{3}-\d{2}-\d{5}$/; // 123-45-6789 형식의 정규 표현식

    // 사업자 번호가 유효한 형식인지 확인
    if (!regex.test(businessNumber)) {
      alert("사업자 번호는 123-45-6789 형식으로 입력해주세요.");
      setBusinessNumber(""); // 입력을 초기화할 수도 있습니다.
    } else {
      // 사업자 번호가 유효한 경우 추가 처리 (예: 중복 체크, 서버에 전송 등)
      console.log("사업자 번호가 유효합니다.");
    }
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

    // 입력 데이터를 객체로 묶기
    const formData = {
      memberId,
      memberPw,
      memberName,
      memberPhone,
      memberAddr,
      businessNumber,
      memberEmail,
    };
    console.log(1);
    // 회원가입 API 호출 (POST 요청)
    axios
      .post(`${backServer}/member/signup`, formData) // 회원가입 API 엔드포인트에 POST 요청
      .then((res) => {
        console.log("회원가입 성공:", res.data);
        alert("회원가입이 완료되었습니다.");
        // 예: 로그인 페이지로 이동
        // history.push("/login");
      })
      .catch((err) => {
        console.error("회원가입 실패:", err);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      });
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
            onBlur={checkId}
            required
          />
          <small
            className={
              "input-msg" +
              (idCheck === 0
                ? ""
                : idCheck === 1
                ? " valid"
                : idCheck === 2
                ? " invalid"
                : " invalid")
            }
          >
            {idCheck === 0
              ? ""
              : idCheck === 1
              ? "사용가능한 아이디 입니다."
              : idCheck === 2
              ? "아이디는 영어 대/소문자 숫자로 4~8글자 입니다."
              : "이미 사용중인 아이디입니다."}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="member_pw">비밀번호</label>
          <input
            type="password"
            id="member_pw"
            name="member_pw"
            value={memberPw}
            onChange={handlePwChange}
            onBlur={handlePwBlur}
            placeholder="비밀번호 (숫자+영문자+특수문자 조합으로 8자리 이상)"
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
            maxLength={5}
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
            onBlur={handlePhoneBlur} // 블러 시 유효성 검사
            placeholder="010-1234-5678"
            required
          />
          {phoneError && (
            <small
              className={
                "input-msg" + (phoneError ? " invalid" : "") // 전화번호 오류에 대해 invalid 클래스를 적용
              }
            >
              {phoneError}
            </small>
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
            name="member_addr"
            value={memberAddr}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="business_number">사업자 번호</label>
          <input
            type="text"
            id="business_number"
            name="business_number"
            value={businessNumber}
            onChange={handleBusinessNumberChange}
            onBlur={handleBusinessNumberBlur}
            placeholder="123-45-67890 로 입력해주세요"
            maxLength={12}
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
            onBlur={checkEmail}
            required
          />
          <small
            className={
              "input-msg" +
              (emailCheck === 0 ? "" : emailCheck === 1 ? " valid" : " invalid")
            }
          >
            {emailCheck === 0
              ? ""
              : emailCheck === 1
              ? "사용가능한 이메일 입니다."
              : emailCheck === 2
              ? "이메일 형식에 맞춰 다시 입력해주세요."
              : "이미 사용중인 이메일입니다."}
          </small>
        </div>
        <button type="submit" className="btn">
          회원가입
        </button>
      </form>

      <div className="social-login">
        <button className="social-btn kakao" onClick={kakaoLogin}>
          카카오로 가입하기
        </button>
        <button className="social-btn naver" onClick={naverLogin}>
          네이버로 가입하기
        </button>
      </div>
    </div>
  );
};

export default Signup;
