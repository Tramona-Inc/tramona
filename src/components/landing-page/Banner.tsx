import React, { useState, useEffect } from "react";
import { CircleCheckIcon, XIcon } from "lucide-react";

interface BannerProps {
  type: "true" | "pending";
  onClose: () => void;
}

const Banner: React.FC<BannerProps> = ({ type, onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const config = {
    pending: {
      title: "Your ID is being reviewed",
      message: isMobile
        ? "Thank you for completing this process! It takes 2-3 minutes for your identity to be verified. We will notify you when you have been verified."
        : "Thank you for completing this process! It takes 2-3 minutes for your identity to be verified. Once complete, you can make your first offer. In the meantime, please feel free to browse through the site. We will notify you when your identity has been verified.",
      backgroundColor: "bg-yellow-200",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-800",
      iconColor: "#ca8a04",
    },
    true: {
      title: "Identity Verification",
      message:
        "You were successfully verified. You can now make offers on properties for your next trip.",
      backgroundColor: "bg-green-200",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      iconColor: "#047857",
    },
  };

  const { title, message, backgroundColor, borderColor, textColor, iconColor } =
    config[type];

  return (
    <div
      className={`${backgroundColor} ${borderColor} ${textColor} relative flex items-center rounded border px-4 py-3`}
    >
      <div className="flex">
        <div className="py-1">
          <div className="mr-2">
            <CircleCheckIcon color={iconColor} />
          </div>
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="mr-12 text-base">{message}</p>
        </div>
      </div>
      <button className="absolute right-0 top-0 px-4 py-3" onClick={onClose}>
        <XIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Banner;
