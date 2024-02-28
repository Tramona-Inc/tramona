import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <div className="col-span-1 flex flex-col justify-center gap-5 px-5">
      <Link href={"/dashboard"}>Overview</Link>
      <Link href={"/my-trips"}>My Trips</Link>
      <Link href={"/requests"}>Request/offers</Link>
      <Link href={"/messages"}>Messages</Link>
      <Link href={"/faq"}>FAQ</Link>
    </div>
  );
}
