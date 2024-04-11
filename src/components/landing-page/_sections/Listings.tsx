import HomeOfferCard from "../HomeOfferCard";

export default function Listings() {
  const cards = Array.from({ length: 10 }, (_, index) => (
    <HomeOfferCard key={index} />
  ));

  return <div className="grid grid-cols-6 gap-10 gap-y-10">{cards}</div>;
}
