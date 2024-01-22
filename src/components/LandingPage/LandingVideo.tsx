import * as React from 'react';

/**
 * Component for the home page video background.
 */
const LandingVideo = () => {
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    videoRef.current?.load();
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        onLoadedData={() => {
          setVideoLoaded(true);
          videoRef?.current?.play();
        }}
        src="/assets/videos/tramonalandingstock.mp4"
        loop
        muted
        playsInline
        className="h-full w-[100vw] object-cover"
      />
      <div className={`absolute inset-0 [transition-duration:7000ms] ${videoLoaded ? 'bg-black/0' : 'bg-black'}`} />
    </>
  );
};

export default LandingVideo;