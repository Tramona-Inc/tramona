import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import {type Dispatch, SetStateAction, useState} from 'react';
import Link from "next/link";
import { X, MenuIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"; 

export default function HamburgerMenuMobile({
    links,
}: {
    links: {
        name:string;
        href: string;
        icon?: React.ReactNode | null;
    }[], 
}) {

    const [open, setOpen] = useState(false)
    return (
  // <Dialog open={open} onOpenChange={setOpen}>
  //      <DialogTrigger>
  //      <div className="pl-2">
  //          <MenuIcon />
  //        </div>
  //      </DialogTrigger>
  //      <DialogContent className="min-w-full min-h-full">
  //        <DialogTitle>
  //        <div className="flex items-center gap-3">
  //            <button
  //              className="rounded-full border border-teal-900 bg-zinc-200 p-2"
  //              onClick={() => setOpen(!open)}
  //            >
  //              <X size={20} />
  //            </button>
  //            <h3>Tramona</h3>
  //          </div>
  //        </DialogTitle>
  //        <DropdownMenuSeparator className="mt-3"/>
  //        {links.map((link) => (
  //          <Link key={link.href} href={link.href}>
  //              {link.icon ? 
  //              <>
  //              <div className="flex flex-row my-1 px-2 py-4 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
  //              <div className="flex p-1">{link.icon}</div>
  //              <div className="flex p-1">{link.name}</div>
  //            </div>
  //              <Separator className=""/>
  //              </>
  //              : 
  //              <>
  //              <div className="px-2 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
  //              <div className="p-2">
  //                {link.name}
  //              </div>
  //            </div>
  //            <Separator />
  //            </>
  //              }
  //          </Link>
  //        ))}
  //      </DialogContent>
  //    </Dialog>
     <DropdownMenu open={open} onOpenChange={setOpen}>
       <DropdownMenuTrigger>
         <div className="pl-2">
           <MenuIcon />
         </div>
       </DropdownMenuTrigger>
        {/* <DropdownMenuPortal container={document.body}> */}
        <DropdownMenuContent className="fixed -top-[3rem] -right-12 w-screen h-screen bg-white z-50 p-4 overflow-y-auto">
          <DropdownMenuLabel className="text-xl font-bold text-teal-900">
            <div className="flex items-center gap-3">
              <button
                className="rounded-full border border-teal-900 bg-zinc-200 p-2"
                onClick={() => setOpen(!open)}
              >
              <X size={20} />
              </button>
            <h3>Tramona</h3>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
              {link.icon ? 
              <>
                <DropdownMenuItem className="my-2 px-2 py-4 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="p-1">{link.icon}</div>
              <div>{link.name}</div>
            </DropdownMenuItem>
              <Separator />
              </>
              : 
              <>
              <DropdownMenuItem className="px-2 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="p-2">
                {link.name}
              </div>
            </DropdownMenuItem>
            <Separator />
            </>
              }
          </Link>
        ))}
        </DropdownMenuContent>
        {/* </DropdownMenuPortal> */}
        </DropdownMenu>
    )
}