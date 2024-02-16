import * as React from "react";

const LandingVideo = () => {
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const playVideo = () => {
    if (videoRef.current && !videoLoaded) {
      
      videoRef.current.play()
        .then(() => setVideoLoaded(true))
        .catch((error) => {
          // Handle error (like user didn't interact with the document yet)
          // console.error("Error playing video:", error);
        });
    }
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.addEventListener('loadeddata', playVideo);
    }

    // cleanup function to remove event listener
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', playVideo);
      }
    };
  }, []);

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
        className={`transition-duration-7000ms absolute inset-0 ${
          videoLoaded ? "bg-black/0" : "bg-black"
        }`}
      />
    </>
  );
};

export default LandingVideo;

