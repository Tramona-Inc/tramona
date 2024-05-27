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
    <Card
      className={`fixed left-4 right-4 top-14 z-30 mx-auto max-w-6xl transition-transform duration-300 lg:left-24 ${
        show ? "translate-y-6" : "-translate-y-full"
      }`}
    >
      <CardContent>
        <DesktopSearchTab />
      </CardContent>
    </Card>
  );
});

DynamicDesktopSearchBar.displayName = "DynamicDesktopSearchBar";

export default DynamicDesktopSearchBar;
