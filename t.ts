import { env } from "@/env";
import { googleMaps } from "@/server/google-maps";

await googleMaps
  .geocode({
    params: {
      address: "Ireland",
      key: env.GOOGLE_MAPS_KEY,
    },
  })
  .then((res) => console.log(JSON.stringify(res.data.results, null, 2)));
