import * as React from "react";

const LandingVideo = () => {
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const loadVideo = async () => {
      try {
        videoRef.current?.load();
        // Optional: You can perform additional actions after the video is loaded.
        setVideoLoaded(true);
        return videoRef?.current?.play();
      } catch (error) {
        // oh well
      }
    };

    void loadVideo(); // Explicitly mark the promise as ignored
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        onLoadedData={() => {
          setVideoLoaded(true);
          return videoRef?.current?.play();
        }}
        src="/assets/videos/tramonalandingstock.mp4"
        loop
        muted
        playsInline
        className="h-full w-[100vw] object-cover"
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
