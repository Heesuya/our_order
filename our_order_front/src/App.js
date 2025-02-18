import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./component/common/Main";

function App() {
  return (
    <div className="wrap">
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
