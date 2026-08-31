
// Intro.js
import React from "react";
import "./intro.css";

const Intro = () => {
  return (
    <div className="Intro">
      <div className="Intro-neck"></div> {/* الرقبة */}
      <div className="Intro-head">
        <div className="Intro-face left"></div> 
        <div className="Intro-face right"></div> 
        <div className="Intro-chin"></div> 
        <div className="Intro-eye left"></div> 
        <div className="Intro-eye right"></div> 
        <div className="Intro-mouth"></div> 
      </div>
      <div className="Intro-body">
        <div className="Intro-arm left"></div> {/* الذراع اليسرى مرفوعة */}
        <div className="Intro-arm right"></div> {/* الذراع اليمنى مرفوعة */}
        <div className="Intro-foot left"></div>
        <div className="Intro-foot right"></div>
      </div>
    </div>
  );
};

export default Intro;
