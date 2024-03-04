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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useRequireNoAuth } from "@/utils/auth-utils";
import { errorToast } from "@/utils/toasts";
import {
  zodEmail,
  zodPassword,
  zodPhone,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: zodEmail(),
    phoneNumber: zodPhone(),
    name: zodString({ minLen: 2 }),
    password: zodPassword(),
    confirm: z.string(),
    isAirbnb: z.enum(["airbnb", "other"]),
    profileLink: zodUrl(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function HostSignUpForm() {
  useRequireNoAuth();

  const router = useRouter();
  const { query } = useRouter();

  const [isVerifiedHostUrl, setIsVerifiedHostUrl] = useState(false);

  const { mutateAsync: mutateSendOTP } = api.twilio.sendOTP.useMutation();

  const { mutateAsync: verifyHostTokenAsync } =
    api.auth.verifyHostToken.useMutation({
      onSuccess: () => {
        setIsVerifiedHostUrl(true);
      },
      onError: () => {
        toast({
          description: "Link has expired!",
          title: "Please contact tramona support to received a new host link.",
          variant: "destructive",
        });

        void router.push("/auth/signup");
      },
    });

  useEffect(() => {
    const verifyHostToken = async () => {
      if (query.token) {
        try {
          await verifyHostTokenAsync({
            token: query.token as string,
          });
        } catch (error) {
          // The token verification failed.
          return error;
        }
      }
    };

    void verifyHostToken();
  }, [verifyHostTokenAsync, query.token, router]);

  useEffect(() => {
    if (typeof router.query.code === "string") {
      localStorage.setItem("referralCode", router.query.code);
    }
  }, [router.query.code]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: createUserHost } = api.auth.createUserHost.useMutation();

  async function handleSubmit(newUser: FormSchema) {
    if (query.token === undefined && query.conversationId === undefined) {
      errorToast("Invalid or expired url to be host!");

      void router.push("/auth/signup");
    } else {
      console.log(query.conversationId);

      const newUserWithHostCheck = {
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
        confirm: newUser.confirm,
        isAirbnb: newUser.isAirbnb,
        profileLink: newUser.profileLink,
        conversationId: query.conversationId as string,
        isVerifiedHostUrl: isVerifiedHostUrl,
      };

      await createUserHost(newUserWithHostCheck)
        .then(() =>
          // Verify Phone number first before addingin to db
          mutateSendOTP({
            to: "+1" + newUser.phoneNumber,
          }),
        )
        // will redirect to page that updates user phone number
        .then(() =>
          router.push({
            pathname: "/auth/verify-sms",
            query: {
              phone: "+1" + newUser.phoneNumber,
              email: newUser.email,
            },
          }),
        )
        .catch(() => errorToast("Couldn't sign up, please try again"));
    }
  }

  return (
    <div className="w-full space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAirbnb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where do you currently list?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Please choose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileLink"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your profile link"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormMessage />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
}
