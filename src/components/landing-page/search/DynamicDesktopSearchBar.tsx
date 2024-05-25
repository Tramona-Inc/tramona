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
      className={`fixed top-14 z-30 w-5/6 transition-transform duration-300 ${
        show ? "mt-5" : "-translate-y-full"
      }`}
    >
      <CardContent>
        <DesktopSearchTab />
      </CardContent>
    </Card>
  );
});

export default DynamicDesktopSearchBar;
