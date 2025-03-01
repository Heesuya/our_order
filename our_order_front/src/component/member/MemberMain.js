import { useEffect, useState } from "react";
import MemberInfo from "./MemberInfo";
import { Route, Routes } from "react-router-dom";
import Callbak from "./Callbak";

const MemberMain = () => {
  return (
    <div className="mypage-wrap">
      <div className="mypage-side">
        <section className="section account-box">
          <div className="account-info">
            <span class="material-icons">person</span>

            <span>MYPAGE</span>
          </div>
        </section>
        <section className="section"></section>
      </div>
      <div className="mypage-content">
        <section className="section">
          <Routes>
            <Route path="info" element={<MemberInfo />} />
            <Route path="callback" element={<Callbak />} />
          </Routes>
        </section>
      </div>
    </div>
  );
};
export default MemberMain;
