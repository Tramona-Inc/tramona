import { CopyIcon, ShareIcon } from "lucide-react";

const MobileShareButton: React.FC = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this site",
          text: "This is a great site!",
          url: window.location.href,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Web Share API is not supported in your browser.");
    }
  };

  return (
    <button onClick={handleShare}>
      <ShareIcon />
    </button>
  );
};

export default MobileShareButton;
