import React from "react";
import { RadioGroupDemo } from "@/components/_common/componentSample/RadioGroup";
import { ScrollAreaDemo } from "@/components/_common/componentSample/ScrollAreaDemo";
import { SliderDemo } from "@/components/_common/componentSample/SliderDemo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetDemo } from "@/components/_common/componentSample/SheetDemo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationsCard } from "@/components/_common/componentSample/NotificationsCard";
import { ComboBox } from "@/components/_common/componentSample/ComboBox";
import { ComboboxDropdownMenu } from "@/components/_common/componentSample/ComboboxDropdownMenu";
import { DatePickerDemo } from "@/components/_common/componentSample/DatePickerDemo";
import { DialogDemo } from "@/components/_common/componentSample/DialogDemo";
import { HoverCardDemo } from "@/components/_common/componentSample/HoverCardDemo";
import { NavigationMenuDemo } from "@/components/_common/componentSample/NavigationMenuDemo";
import { ProgressDemo } from "@/components/_common/componentSample/ProgressDemo";
import { Slider } from "@radix-ui/react-slider";
import { SwitchDemo } from "@/components/_common/componentSample/SwitchDemo";
import { TableDemo } from "@/components/_common/componentSample/TableDemo";
import { TabsDemo } from "@/components/_common/componentSample/TabsDemo";
import { ToggleGroupDemo } from "@/components/_common/componentSample/ToggleGroupDemo";
import { Tooltip } from "react-leaflet";
import { TooltipDemo } from "@/components/_common/componentSample/TooltipDemo";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <div className="mx-auto my-20 flex w-5/6 flex-col">
      <h1 className="my-6 text-4xl font-extrabold">Components</h1>
      <p className="my-6">
        We use the the shadcn ui libary, which offers a high degree of
        customization.
        <br></br>
        You can adjust various aspects of the components, including their size,
        text styles, outline properties, margins, and even some functional
        aspects. (not limited to the examples shown)
        <br></br>
        Some smaller components are used to create larger ones, such as the{" "}
        <span className="font-bold">buttons and text inputs</span> to create{" "}
        <span className="font-bold">forms</span>.
        <br />
        <a className="text-blue-700 " href="https://ui.shadcn.com/">
          https://ui.shadcn.com/
        </a>
      </p>
      <h1 className="my-8 mt-10 text-3xl font-bold">Larger Components </h1>
      <div className="flex flex-row gap-x-16">
        <div className="w-full">
          <h1 className="font-2xl font-black">Accordian</h1>
          <a
            href="https://ui.shadcn.com/docs/components/accordion"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-full">
          <h1 className="font-2xl font-black">Calendar</h1>
          <a
            href="https://ui.shadcn.com/docs/components/calendar"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <div className="flex flex-row gap-x-10">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={undefined}
              className="rounded-md border"
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="flex w-full flex-col space-y-2">
          <h1 className="font-2xl font-black">DatePickerDemo</h1>
          <a
            href="https://ui.shadcn.com/docs/components/accordion"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <DatePickerDemo />
        </div>
      </div>
      <div className="flex flex-row space-x-10">
        <div className="w-1/2">
          <h1 className="font-3xl font-black">Card</h1>
          <p className="text-lg font-bold text-gray-700 underline">
            SUPER COMMON AND CUSTOMIZEABLE
          </p>
          <a
            href="https://ui.shadcn.com/docs/components/card"
            className="text-blue-700"
          >
            Click here for more details
          </a>

          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                basically you can organize or put what ever how ever you want,
                can be small or very large
              </p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
        <div>
          <h1 className="font-3xl font-black">Card example</h1>
          <p className="text-lg font-bold text-gray-700 underline">
            Here is a good card example
          </p>
          <NotificationsCard />
        </div>
        <div>
          <h1 className="font-3xl font-black">Navigation Menu</h1>
          <a
            href="https://ui.shadcn.com/docs/components/navigation-menu"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <NavigationMenuDemo />
        </div>
      </div>
      <div className="my-16 flex flex-row gap-x-10">
        <div className="w-1/2">
          <h1 className="font-3xl font-black">Progress Bar</h1>
          <a
            href="https://ui.shadcn.com/docs/components/progress"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <ProgressDemo />
        </div>
        <div className="w-1/2">
          <h1 className="font-3xl font-black">Radio Group Demo</h1>
          <a
            href="https://ui.shadcn.com/docs/components/radio-group"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <RadioGroupDemo />
        </div>
        <div className="">
          <h1 className="font-3xl font-black">Scroll area demo </h1>
          <a
            href="https://ui.shadcn.com/docs/components/radio-group"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <ScrollAreaDemo />
        </div>
        <div className="ml-10 flex w-1/2 flex-col">
          <h1 className="font-3xl font-black">Sheet </h1>
          <a
            href="https://ui.shadcn.com/docs/components/sheet"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <SheetDemo />
        </div>
      </div>
      <div className="my-16 flex flex-row gap-x-10">
        <div className="w-1/2 space-y-3">
          <h1 className="font-3xl font-black">Slider</h1>
          <a
            href="https://ui.shadcn.com/docs/components/slider"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <SliderDemo />
        </div>
        <div className="w-1/2">
          <h1 className="font-3xl font-black">Switch Demo</h1>
          <a
            href="https://ui.shadcn.com/docs/components/switch"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <SwitchDemo />
        </div>
        <div className="">
          <h1 className="font-3xl font-black">Table </h1>
          <a
            href="https://ui.shadcn.com/docs/components/table"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <TableDemo />
        </div>
        <div className="ml-10 flex w-1/2 flex-col">
          <h1 className="font-3xl font-black">Tabs </h1>
          <a
            href="https://ui.shadcn.com/docs/components/tabs"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <TabsDemo />
        </div>
      </div>

      <h1 className="my-8 mt-20 text-3xl font-bold">Smaller Components </h1>
      <div className="flex flex-row gap-x-16">
        <div className="flex w-full flex-col gap-y-2">
          <h1 className="font-2xl font-black">Dialog</h1>
          <a
            href="https://ui.shadcn.com/docs/components/alert-dialog"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Badge</h1>
          <p>This one has variations!</p>
          <a
            href="https://ui.shadcn.com/docs/components/badge"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <div className="w-20">
            <Badge variant="default">Badge</Badge>
            <Badge variant="secondary">Badge</Badge>
            <Badge variant="solidRed">Badge</Badge>
            <Badge variant="red">Badge</Badge>
            <Badge variant="green">Badge</Badge>
            <Badge variant="yellow">Badge</Badge>
            <Badge variant="blue">Badge</Badge>
            <Badge variant="gray">Badge</Badge>
          </div>
        </div>

        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Button</h1>
          <p>This one has variations!</p>
          <a
            href="https://ui.shadcn.com/docs/components/button"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <div className="w-20">
            <Button variant="default">Badge</Button>
            <Button variant="secondary">Badge</Button>
            <Button variant="link">Badge</Button>
            <Button variant="destructive">Badge</Button>
            <Button variant="outline">Badge</Button>
            <Button variant="ghost">Badge</Button>
            <Button variant="emptyInput">Badge</Button>
            <Button variant="filledInput">Badge</Button>
            <Button variant="darkPrimary">Badge</Button>
            <Button variant="darkOutline">Badge</Button>
            <Button variant="darkOutlineWhite">Badge</Button>
            <Button variant="gold">Badge</Button>
            <Button variant="white">Badge</Button>
            <Button variant="wrapper">Badge</Button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Avatar</h1>
          <a
            href="https://ui.shadcn.com/docs/components/avatar"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Checkbox</h1>
          <a
            href="https://ui.shadcn.com/docs/components/avatar"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
        </div>
      </div>
      <hr />
      <div className="my-16 flex flex-row gap-x-10">
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Combobox</h1>
          <a
            href="https://ui.shadcn.com/docs/components/combobox"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <div className="flex items-center space-x-2">
            <ComboBox />
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Combobox DropDown</h1>
          <a
            href="https://ui.shadcn.com/docs/components/combobox"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <div className="flex items-center space-x-2">
            <ComboboxDropdownMenu />
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">Hover Card </h1>

          <a
            href="https://ui.shadcn.com/docs/components/hover-card"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <HoverCardDemo />
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h1 className="font-2xl font-black">DialogExample</h1>

          <a
            href="https://ui.shadcn.com/docs/components/dialog"
            className="text-blue-700"
          >
            Click here for more details
          </a>

          <p className="text-lg font-bold text-gray-700 underline">
            SUPER COMMON AND CUSTOMIZABLE
          </p>
          <DialogDemo />
        </div>
      </div>
      <div className="flex flex-row justify-around">
        <div className="flexflex-col gap-y-4 ">
          <h1 className="font-2xl font-black">Toggle Group</h1>

          <a
            href="https://ui.shadcn.com/docs/components/toggle-group"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <ToggleGroupDemo />
        </div>
        <div className="flex flex-col gap-y-4 ">
          <h1 className="font-2xl font-black">Tool Tip</h1>

          <a
            href="https://ui.shadcn.com/docs/components/tooltip"
            className="text-blue-700"
          >
            Click here for more details
          </a>
          <TooltipDemo />
        </div>
      </div>
    </div>
  );
}

export default Page;
