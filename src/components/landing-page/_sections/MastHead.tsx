// MastHead.tsx
import { NameYourPriceSection } from "./name-your-price/NameYourPriceSection";
import landingBg2 from "public/assets/images/landing-page/man_standing_on_rock.png";
import { useRouter } from "next/router";
import { AdjustedPropertiesProvider } from "../search/AdjustedPropertiesContext";
import { DesktopSearchTab } from "../search/DesktopSearchTab";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, HelpCircle, Mail } from "lucide-react";
import OverviewRequestCards from "./name-your-price/OverviewRequestCards";
import HowTramonaWorks from "./name-your-price/HowTramonaWorks";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";
import { landingPageTestimonals } from "./testimonials/testimonials-data";
import UnclaimedMap from "@/components/unclaimed-offers/UnclaimedMap";
import { useIsLg } from "@/utils/utils";
import { useIsXl } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import CityAutocomplete from "@/components/_common/CityAutocomplete";
import { useForm, Controller } from "react-hook-form";
interface Location {
  lat: number;
  lng: number;
  size: number;
  color: string;
}
type FormData = {
  email: string;
  cities: string[];
  stateCode: string;
  country: string;
};
export default function MastHead() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      cities: [],
      stateCode: "",
      country: "",
    },
    mode: "onChange",
  });

  const isXl = useIsXl();
  const isLg = useIsLg();
  const router = useRouter();
  const { query } = router;
  const activeTab = query.tab ?? "search";
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleSectionRef = useRef<HTMLDivElement>(null);
  const [hasPassedButtons, setHasPassedButtons] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const cityAutocompleteRef = useRef<HTMLInputElement>(null); // Create a ref
  const { mutate: insertWarmLead } = api.outreach.insertWarmLead.useMutation({
    onSuccess: () => {
      toast({
        title: "Warm lead inserted successfully",
      });
    },
  });
  const handleAddCity = (selectedCity?: string) => {
    let cityToAdd = newCity;
    if (selectedCity) {
      cityToAdd = selectedCity;
    }
    if (cityToAdd.trim() && !cities.includes(cityToAdd)) {
      const [city, stateCode, country] = cityToAdd.split(",");
      if (city) {
        setCities([...cities, city]);
        setValue("cities", [...cities, city]);
      }
      if (stateCode) {
        setValue("stateCode", stateCode);
      }
      if (country) {
        setValue("country", country);
      }
      setNewCity("");
      setPopoverOpen(false);
      cityAutocompleteRef.current?.blur();
      return false;
    }
  };

  const onSubmit = (data: FormData) => {
    insertWarmLead(data);
    setCities([]);
    setNewCity("");
    setPopoverOpen(false);
    clearErrors("email"); // Clear email errors on successful submit if any were previously shown
    cityAutocompleteRef.current?.blur();
  };
  const handleRemoveCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);

      if (toggleSectionRef.current) {
        const buttonPosition = toggleSectionRef.current.offsetTop;
        setHasPassedButtons(scrollPosition > buttonPosition + 400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tab: string) => {
    void router.push(
      {
        pathname: router.pathname,
        query: { ...query, tab },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );

    if (toggleSectionRef.current) {
      const headerOffset = isXl ? 300 : isLg ? 260 : 65;

      const elementPosition =
        toggleSectionRef.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const scrollToHowItWorks = () => {
    window.scrollTo({
      top: 3000,
      behavior: "smooth",
    });
  };

  const faqData = [
    {
      question: "What's the benefit of listing on Tramona?",
      answer:
        "Tramona acts as a way to effectly increase your bookings and revenue. Our goal is to supplement your existing booking channels, and make the life of a host easier.",
    },
    {
      question: "Can I invite a co-host?",
      answer:
        "Absolutely. Tramona allows you to add a co-host to help manage requests and bookings on your property. This is available once a host account has been created.",
    },
    {
      question: "Can I choose which dates to book",
      answer:
        "Yes, you have full control over your property. You can choose which dates to book, which dates to offer, what prices you are interested in seeing and have the ability to counter traveler requests. You can set up book it now or request to book options.",
    },
    {
      question: "Can I choose which guests I want?",
      answer:
        "Yes! Tramona allows you to view guests profiles and message them before booking. If there are ever any issues with a guest, please let us know ASAP",
    },
  ];

  return (
    <AdjustedPropertiesProvider>
      <div className="bg-background-offWhite">
        <div
          className={`sticky -top-24 z-20 -mt-24 flex w-full translate-y-24 flex-col items-center justify-center border-b-2 transition-all duration-300 ease-in-out lg:top-16 lg:mt-0 lg:translate-y-0 ${
            isScrolled
              ? "border-white bg-white shadow-md"
              : "border-transparent bg-transparent lg:bg-white"
          }`}
        >
          <DesktopSearchTab
            isCompact={isScrolled}
            handleTabChange={handleTabChange}
            isLandingPage={true}
          />

          {/* Booking Toggle in Sticky Header */}
          <div
            className={`w-full transition-all duration-300 ease-in-out ${
              hasPassedButtons
                ? "mt-1 h-9 opacity-100"
                : "pointer-events-none h-0 opacity-0"
            }`}
          >
            <div className="mx-auto max-w-sm px-4 md:max-w-md lg:max-w-2xl">
              <div className="flex justify-center gap-12 lg:gap-60">
                <button
                  onClick={() => handleTabChange("search")}
                  className={`group relative py-2 text-center text-sm transition-all duration-200`}
                >
                  <span
                    className={`${
                      activeTab === "search"
                        ? "text-primaryGreen"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    Book it now
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full scale-x-125 transition-transform duration-200 ${
                      activeTab === "search"
                        ? "bg-primaryGreen"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleTabChange("name-price")}
                  className={`group relative py-2 text-center text-sm transition-all duration-200`}
                >
                  <span
                    className={`${
                      activeTab === "name-price"
                        ? "text-primaryGreen"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    Name your own price
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full scale-x-125 transition-transform duration-200 ${
                      activeTab === "name-price"
                        ? "bg-primaryGreen"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="h-96">
            <Image
              src={landingBg2}
              alt=""
              fill
              placeholder="blur"
              className="object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center pl-4 text-left lg:hidden">
              <h2 className="mt-8 text-left text-3xl font-bold text-white sm:text-4xl">
                Lets turn empty nights into bookings
              </h2>
              <h3 className="mt-6 text-lg font-semibold text-white">
                Supplement your existing booking platforms and fill your empty
                nights
              </h3>
              <h3 className="mt-2 text-xs font-semibold text-white">
                Sign up and seamlessly sync your host account with Airbnb in
                seconds.
              </h3>
              <h3 className="mt-4 text-lg font-semibold text-white">
                <Link href={"/how-it-works"} className="flex items-center">
                  How it works
                  <ChevronRight className="" />
                </Link>
              </h3>
            </div>

            <div className="max-w-9xl absolute inset-0 mx-auto hidden px-24 lg:flex lg:flex-row lg:items-center lg:justify-between">
              {/* Left side - Text Content */}
              <div className="w-full text-left lg:w-2/3">
                <h2 className="mt-8 text-5xl font-bold text-white">
                  Turn empty nights into opportunities
                </h2>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Supplement your existing booking platforms and fill your empty
                  nights
                </h3>
                <h4 className="text-h4-size mt-3 font-semibold text-white">
                  Sign up and seamlessly sync your host account with Airbnb in
                  seconds
                </h4>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  <button
                    className="flex items-center"
                    onClick={() => router.push("/how-it-works")}
                  >
                    <span className="underline">How it works</span>
                  </button>
                </h3>
              </div>

              {/* Right side - Newsletter Signup (Desktop) */}
              {isXl && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="items-center justify-center 2xl:pr-12"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 w-full lg:mt-0 lg:w-[400px]"
                  >
                    <div className="rounded-xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                      <h3 className="mb-1 text-2xl font-semibold text-white">
                        Hey Hosts! 👋
                      </h3>
                      <p className="text-xs text-white/90">
                        Not ready to sign up? Enter your email below and we will
                        send you booking requests as they come in.
                      </p>

                      <div className="space-y-4">
                        {/* City Selection */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-white">
                            Where are your properties located?
                          </label>
                          <div className="flex gap-2">
                            <CityAutocomplete
                              value={newCity}
                              onValueChange={(value) => setNewCity(value)}
                              open={popoverOpen}
                              setOpen={setPopoverOpen}
                              //   onCitySelect={(city) => { // Add onCitySelect prop
                              //   handleAddCity(city); // Call handleAddCity with selected city
                              // }}
                              trigger={({ value, disabled }) => (
                                <Input
                                  // ref={cityAutocompleteRef}
                                  type="text"
                                  placeholder="Enter city name"
                                  value={value}
                                  onChange={(e) => setNewCity(e.target.value)}
                                  // onFocus={() => setPopoverOpen(true)}
                                  className="border-white/20 bg-white/20 text-sm text-white placeholder:text-white/60"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddCity();
                                    }
                                  }}
                                  disabled={disabled}
                                />
                              )}
                            />
                            <Button
                              onClick={() => handleAddCity()}
                              variant="secondary"
                              size="icon"
                              type="button"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* City List */}
                          <div className="flex max-h-[80px] min-h-[40px] flex-wrap gap-2 overflow-y-hidden">
                            <AnimatePresence>
                              {cities.map((city, index) => (
                                <motion.div
                                  key={city}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="flex items-center gap-2 px-2 py-1 text-xs"
                                  >
                                    {city}
                                    <X
                                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                                      onClick={() => handleRemoveCity(index)}
                                    />
                                  </Badge>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-white">
                            Your email address
                          </label>
                          <div className="flex flex-col gap-2">
                            {" "}
                            {/* Changed to flex-col and gap-2 */}
                            <div className="relative min-h-[60px]">
                              {" "}
                              {/* Add min-height container */}
                              <Controller
                                name="email"
                                control={control}
                                rules={{
                                  required: "Email is required",
                                  pattern: {
                                    value:
                                      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format",
                                  },
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="border-white/20 bg-white/20 text-sm text-white placeholder:text-white/60"
                                  />
                                )}
                              />
                              {/* Position error absolutely within container */}
                              {errors.email && (
                                <p className="absolute bottom-[-5px] text-xs text-red-500">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <Button
                              className="whitespace text-sm"
                              type="submit"
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Get Booking Requests
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </form>
              )}
            </div>
          </div>
        </div>
        {/* Right side - Newsletter Signup (Mobile) - Now outside the image div */}

        <div className="relative -mt-4">
          {" "}
          {/* Keep this div wrapping the toggle and map/name-price section */}
          {/* Original Booking Toggle */}
          <div
            ref={toggleSectionRef}
            className={`mx-auto mb-6 max-w-sm transition-all duration-300 md:max-w-md lg:max-w-2xl ${
              hasPassedButtons ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="mx-auto max-w-sm px-4 md:max-w-md lg:max-w-2xl">
              <div className="flex w-full overflow-hidden rounded-full border border-[#004236] bg-white">
                <button
                  onClick={() => handleTabChange("search")}
                  className={`w-1/2 px-8 py-1 text-center text-sm font-medium transition-all duration-200 md:py-3 ${
                    activeTab === "search"
                      ? "bg-[#004236] text-white"
                      : "bg-white text-[#004236]"
                  }`}
                >
                  Book it now
                </button>
                <button
                  onClick={() => handleTabChange("name-price")}
                  className={`w-1/2 px-8 py-2 text-center text-sm font-medium leading-tight transition-all duration-200 md:py-3 ${
                    activeTab === "name-price"
                      ? "bg-[#004236] text-white"
                      : "bg-white text-[#004236]"
                  }`}
                >
                  Name your own price
                </button>
              </div>
            </div>
          </div>
          {activeTab === "search" ? <UnclaimedMap /> : <NameYourPriceSection />}
        </div>

        <div className="mx-auto mt-12 flex max-w-8xl flex-col items-center gap-y-20 lg:gap-y-24">
          {/* other  sections */}
          <OverviewRequestCards />
          {!isLg && (
            <div className="mx-2 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 w-full lg:mt-0 lg:w-[400px]"
              >
                <div className="rounded-xl border border-gray-900/20 p-6">
                  <h3 className="mb-1 text-2xl font-semibold text-gray-900">
                    Hey Hosts! 👋
                  </h3>
                  <p className="mb-4 text-sm text-gray-900/90">
                    Not ready to sign up? Enter your email below and we will
                    send you booking requests as they come in.
                  </p>

                  <div className="">
                    {/* City Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-900">
                        Where are your properties located?
                      </label>
                      <div className="flex gap-2">
                        <CityAutocomplete
                          value={newCity}
                          onValueChange={(value) => {
                            setNewCity(value);
                          }}
                          open={popoverOpen}
                          setOpen={setPopoverOpen}
                          // onCitySelect={(city) => { // Add onCitySelect prop
                          //   handleAddCity(city); // Call handleAddCity with selected city
                          // }}
                          trigger={({ value, disabled }) => (
                            <Input
                              // ref={ref}
                              type="text"
                              placeholder="Enter city name"
                              value={value}
                              // onFocus={() => setPopoverOpen(true)}
                              className="border-gray-900/20 bg-white text-sm text-black placeholder:text-gray-900/60" // Modified classes
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCity();
                                }
                              }}
                              disabled={disabled}
                            />
                          )}
                        />
                        <Button
                          onClick={() => handleAddCity()}
                          variant="secondary"
                          size="icon"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* City List */}
                      <div className="flex max-h-[80px] min-h-[40px] flex-wrap gap-2 overflow-y-hidden">
                        <AnimatePresence>
                          {cities.map((city, index) => (
                            <motion.div
                              key={city}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-2 px-2 py-1 text-xs"
                              >
                                {city}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => handleRemoveCity(index)}
                                />
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-900">
                        Your email address
                      </label>
                      <div className="flex flex-col gap-2">
                        {" "}
                        {/* Changed to flex-col and gap-2 */}
                        <Input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Invalid email format",
                            },
                          })}
                          type="email"
                          placeholder="name@example.com"
                          className="border-gray-900/20 bg-gray-900/20 text-sm text-gray-900 placeholder:text-gray-900/60"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">
                            {errors.email.message}
                          </p>
                        )}{" "}
                        {/* text-xs and placed below */}
                        <Button
                          className="whitespace text-sm"
                          onClick={handleSubmit(onSubmit)} // Use handleSubmit here to trigger form validation and submission
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Get Booking Requests
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          <HowTramonaWorks className="max-w-6xl" />
          <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:flex lg:space-y-8">
            <TestimonialCarousel testimonials={landingPageTestimonals} />
          </div>

          <div className="mx-2 my-12 flex flex-col items-center gap-y-20 lg:gap-y-24">
            {/* FAQ */}
            <section className="w-full space-y-8 bg-gray-50">
              <h2 className="text-center text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mx-auto max-w-2xl"
              >
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={index.toString()}>
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="text-center">
                <Link
                  href="/faq"
                  className="font-semibold text-[#004236] hover:underline"
                >
                  See full FAQ
                </Link>
              </div>
            </section>

            {/* Final CTA Banner */}
            <section className="mb-4 w-full bg-gradient-to-r from-[#004236] to-[#006a56] py-10 text-white md:mb-0">
              <div className="px-4 sm:px-6 md:px-8">
                <div className="mx-auto flex max-w-3xl flex-col gap-y-4 text-center">
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Ready to Experience the Best of Short-Term Rentals?
                  </h2>
                  <p className="mb-4 text-lg sm:text-xl">
                    Join Tramona today to access unbeatable deals on unique
                    stays or to start earning more on your empty nights.
                  </p>
                  <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Link href="/">
                      <Button className="w-full bg-white px-4 text-[#004236] hover:bg-gray-100 sm:w-auto sm:px-8">
                        Book One-of-a-Kind Prices
                      </Button>
                    </Link>
                    <Link href="/why-list">
                      <Button className="w-full bg-white px-4 text-[#004236] hover:bg-gray-100 sm:w-auto sm:px-8">
                        List Your Property
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdjustedPropertiesProvider>
  );
}
