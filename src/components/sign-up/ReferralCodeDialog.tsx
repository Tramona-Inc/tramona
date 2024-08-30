import { api } from "@/utils/api";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { REFERRAL_CODE_LENGTH } from "@/server/db/schema";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { zodString } from "@/utils/zod-utils";
import Spinner from "../_common/Spinner";
import { errorToast } from "@/utils/toasts";
import UserAvatar from "../_common/UserAvatar";

export function ReferralCodeForm() {
  const mutation = api.referralCodes.startUsingCode.useMutation();

  // i had to do this since mutateAsync throws a weird looking error, and i cant
  // use onError normally since i dont have access to the context of the zod async transform
  async function startUsingCode(code: string) {
    return await new Promise<NonNullable<typeof mutation.data>>((res, rej) => {
      mutation.mutate(code, {
        onError: (err) => rej(err.message),
        onSuccess: (data) => res(data),
      });
    });
  }

  // https://zod.dev/?id=validating-during-transform
  // https://zod.dev/?id=async-transforms
  const formSchema = z.object({
    code: zodString()
      .length(REFERRAL_CODE_LENGTH, {
        message: `Must be ${REFERRAL_CODE_LENGTH} characters`,
      })
      .regex(/^[A-Z0-9]+$/, {
        message: "Must be numbers and letters only",
      })
      .transform(async (code, ctx) => {
        return await startUsingCode(code).catch((err) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              typeof err === "string" ? err : "Couldn't apply referral code",
          });
          return z.NEVER;
        });
      }),
  });

  type FormInput = z.input<typeof formSchema>;
  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormInput, unknown, FormSchema>({
    resolver: zodResolver(formSchema, { async: true }),
    reValidateMode: "onSubmit",
  });

  const [successSlide, setSuccessSlide] = useState(() => {
    const code = localStorage.getItem("referralCode");
    return code ? (
      <SuccessSlide
        ownerPromise={startUsingCode(code).then((res) => res.owner)}
      />
    ) : null;
  });

  const onSubmit: SubmitHandler<FormSchema> = ({ code }) => {
    setSuccessSlide(
      <SuccessSlide ownerPromise={Promise.resolve(code.owner)} />,
    );
  };

  return (
    successSlide ?? (
      <>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">
            Did someone refer you?
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="col-span-full sm:col-span-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Please input their referral code here"
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Skip</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </>
    )
  );
}

function SuccessSlide({
  ownerPromise,
}: {
  ownerPromise: Promise<{ name: string; image: string | null }>;
}) {
  const [owner, setOwner] = useState<{
    name: string;
    image: string | null;
  } | null>(null);

  useEffect(() => {
    void ownerPromise
      .then((owner) => setOwner(owner))
      .catch(() => errorToast("Couldn't apply referral code"));
  }, [ownerPromise]);

  return owner ? (
    <>
      <DialogHeader className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
        <UserAvatar
          size="lg"
          name={owner.name}
          email={null}
          image={owner.image}
        />
        <div className="flex-1">
          <DialogTitle>Successfully referred by {owner.name}</DialogTitle>
          <DialogDescription>
            They will earn a profit every time you book on Tramona!
          </DialogDescription>
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Done</Button>
        </DialogClose>
      </DialogFooter>
    </>
  ) : (
    <Spinner />
  );
}
