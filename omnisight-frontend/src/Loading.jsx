import React, { useEffect, useRef, useState } from "react";
import introVideo from "./assets/intro.mp4";

const Loading = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
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
    const timer = setTimeout(() => {
      finishLoading();
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
     <video
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finishLoading}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center" }}
        />
    </div>
  );
};

export default Loading;