import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import CounterForm from "@/components/counter/CounterForm";

export default function Counters() {
  return (
    <DashboardLayout type={"guest"}>
      <CounterForm />
    </DashboardLayout>
  );
}
