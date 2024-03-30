import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PhoneInput } from "@/components/ui/input-phone";
import { type Country, isValidPhoneNumber } from "react-phone-number-input";

import { api } from "@/utils/api";
import { zodEmail, zodString } from "@/utils/zod-utils";
import { useEffect, useState } from "react";

import { formatPhoneNumber } from "@/utils/formatters";
import OTPDialog from "./OTPDialog";

const formSchema = z.object({
  name: zodString(),
  email: zodEmail(),
  phoneNumber: zodString().refine(isValidPhoneNumber, {
    message: "Invalid phone number",
  }),
});

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const [verified, setVerified] = useState<boolean>(false);
  const [country, setCountry] = useState<Country | undefined>("US");

  const { mutate, isLoading } = api.users.updateProfile.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Profile updated sucessfully!",
        variant: "default",
      });

      // Update the session object with response data
      void update((prev: typeof session) => ({ ...prev, user: res }));
    },
    onError: (error) => {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation();
  const { mutateAsync: phoneNumberIsTaken } =
    api.users.phoneNumberIsTaken.useMutation();
  const { data: phoneNumber } = api.users.myPhoneNumber.useQuery();

  useEffect(() => {
    user?.phoneNumber === phoneNumber && setVerified(true);
  }, [user?.phoneNumber, phoneNumber]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user?.name}`,
      email: `${user?.email}`,
      phoneNumber: `${user?.phoneNumber}`,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!verified) {
      toast({
        variant: "destructive",
        title: "Please verify phone number!",
      });
      return;
    }
    if (user) {
      mutate({
        id: user.id,
        email: values.email,
        phoneNumber: values.phoneNumber,
        name: values.name,
      });
    }

    if (!country) {
      form.setError("phoneNumber", { message: "Invalid phone number" });
      return;
    }
    if (country !== "US") {
      if (session?.user.id) {
        await updateProfile({
          id: session?.user.id,
          isWhatsApp: true,
        });
      }
    }

    if (
      (await phoneNumberIsTaken({ phoneNumber: values.phoneNumber })) &&
      values.phoneNumber !== phoneNumber
    ) {
      form.setError("phoneNumber", {
        message: "Phone number already in use, please try again",
      });
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid w-full grid-cols-1 gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input inputMode="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  onCountryChange={setCountry}
                  autoFocus
                  {...field}
                />
              </FormControl>
              {!verified && (
                <OTPDialog
                  toPhoneNumber={formatPhoneNumber(
                    form.getValues("phoneNumber"),
                  )}
                  setVerified={setVerified}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={isLoading}
          size="lg"
          type="submit"
          className="lg:col-span-2"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
}
