import { getNumNights } from "@/utils/utils";

interface RandomUserResponse {
  results: {
    name: {
      first: string;
      last: string;
    };
    picture: {
      medium: string;
    };
  }[];
}

export async function createUserNameAndPic(
  quantity?: number,
): Promise<{ name: string; picture: string }[]> {
  try {
    const response = await fetch(
      "https://randomuser.me/api/?nat=us,ca,mx,gb&inc=name,picture" +
        (quantity ? `&results=${quantity}` : ""),
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = (await response.json()) as RandomUserResponse;
    if (data.results.length > 0) {
      if (quantity) {
        return data.results.map((user) => ({
          name: user.name.first + " " + user.name.last,
          picture: user.picture.medium,
        }));
      } else {
        const user = data.results[0];
        if (user) {
          return [
            {
              name: user.name.first + " " + user.name.last,
              picture: user.picture.medium,
            },
          ];
        } else {
          throw new Error("No random user results found");
        }
      }
    } else {
      throw new Error("No random user results found");
    }
  } catch (error) {
    console.error("Error fetching random user:", error);
    throw new Error("Error fetching random use");
  }
}

export function createRandomDate() {
  const today = new Date();
  const futureDate = new Date(
    today.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000,
  ); // Random date within next 90 days
  const startDate = new Date(futureDate);
  const endDate = new Date(
    startDate.getTime() +
      (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000,
  ); // 1-7 days after start date

  return {
    checkIn: startDate.toISOString().split("T")[0],
    checkOut: endDate.toISOString().split("T")[0],
  };
}

export function createCreationTime() {
  const padHourInDatetime = (datetime: string) => {
    // Split the date and time parts
    const [datePart, timePart] = datetime.split("T");
    // Split the time part into hours, minutes, and seconds
    if (!timePart) throw new Error("Invalid datetime string");
    // eslint-disable-next-line prefer-const
    let [hours, minutes, seconds] = timePart.split(":");
    // Pad the hours if it's a single digit
    if (!hours) throw new Error("Invalid time string");
    hours = hours.padStart(2, "0");
    // Construct the new datetime string
    return `${datePart}T${hours}:${minutes}:${seconds}`;
  };
  const now = new Date();
  const pastTime = new Date(
    now.getTime() - Math.random() * 24 * 60 * 60 * 1000,
  ); // Random time within past 24 hours
  const randonPastTime = pastTime
    .toLocaleString("sv-SE", { timeZoneName: "short" })
    .replace(" ", "T")
    .slice(0, 19)
    .trim(); // Convert to local time, Format as "YYYY-MM-DDTHH:mm:ss(s)"
  return padHourInDatetime(randonPastTime);
}

export function randomizeLocationAndPrice(
  locationAndPrices: {
    location: string;
    maxTotalPrice: number;
    checkIn: Date;
    checkOut: Date;
  }[],
) {
  // select a random pair of location and price from the list of passed in values
  if (locationAndPrices.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * locationAndPrices.length);
  const realLocationAndPrice = locationAndPrices[randomIndex];
  const location = realLocationAndPrice?.location;
  let nightlyPrice = 0;
  if (realLocationAndPrice?.maxTotalPrice) {
    const realNightlyPrice =
      realLocationAndPrice.maxTotalPrice /
      getNumNights(
        realLocationAndPrice.checkIn,
        realLocationAndPrice.checkOut,
      ) /
      100;
    const randomNightlyPrice = Math.floor(
      realNightlyPrice * (1 + (Math.random() * 0.6 - 0.3)),
    ); // Random price within +/- 30% of the real price
    nightlyPrice = Math.round((randomNightlyPrice * 100) / 10) * 10; // convert to cent, then round the randomNightlyPrice to the nearest 10
  }
  return { location: location, nightlyPrice: nightlyPrice };
}
