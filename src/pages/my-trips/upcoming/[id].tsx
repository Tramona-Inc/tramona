import router from "next/router";

export default function Upcoming() {
  const id = router.query.id;

  return <div>{id}</div>;
}
