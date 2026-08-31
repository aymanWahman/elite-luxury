// Ish.js
import React from "react";
import "./Ish.css";

const Ish = () => {
  return (
    <div className="Ish">
      <div className="Ish-neck"></div> {/* الرقبة */}
      <div className="Ish-head">
        <div className="Ish-face left"></div>
        <div className="Ish-face right"></div>
        <div className="Ish-chin"></div>
        <div className="Ish-eye left"></div>
        <div className="Ish-eye right"></div>
        <div className="Ish-mouth"></div>
      </div>
      <div className="Ish-body">
        <div className="Ish-arm left"></div> {/* الذراع اليسرى مرفوعة */}
        <div className="Ish-arm right"></div> {/* الذراع اليمنى مرفوعة */}
        <div className="Ish-foot left"></div>
        <div className="Ish-foot right"></div>
      </div>
    </div>
  );
};

export default Ish;
