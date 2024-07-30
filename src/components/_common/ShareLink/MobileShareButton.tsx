import { ShareIcon } from "lucide-react";

const MobileShareButton: React.FC = () => {
  const handleShare = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.share) {
      await navigator.share({
        title: "Check out this site",
        text: "This is a great site!",
        url: window.location.href,
      });
    }
  };

  return (
    <button onClick={handleShare}>
      <ShareIcon />
    </button>
  );
};

export default MobileShareButton;
