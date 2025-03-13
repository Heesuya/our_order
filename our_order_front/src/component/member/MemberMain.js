import { useEffect, useState } from "react";
import MemberInfo from "./MemberInfo";
import { NavLink, Route, Routes } from "react-router-dom";
import Callbak from "./Callbak";
import "./member.css";

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
        <section className="section">
          <div className="side-menu">
            <ul>
              <li>
                <NavLink to="/member/info">
                  <span>개인정보 관리</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/member/menu">
                  <span>메뉴 관리</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </section>
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
