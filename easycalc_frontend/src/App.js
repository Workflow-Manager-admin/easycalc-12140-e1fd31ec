import React from "react";
import "./App.css";
import EasyCalc from "./EasyCalc";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <span className="subtitle" style={{ alignSelf: "center" }}>
              EasyCalc
            </span>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: 110 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 className="title" style={{ margin: 0, fontSize: "2rem", color: "#222" }}>
            Basic Calculator
          </h1>
          <div className="description" style={{ marginBottom: 18, maxWidth: 340, color: "#444", textAlign: "center", fontSize: "1.08rem" }}>
            Try out this simple calculator powered by React. Perform basic arithmetic and see results instantly.
          </div>
          <EasyCalc />
        </div>
      </main>
    </div>
  );
}

export default App;