import MainLayout from "@/components/layouts/MainLayout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <MainLayout>
      <p className="p-8">
        <Message />
      </p>
    </MainLayout>
  );
}

function Message() {
  const { data: session, status } = useSession();
  const { data: userDetails } = api.users.me.useQuery();

  switch (status) {
    case "loading":
      return <>loading...</>;
    case "unauthenticated":
      return <>you are not logged in</>;
    case "authenticated":
      return (
        <>
          hello {session.user.name} you are a {userDetails?.role ?? "..."}
        </>
      );
  }
}
