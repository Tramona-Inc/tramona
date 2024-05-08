function OfferDetails() {
  return (
    <div>
      <section className="flex flex-col">
        <h2>Counter offer details</h2>
        <div className="flex w-full flex-row">
          <div className="h-[200px] w-[200px]" />
          <div className="flex flex-col">
            <h3>Property title</h3>
            <p>Airbnb Price: </p>
            <p>Check-in/Check-out:</p>
            <div className="flex flex-row">
              <div>Host Counter Offer</div>
              <div>Your Offer: </div>
            </div>
          </div>
        </div>
        <section>
          <div className="flex flex-row justify-between">
            <p>Counter offer price:</p>
            <p>Price</p>
          </div>
          <div className="flex flex-row justify-between">
            <p>Taxes</p>
            <p>Price</p>
          </div>
          <div className="flex flex-row justify-between">
            <p>Counter offer toal</p>
            <p>Price</p>
          </div>
        </section>
      </section>
    </div>
  );
}

function ReviewProperty() {
  return (
    <div className="flex w-full flex-col">
      <h1 className="text-center">Reivew counter offer</h1>
      <OfferDetails />
    </div>
  );
}

export default function CounterForm() {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="h-full w-1/2">
        <ReviewProperty />
      </div>
      <div className="h-full w-1/2 bg-red-300"> test</div>
    </div>
  );
}
