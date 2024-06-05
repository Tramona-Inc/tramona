import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRange } from "@/utils/utils";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";
import { type DateRange } from "react-day-picker";
import { isSameDay } from "date-fns";
import { Card,
  CardContent
 } from '@/components/ui/card'
 import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
//  import {} from '@/components/'
 import { Calendar as Cal } from 'lucide-react';
 import {Carousel,CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel'
import { useMediaQuery } from "@/components/_utils/useMediaQuery";

export default function DateRangeInput({
  className,
  label,
  placeholder = "Select dates",
  variant,
  icon,
  disablePast = false,
  disabledDays = [],
  value,
  onChange,
}: {
  propertyId?: number;
  className?: string;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  disablePast?: boolean;
  disabledDays?: Date[];
  value?: DateRange;
  onChange: (value?: DateRange) => void;
}) {
  function dateIsDisabled(date: Date) {
    if (date < new Date() && disablePast) return true;

    if (disabledDays.some((d) => isSameDay(date, d))) return true;

    // date is unreachable (there is a disabled day between it and the selected date)
    return disabledDays.some((d) => {
      if (value?.from === undefined) return false;
      return (value.from <= d && d <= date) || (date <= d && d <= value.from);
    });
  }

  const isMobile = useMediaQuery("(max-width: 768px)");
  const date = new Date();
  const monthArr = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear() 
  const result: {monthNumber: number, month: string, year: number}[] = []
  let i = 0;
  let j = 12 - (currentMonth % 12);
  // while(i+currentMonth%12 > 0) {
  //   result.push({monthNumber:currentMonth-i, month: monthArr[currentMonth-1] ?? "Jan", year: currentYear})
  //   i++;
  // }
  for(i = 0;i < j; i++){
    result.push({monthNumber:currentMonth+i, month: monthArr[currentMonth+i] ?? "Jan", year: currentYear})
  }
  for(i = 0; i<currentMonth; i++){
    result.push({monthNumber: i+1, month: monthArr[i] ?? "Jan", year: currentYear+1})
  }
  console.log(result)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputButton
          withClearBtn
          className={className}
          placeholder={placeholder}
          variant={variant}
          label={label}
          icon={icon}
          value={value?.from && formatDateRange(value.from, value.to)}
          setValue={onChange}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 backdrop-blur-md"
        align="start"
        side="top"
      >

        <Card className="w-full"> 
            <Tabs defaultValue="CheckIn" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-300" noBorder={true}>
                {/* <TabsTrigger value="CheckIn" className="rounded-full bg-white mx-1 my-1">Check In</TabsTrigger> */}
                <TabsTrigger value="CheckIn" noBorder={true} className="hover:bg-slate-200 hover:rounded-full hover:mx-2 hover:my-2 data-[state=active]:rounded-full data-[state=active]:bg-white data-[state=active]:mx-2 data-[state=active]:my-2 ">Check In</TabsTrigger>
                <TabsTrigger value="Flexible" noBorder={true} className="hover:bg-slate-200 hover:rounded-full hover:mx-2 hover:my-2 data-[state=active]:rounded-full data-[state=active]:bg-white data-[state=active]:mx-2 data-[state=active]:my-2 ">Flexible</TabsTrigger>
              </TabsList>
              <TabsContent value="CheckIn" className="w-full">
                {}
              <CardContent className="justify-center">
                
                {!isMobile ? 
                <Calendar
                mode="range"
                selected={value}
                onSelect={(e) => {
                if (e?.from && e.to === undefined) {
                e.to = e.from;
                }
                onChange(e);
                }}
                disabled={dateIsDisabled}
                numberOfMonths={2}
                showOutsideDays={true}
                className="h-80"
                />
                :
                <Calendar
                mode="range"
                selected={value}
                onSelect={(e) => {
                if (e?.from && e.to === undefined) {
                e.to = e.from;
                }
                onChange(e);
                }}
                disabled={dateIsDisabled}
                numberOfMonths={1}
                showOutsideDays={true}
                className="h-full"
                />
                }
              </CardContent>
              </TabsContent>
              <TabsContent value="Flexible" className="w-full">
              <CardContent>
              {!isMobile ? 
                  <div className="flex flex-col justify-center items-center h-80 w-[500px]">
                    <Tabs defaultValue="week">
                      <TabsContent value="weekend" className="flex-1 justify-center">
                        <h3 className="text-center my-1">Stay for a weekend</h3>
                      </TabsContent>
                      <TabsContent value="week" className="flex-1 justify-center">
                        <h3 className="text-center my-1">Stay for a week</h3>
                      </TabsContent>
                      <TabsContent value="month" className="flex-1 justify-center">
                        <h3 className="text-center my-1">Stay for a month</h3>
                      </TabsContent>
                      <TabsList noBorder={true} className="space-x-2">
                        <TabsTrigger noBorder={true} className="p-2 px-2 hover:rounded-full border rounded-full data-[state=active]:border-black" value="weekend">Weekend</TabsTrigger>
                        <TabsTrigger noBorder={true} className="p-2 px-2 hover:rounded-full border rounded-full data-[state=active]:border-black" value="week">Week</TabsTrigger>
                        <TabsTrigger noBorder={true} className="p-2 px-2 hover:rounded-full border rounded-full data-[state=active]:border-black" value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <Carousel className="w-full max-w-sm mt-8">
                    <CarouselContent>
                      {result.map((_, index) => {
                        console.log(result.length)
                        return(
                          <>
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="flex flex-row items-centers">
                            <Card className="w-28 items-center" >
                              <CardContent>
                                <div className="justify-center"><Cal className="mx-auto"/></div>
                                <h4 className="text-center">{_.month}</h4>
                                <p className="text-center">{_.year}</p>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                        </>
                        )})}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div> :
                  <div className="flex flex-col justify-center items-center h-80 w-[300px]">
                  <Tabs defaultValue="week">
                    <TabsContent value="weekend" className="flex-1 justify-center">
                      <h3 className="text-center my-1">Stay for a weekend</h3>
                    </TabsContent>
                    <TabsContent value="week" className="flex-1 justify-center">
                      <h3 className="text-center my-1">Stay for a week</h3>
                    </TabsContent>
                    <TabsContent value="month" className="flex-1 justify-center">
                      <h3 className="text-center my-1">Stay for a month</h3>
                    </TabsContent>
                    <TabsList noBorder={true} className="space-x-2">
                      <TabsTrigger noBorder={true} className="p-2 px-2 hover:rounded-full border rounded-full data-[state=active]:border-black" value="weekend">Weekend</TabsTrigger>
                      <TabsTrigger noBorder={true} className="p-2 px-2 hover:rounded-full border rounded-full data-[state=active]:border-black" value="week">Week</TabsTrigger>
                      <TabsTrigger noBorder={true} className="p-2 px-2 hover:rounded-full border rounded-full data-[state=active]:border-black" value="month">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Carousel className="w-screen mt-8">
                  <CarouselContent>
                    {result.map((_, index) => {
                      console.log(result.length)
                      return(
                        <>
                      <CarouselItem key={index} className="basis-1/4">
                        <div className="flex flex-row items-centers">
                          <Card className="items-center data-[state=active]:border-black">
                            <CardContent>
                              <div className="justify-center"><Cal className="mx-auto"/></div>
                              <h4 className="text-center">{_.month}</h4>
                              <p className="text-center">{_.year}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                      </>
                      )})}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
                }
                </CardContent>
              </TabsContent>
            </Tabs>
        </Card>
        
      </PopoverContent>
    </Popover>
  );
}
