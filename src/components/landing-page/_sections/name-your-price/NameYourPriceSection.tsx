
import Typewriter from "typewriter-effect";
import CityRequestFormContainer from "../../SearchBars/CityRequestFormContainer";

export function NameYourPriceSection() {
  return (
    <div className="mt-12 flex flex-col items-center gap-y-20 lg:gap-y-24">
      <div className="flex w-full flex-col items-center gap-y-4">
        <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold text-primaryGreen lg:text-4xl">
          Name your own Price
        </h1>

        {/* <div style="background-color: var(--background);">Test Background</div> */}
        <p className="text-lg font-semibold text-muted-foreground lg:block lg:text-xl">
          Send a request to every host in{" "}
          <span className="font-bold text-primaryGreen">
            <Typewriter
              component={"span"}
              options={{
                strings: ["SEATTLE", "PARIS", "MIAMI", "ANY CITY"],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </p>
        <CityRequestFormContainer />
      </div>
    </div>
  );
}
