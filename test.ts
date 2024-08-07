import { getCoordinates } from "@/server/google-maps";

const a = await getCoordinates("austin");

console.log(a);
