import MainLayout from "@/components/_common/Layout/MainLayout";

export default function Page() {
  // const router = useRouter();
  // const {email} = router.query;
  // const [verified, setVerified] = useState(false);

  // const { data: getVerification } = api.auth.checkEmailVerification.useQuery(
  //   { email: email as string },
  //   { enabled: !!email }
  // );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (getVerification?.emailVerified) {
  //       setVerified(true);
  //       clearInterval(interval);
  //       void router.push("/auth/signin?isVerified=true"); // Redirect to the dashboard or another page
  //     }
  //   }, 1000); // Poll every 5 seconds

  //   return () => clearInterval(interval); // Clean up the interval on component unmount
  // }, [getVerification, router]);

  return (
    <MainLayout className="flex flex-col justify-center">
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center gap-4">
        <h1 className="text-center text-5xl font-bold tracking-tight">
          Email Successfully Verified! You can now close this page.
        </h1>
      </div>
    </MainLayout>
  );
}
