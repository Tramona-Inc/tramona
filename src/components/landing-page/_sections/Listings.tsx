import HomeOfferCard from "../HomeOfferCard";

export default function Listings() {
  const cards = Array.from({ length: 10 }, (_, index) => (
    <HomeOfferCard key={index} />
  ));

  return (
    <div className="grid gap-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {cards}
    </div>
  );
}
