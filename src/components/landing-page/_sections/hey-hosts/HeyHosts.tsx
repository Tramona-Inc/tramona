import { motion } from "framer-motion";
import CityAutocomplete from "@/components/_common/CityAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useState, useRef } from "react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence } from "framer-motion";

interface CityData {
  name: string;
  stateCode: string;
  country: string;
}

interface FormData {
  email: string;
  cities: CityData[];
}

export default function HeyHosts() {
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
    },
    mode: "onChange",
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [cities, setCities] = useState<CityData[]>([]);

  const cityAutocompleteRef = useRef<HTMLInputElement>(null);
  const { mutate: insertWarmLead } = api.outreach.insertWarmLead.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "We'll send you booking requests as they come in!",
      });
    },
  });

  const handleAddCity = (selectedCity?: string) => {
    let cityToAdd = newCity;
    if (selectedCity) {
      cityToAdd = selectedCity;
    }
    if (cityToAdd.trim()) {
      // Split city details, expecting "city,stateCode,country"
      const [cityName, stateCode, country] = cityToAdd
        .split(",")
        .map((s) => s.trim());
      if (cityName && !cities.some((city) => city.name === cityName)) {
        // Create a new city object
        const newCityData: CityData = {
          name: cityName,
          stateCode: stateCode ?? "",
          country: country ?? "",
        };

        // Update cities array
        const updatedCities = [...cities, newCityData];
        setCities(updatedCities);

        // Update the form state
        setValue("cities", updatedCities);
      }
      setNewCity("");
      setPopoverOpen(false);
      cityAutocompleteRef.current?.blur();
    }
  };

  const handleRemoveCity = (index: number) => {
    if (index >= 0 && index < cities.length) {
      // Create a new array without the removed city
      const updatedCities = cities.filter((_, i) => i !== index);
      setCities(updatedCities);
      // Update the form state
      setValue("cities", updatedCities);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Submitting form with data:", data);
    insertWarmLead(data);
    // Clear cities
    setCities([]);
    setValue("cities", []);
    setValue("email", "");
    setNewCity("");
    setPopoverOpen(false);
    clearErrors("email");
    cityAutocompleteRef.current?.blur();
  };

  return (
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
            Not ready to sign up? Enter your email below and we will send you
            booking requests as they come in.
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
                  onValueChange={(value) => setNewCity(value)}
                  open={popoverOpen}
                  setOpen={setPopoverOpen}
                  trigger={({ value, disabled }) => (
                    <Input
                      ref={cityAutocompleteRef}
                      type="text"
                      placeholder="Enter city name"
                      value={value}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="border-gray-900/20 bg-white text-sm text-black placeholder:text-gray-900/60"
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
              <div className="flex max-h-[80px] min-h-[40px] flex-wrap gap-2 overflow-y-auto">
                <AnimatePresence>
                  {cities.map((city, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 px-2 py-1 text-xs"
                      >
                        {city.name}
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
                <div className="relative min-h-[60px]">
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        className="border-gray-900/20 bg-white text-sm text-black placeholder:text-gray-900/60"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  className="whitespace text-sm"
                  onClick={handleSubmit(onSubmit)}
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
  );
}
