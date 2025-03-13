import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMemberName,
  setMemberNo,
  setMemberType,
} from "../../redux/UserSlice";

const MemberInfo = () => {
  const { memberNo, memberName, memberType } = useSelector(
    (state) => state.user
  ); // Redux에서 필요한 데이터 가져오기
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member, setMember] = useState(null);
  const loginType = localStorage.getItem("loginType");
  const dispatch = useDispatch();

  // 사업자 번호 상태 추가 (입력 가능하도록)
  const [businessNumber, setBusinessNumber] = useState("");

  useEffect(() => {
    const endpoint =
      loginType === "home"
        ? `${backServer}/member`
        : loginType === "naver"
        ? `${backServer}/auth`
        : null;
    if (!endpoint) return;

    axios
      .get(endpoint)
      .then((res) => {
        console.log("Response:", res.data);
        const data = res.data;
        dispatch(setMemberNo(data.memberNo));
        dispatch(setMemberName(data.memberName));
        dispatch(setMemberType(data.memberLevel));
        setMember(data);
        setBusinessNumber(data.businessNumber || ""); // 사업자 번호 초기화
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, [backServer, dispatch, loginType]);

  // 데이터가 로딩 중일 때 표시
  if (!member) {
    return <div>회원 정보를 불러오는 중...</div>;
  }

  // 사업자 번호 변경 핸들러
  const handleBusinessNumberChange = (e) => {
    setBusinessNumber(e.target.value);
  };

  // 비밀번호 변경 버튼 핸들러 (예시)
  const handlePasswordChange = () => {
    alert("비밀번호 변경 기능은 구현 중입니다!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>회원 정보</h1>

      {loginType === "naver" ? (
        // 네이버 로그인일 경우
        <div className="member-inof">
          <p>
            <strong>네이버 로그인 회원입니다.</strong>
          </p>
          <p>
            <strong>이름:</strong> {memberName || "이름 없음"}
          </p>
          <p>
            <strong>이메일:</strong> {member.memberEmail || "이메일 없음"}
          </p>
          <p>
            <strong>사업자 번호:</strong>
            <input
              type="text"
              value={businessNumber}
              onChange={handleBusinessNumberChange}
              placeholder="사업자 번호 입력"
              style={{ marginLeft: "10px" }}
            />
          </p>
        </div>
      ) : (
        // 일반 로그인일 경우
        <>
          <p>
            <strong>아이디:</strong> {member.memberId || "ID 없음"}
          </p>
          <p>
            <strong>이름:</strong> {memberName || "이름 없음"}
          </p>
          <p>
            <strong>비밀번호:</strong>
            <button
              onClick={handlePasswordChange}
              style={{ marginLeft: "10px" }}
            >
              비밀번호 변경
            </button>
          </p>
          <p>
            <strong>주소:</strong> {member.memberAddr || "주소 없음"}
          </p>
          <p>
            <strong>사업자 번호:</strong> {member.businessNumber || "번호 없음"}
          </p>
        </>
      )}
    </div>
  );
};

export default MemberInfo;
