import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMemberName,
  setMemberNo,
  setMemberType,
} from "../../redux/UserSlice";

const MemberInfo = () => {
  const memberNo = useSelector((state) => state.user.memberNo);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member, setMember] = useState(null);
  const loginType = localStorage.getItem("loginType");
  const dispatch = useDispatch();
  useEffect(() => {
    const endpoint =
      loginType === "home"
        ? `${backServer}/member`
        : loginType === "naver"
        ? `${backServer}/auth`
        : null;
    if (!endpoint) return; // loginType이 없거나 올바르지 않으면 요청하지 않음

    axios
      .get(endpoint)
      .then((res) => {
        console.log(res);
        dispatch(setMemberNo(res.data.memberNo));
        dispatch(setMemberType(res.data.memberNo));
        dispatch(setMemberName(res.data.memberName));
        dispatch(setMemberType(res.data.memberLevel));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loginType, backServer]);

  return (
    <div>
      <h1>회원 정보</h1>
      <p>유저 ID:</p>
    </div>
  );
};

export default MemberInfo;
