import CardSelect from "@/components/_common/CardSelect";
import Alternative from "@/components/_icons/Alternative";
import ApartmentIcon from "@/components/_icons/Apartment";
import Home from "@/components/_icons/Home";
import Hotels from "@/components/_icons/Hotels";

const options = [
  {
    id: "apartment",
    icon: <ApartmentIcon />,
    title: "Apartment",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
  {
    id: "home",
    icon: <Home />,
    title: "Home",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
  {
    id: "hotels",
    icon: <Hotels />,
    title: "Hotels, B&Bs, & More",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
  {
    id: "alternative places",
    icon: <Alternative />,
    title: "Alternative Places",
    text: "Furnished and self-catering accommodations where guests rent the entire place",
  },
];

export default function Onboarding2() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <h1 className="text-4xl font-bold">
        Which of these describes your property?
      </h1>
      <div className="mb-5 flex flex-col gap-5">
        {options.map((item) => (
          <CardSelect key={item.title} title={item.title} text={item.text}>
            {item.icon}
          </CardSelect>
        ))}
      </div>
    </div>
  );
}
