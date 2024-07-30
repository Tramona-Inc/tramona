import { useEffect, useRef } from "react";

interface VideoDisplayProps {
  url: string;
}

export default function VideoDisplay({ url }: VideoDisplayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    videoRef.current?.load();
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        onLoadedData={async () => {
          await videoRef.current?.play();
        }}
        src={url}
        loop
        muted
        playsInline
        className="h-full w-[100vw] object-cover"
      />
    </>
  );
}
