import { Card, CardContent } from "@/components/ui/card";
import { DesktopSearchTab } from "../SearchBars/DesktopSearchTab";
import { useState, useEffect, useCallback } from "react";
import React from "react";

const DynamicDesktopSearchBar = React.memo(() => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const controlNavbar = useCallback(() => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
    setIsScrolling(false);
  }, [lastScrollY]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
        window.requestAnimationFrame(controlNavbar);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controlNavbar, isScrolling]);

  return (
    <div className="w-full sticky top-0 h-28 flex justify-center items-end shrink-0 z-20 bg-white mb-2">
      <Card className="w-full flex-shrink-0">
        <CardContent>
          <DesktopSearchTab />
        </CardContent>
      </Card>
    </div>
  );
});

DynamicDesktopSearchBar.displayName = "DynamicDesktopSearchBar";

export default DynamicDesktopSearchBar;


