import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./component/common/Main";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";
import Signup from "./component/member/Signup";
import FindeAccount from "./component/member/FindeAccount";
import Login from "./component/member/Login";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-account" element={<FindeAccount />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
