import CalendarComponent from "../../../components/dashboard/host/calendar/CalendarComponent"; // Your existing calendar component
import { useSession } from "next-auth/react";
import Head from "next/head";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";

export default function CalendarPage() {
  useSession({ required: true });

  return (
    <>
      <Head>
        <title>Calendar | Tramona</title>
      </Head>
      <HostDashboardLayout>
        <CalendarComponent />
      </HostDashboardLayout>
    </>
  );
}
