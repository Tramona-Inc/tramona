type Props = {
  options: Array<number>;
};

export default function Modals(props: Props) {
  const { options } = props;
  return (
    <div className="flex flex-col items-center justify-center bg-white py-24">
      {options.map((item, index) => {
        return index % 2 ? (
          <div className="my-8 flex w-10/12 flex-row rounded-3xl">
            <div className="mx-4 flex basis-1/2 flex-col items-center justify-center">
              <div className="my-2 text-left text-4xl font-bold">
                Enjoy Less Vacancies!
              </div>
              <div className="w-3/4 font-sans text-base leading-7">
                Say goodbye to empty short term rentals with Tramona. We match
                your property with eager travelers, reducing vacancies. Simple
                listings, targeted marketing, and guaranteed bookings mean more
                profit for you. Join us and turn your empty slots into
                consistent income
              </div>
            </div>
            <div className="flex basis-1/2 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-96 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                src="https://images.unsplash.com/photo-1564613469739-c78f970f9c17?q=80&w=2947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="image description"
              />
            </div>
          </div>
        ) : (
          <div className="my-8 flex w-10/12 flex-row rounded-3xl">
            <div className="flex basis-1/2 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-96 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                src="https://images.unsplash.com/photo-1491403865995-cda9c458c314?q=80&w=2855&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="image description"
              />
            </div>
            <div className="mx-4 flex basis-1/2 flex-col items-center justify-center">
              <div className="my-2 text-left text-4xl font-bold">
                Make More Money!
              </div>
              <div className="w-3/4 font-sans text-base leading-7">
                Tramona is your tool to get more money. We connect you with
                ready-to-book travelers through our Name Your Own Price tool,
                ensuring your properties are always occupied. Our network of
                partner hosts guarantees you get the best deals, maximizing your
                revenue effortlessly.
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
