import { useRouter } from "next/router";

export default function Success() {
  // TODO: on sucess dispaly data
  const router = useRouter();
  const sessionId = useRouter().query.session_id as string;

  return <div></div>;
}
