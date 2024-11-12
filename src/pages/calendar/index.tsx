"use client";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Component from "./CalendarComponent"; // Your existing calendar component
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function CalendarPage() {
  useSession({ required: true });

  return (
    <>
      <Head>
        <title>Calendar | Tramona</title>
      </Head>
      <DashboardLayout>
        <Component />
      </DashboardLayout>
    </>
  );
}
