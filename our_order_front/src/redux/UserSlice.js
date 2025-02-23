import { createSlice } from "@reduxjs/toolkit";

// createSlice는 슬라이스를 쉽게 정의하고, 리듀서와 액션을 자동으로 생성해줌
// 객체를 인자로 받음
export const userSlice = createSlice({
  name: "user", // 슬라이스 이름 설정 => 나중에 관리하는 상태가 무엇인지 알 수 있음
  initialState: {
    // 상태의 초기값 설정
    loginId: null,
    memberType: 0, // 0 : 로그아웃 상태 / 1 : 관리자 /  2 : 회원
    memberNo: 0,
    memberName: null,
  },
  reducers: {
    // 상태를 업데이트할 액션을 정의
    setLoginId: (state, action) => {
      state.loginId = action.payload;
    },
    setMemberType: (state, action) => {
      state.memberType = action.payload;
    },
    setMemberNo: (state, action) => {
      state.memberNo = action.payload;
    },
    setMemberName: (state, action) => {
      state.memberName = action.payload;
    },
    logout: (state) => {
      state.loginId = null; // 로그아웃 시 loginId 초기화
      state.memberType = 0; // 로그아웃 시 memberType 초기화
      state.memberNo = 0;
      state.memberName = null;
    },
  },
});

// 액션과 리듀서 추출
export const { setLoginId, setMemberType, setMemberNo, setMemberName, logout } =
  userSlice.actions;

// 상태 선택 함수
export const selectUser = (state) => state.user; // 'user'로 상태를 선택

// 리듀서 내보내기
export default userSlice.reducer;
