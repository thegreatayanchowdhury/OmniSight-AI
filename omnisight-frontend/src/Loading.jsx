import React, { useEffect, useRef, useState } from "react";

const Loading = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const finishedRef = useRef(false);

  const finishLoading = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    setFadeOut(true);

    setTimeout(() => {
      onFinish();
    }, 600);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    const timer = setTimeout(() => {
      finishLoading();
    }, 4500);

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        src={isMobile ? "/Intro_mobile.mp4" : "/Intro.mp4"}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finishLoading}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center center" }}
      />
    </div>
  );
};

export default Loading;