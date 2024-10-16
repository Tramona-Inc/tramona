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
import { zodUrl } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Icons from "../ui/icons";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

function RequriedIcon() {
  return <span className="text-red-500">*</span>;
}

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  college: z.string(),
  schoolName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
  linkedInUrl: zodUrl(),
  instagram: z
    .string()
    .max(100, {
      message: "Instagram username must be less than 100 characters",
    })
    .optional(),
  twitter: z
    .string()
    .max(100, {
      message: "Twitter username must be less than 100 characters",
    })
    .optional(),
  otherSocialMedia: z
    .string()
    .max(100, {
      message: "Other social mediad username must be less than 100 characters",
    })
    .optional(),
  question1: z
    .string()
    .min(2, {
      message: "Response must be greater than 2 characters",
    })
    .max(1000, {
      message: "Response must be less than 1000 characters",
    }),
  question2: z
    .string()
    .min(2, {
      message: "Response must be greater than 2 characters",
    })
    .max(1000, {
      message: "Response must be less than 1000 characters",
    }),
  question3: z
    .string()
    .min(2, {
      message: "Response must be greater than 2 characters",
    })
    .max(1000, {
      message: "Response must be less than 1000 characters",
    }),
  question4: z
    .string()
    .max(1000, {
      message: "Response must be less than 1000 characters",
    })
    .optional(),
});

export function ProgramFrom() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      college: "no",
      schoolName: "",
      phone: "",
      linkedInUrl: "",
      instagram: "",
      twitter: "",
      question1: "",
      question2: "",
      question3: "",
      question4: "",
    },
  });

  const { data: session } = useSession();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      values: values,
      user: session?.user,
    };

    try {
      setIsLoading(true);

      await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setIsLoading(false);
      setSent(true);

      toast({
        title: "Application successfully sent.",
        description: "We've received your application",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }

  if (sent) {
    return (
      <div className="my-[150px] h-full">
        <Card>
          <CardHeader></CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-10">
            <CardTitle>Thank you for your application</CardTitle>
            <Icons iconName="success" className="h-[100px] w-[100px]" />
            <CardDescription className="font-center flex items-start justify-center">
              We&apos;ve received your application! If you&apos;re a good fit we
              will reach out to you. Thank you!
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return (
      <>
        {session ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h2 className="text-2xl font-bold">How can we reach you?</h2>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First name <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last name <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Are you in college? <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-5"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      School Name <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="University of ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Telephone <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (123)-123-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedInUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      LinkedIn URL <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="www.linkedin.com/in/" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherSocialMedia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Other applicable social medias (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h2 className="text-2xl font-bold">
                Tell us a bit about yourself
              </h2>

              <FormField
                control={form.control}
                name="question1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Why do you want Ambassador status? <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-y" rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What is your growth strategy? <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-y" rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Where do you plan to post your code? <RequriedIcon />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-y" rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Anything else you think we should know? (optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-y" rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        ) : (
          <div className="my-[150px] h-full">
            <Card>
              <CardHeader></CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-10">
                <CardTitle>We need your account info</CardTitle>
                <Icons iconName="shield" className="h-[100px] w-[100px]" />
                <Button onClick={() => signIn()}>Log in / Sign up</Button>
              </CardContent>
              <CardFooter>
                <CardDescription className="flex flex-col items-center justify-center">
                  To proceed with your application, please create an account or
                  log in. Your journey begins here – let&apos;s get started
                  together!
                </CardDescription>
              </CardFooter>
            </Card>
          </div>
        )}
      </>
    );
  }
}
