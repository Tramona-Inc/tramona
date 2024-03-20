import * as React from "react";

const LandingVideo = () => {
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const playVideo = React.useCallback(() => {
    if (videoRef.current && !videoLoaded) {
      void videoRef.current.play().then(() => setVideoLoaded(true));
    }
  }, [videoLoaded]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.addEventListener("loadeddata", playVideo);
    }

    // cleanup function to remove event listener
    return () => {
      if (video) {
        video.removeEventListener("loadeddata", playVideo);
      }
    };
  }, [playVideo]);

  return (
    <>
      <video
        ref={videoRef}
        src="/assets/videos/landing-bg.mp4"
        loop
        muted
        playsInline
        className="absolute h-full w-full object-cover"
      />
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          videoLoaded ? "bg-black/70" : "bg-black"
        }`}
      />
    </>
  );
};

export default LandingVideo;
