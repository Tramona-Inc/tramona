import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

export default function ExamplePayment() {
  const createCheckout = api.payments.createCheckout.useMutation();

  async function checkout() {
    const response = await createCheckout.mutateAsync({
      name: "hello",
      price: 1000,
    });

    // TODO: redirect to checkout after stripe session
    console.log(response.id);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      Example Payment
      <Button onClick={() => checkout()}>Create session</Button>
    </div>
  );
}
