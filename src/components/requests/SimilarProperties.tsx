interface SimilarPropertiesProps {
  locations: string[] | undefined;
}

function SimiliarProperties({ locations }: SimilarPropertiesProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">See Similar Properties in Blank </h1>
      <p>
        {" "}
        Submit bids while waiting for your request to increase your chance of
        getting a great deal.
      </p>
      <div>{locations!.map((location) => location)}</div>
    </div>
  );
}

export default SimiliarProperties;
