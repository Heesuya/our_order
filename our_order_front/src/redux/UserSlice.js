import { createSlice } from "@reduxjs/toolkit";

// createSlice는 슬라이스를 쉽게 정의하고, 리듀서와 액션을 자동으로 생성해줌
// 객체를 인자로 받음
export const userSlice = createSlice({
  name: "user", // 슬라이스 이름 설정 => 나중에 관리하는 상태가 무엇인지 알 수 있음
  initialState: {
    // 상태의 초기값 설정
    user: null, // user라는 프로퍼티를 null로 초기화하여, 로그인 전에는 null 값을 가지고 있다고 정의
  },
  reducers: {
    // 상태를 업데이트할 액션을 정의
    login: (state, action) => {
      state.user = action.payload; // 로그인 시 user 값 업데이트
    },
    logout: (state) => {
      state.user = null; // 로그아웃 시 user 초기화
    },
  },
});

// 액션과 리듀서 추출
export const { login, logout } = userSlice.actions;
// 상태 선택 함수
export const selectUser = (state) => state.user.user; // 'user'로 상태를 선택
// 리듀서 내보내기
export default userSlice.reducer;
