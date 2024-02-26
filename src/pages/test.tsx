import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

export default function Page() {
  const { mutate } = api.printDate.useMutation();
  async function printDate(date: Date) {
    return new Promise((res, rej) => {
      mutate(date, {
        onError: (err) => rej(err.message),
        onSuccess: res,
      });
    });
  }

  return (
    <div className="grid h-64 place-items-center">
      <Button
        onClick={async () => {
          const date = new Date();
          console.log(`printing date ${date.toString()} on the server...`);
          await printDate(date);
        }}
      >
        print date
      </Button>
    </div>
  );
}
