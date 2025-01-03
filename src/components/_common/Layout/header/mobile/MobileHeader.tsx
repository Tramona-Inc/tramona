"use client";

import { useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "next-auth/react";
import useHostBtn from "../useHostBtn";
import { cn } from "@/utils/utils";
import { SkeletonText } from "@/components/ui/skeleton";
import AvatarDropdown from "../AvatarDropdown";
import LogInSignUp from "../LoginOrSignup";
import {
  browseLinkItems,
  aboutLinkItems,
  hostAccountLinks,
  hostManageLinks,
} from "@/config/headerNavLinks";

export default function MobileHeader({ isHost }: { isHost: boolean }) {
  const { status, data: session } = useSession();
  const hostBtn = useHostBtn(true);

  const [open, setOpen] = useState(false);

  //first and second link
  const firstLinkItems = isHost ? hostManageLinks : browseLinkItems;
  const secondLinkItems = isHost ? hostAccountLinks : aboutLinkItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="relative flex h-14 items-center justify-between px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="z-10 text-primaryGreen transition-colors duration-200 hover:bg-primaryGreen/10 data-[state=open]:bg-primaryGreen/10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full bg-background p-0">
            <div className="flex items-center justify-between border-b p-4">
              <SheetTitle className="text-xl font-semibold text-primaryGreen">
                Menu
              </SheetTitle>
            </div>
            <div className="overflow-y-auto">
              <Accordion
                type="multiple"
                defaultValue={["browse", "about"]}
                className="w-full divide-y divide-slate-200"
              >
                <AccordionItem value="browse">
                  <AccordionTrigger className="border-b px-4 py-3 text-lg font-bold text-primaryGreen hover:bg-white hover:no-underline">
                    {isHost ? "Manage" : "Browse"}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 bg-white py-2 pl-4">
                    {firstLinkItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center justify-between rounded-md py-3 pr-4 text-primaryGreen transition-colors duration-200 hover:bg-background"
                      >
                        <div className="flex flex-row items-center gap-x-2">
                          {item.icon ? <item.icon /> : null}
                          {item.title}
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="about">
                  <AccordionTrigger className="border-b px-4 py-3 text-lg font-bold text-primaryGreen hover:bg-white hover:no-underline">
                    {isHost ? "Account" : "About"}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 bg-white py-2 pl-4">
                    {secondLinkItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center justify-between rounded-md py-3 pr-4 text-primaryGreen transition-colors duration-200 hover:bg-background"
                      >
                        <div className="flex flex-row items-center gap-x-2">
                          <item.icon />
                          {item.title}
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="space-y-4 border-t p-4">
                <Link
                  href="/terms-and-conditions/default"
                  className="block text-sm text-primaryGreen/70 transition-colors duration-200 hover:text-primaryGreen"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy-policy"
                  className="block text-sm text-primaryGreen/70 transition-colors duration-200 hover:text-primaryGreen"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          className="absolute left-16 z-0 flex items-center justify-center sm:inset-0"
        >
          <span className="text-xl font-semibold tracking-tight text-primaryGreen sm:tracking-normal">
            Tramona
          </span>
        </Link>
        <div className="z-10 flex flex-row items-center gap-x-1">
          {status === "loading" ? null : hostBtn.isLoading ? (
            <div className="px-4">
              <SkeletonText className="w-24" />
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className={cn(
                "text-black",
                hostBtn.href !== "/why-list" && "text-sm tracking-tight",
              )}
            >
              <Link href={hostBtn.href}>{hostBtn.name}</Link>
            </Button>
          )}
          {status === "authenticated" && (
            <AvatarDropdown session={session} size="sm" />
          )}

          {status === "unauthenticated" && <LogInSignUp isMobile={true} />}
        </div>
      </div>
    </header>
  );
}
