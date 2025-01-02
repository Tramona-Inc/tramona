// import MainLayout from "@/components/_common/Layout/MainLayout";
// import { Button } from "@/components/ui/button";
// import { ExternalLinkIcon } from "lucide-react";

// export default function Page() {
//   return (
//     <MainLayout>
//       <div className="flex min-h-screen-minus-header flex-col items-center justify-center gap-4">
//         <h1 className="text-center text-5xl font-bold tracking-tight">
//           Check your email
//         </h1>
//         <p className="text-muted-foreground">
//           Account successfully created! Please check your email for a secure
//           login link.
//         </p>
//         <Button asChild>
//           <a href="https://mail.google.com" target="_blank" rel="noreferrer">
//             Open Gmail <ExternalLinkIcon className="h-4 w-4" />
//           </a>
//         </Button>
//       </div>
//     </MainLayout>
//   );
// }

import { useEffect, useState } from "react";
import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function Page() {
  const router = useRouter();
  const { email } = router.query;
  const [verified, setVerified] = useState(false);

  const { data: getVerification } = api.auth.checkEmailVerification.useQuery(
    { email: email as string },
    { enabled: !!email },
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (getVerification?.emailVerified) {
        setVerified(true);
        clearInterval(interval);
        void router.push("/auth/signin?isVerified=true"); // Redirect to the dashboard or another page
      }
    }, 1000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [getVerification, router]);

  return (
    <MainLayout className="flex flex-col justify-center">
      <div className="min-h-screen-minus-header flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-center text-5xl font-bold tracking-tight">
          Check your email
        </h1>
        <p className="text-center text-muted-foreground">
          Account successfully created! Please check your email for a secure
          login link.
        </p>
        <Button asChild>
          <a href="https://mail.google.com" target="_blank" rel="noreferrer">
            Open Gmail <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </Button>
        {verified && (
          <p className="text-green-500">Email verified! Redirecting...</p>
        )}
      </div>
    </MainLayout>
  );
}
