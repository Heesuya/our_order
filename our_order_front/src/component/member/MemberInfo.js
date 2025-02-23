import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const MemberInfo = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id"); // URL에서 id를 추출

  useEffect(() => {
    if (userId) {
      // 유저 정보를 API에서 가져오는 로직 추가 (예: userId로 API 호출)
      console.log(`Received userId: ${userId}`);
    }
  }, [userId]);

  return (
    <div>
      <h1>회원 정보</h1>
      <p>유저 ID: {userId}</p>
    </div>
  );
};

export default MemberInfo;
