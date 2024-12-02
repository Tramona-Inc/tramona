import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import PaymentHistory from "@/components/host/finances/payment-history/PaymentHistory";
import FinancesSummary from "@/components/host/finances/summary/FinancesSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import {
    ConnectAccountOnboarding,
    ConnectNotificationBanner,
    ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import { useRouter } from "next/router";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 确保路径正确

export default function Page() {
    const router = useRouter();
    const hostStripeConnectId = `acct_${router.query.id as string}`;

    useSession({ required: true });
    const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
    const { data: hostInfo, isLoading: isHostInfoLoading } = api.host.getUserHostInfo.useQuery();
    const { data: user, isLoading: isUserLoading } = api.users.getUser.useQuery();

    return (
        <DashboadLayout>
            <Head>
                <title>Host Finances | Tramona</title>
            </Head>

            <main className="container mb-24 flex w-11/12 flex-col gap-y-3">
                <h2 className="fond-black ml-4 mt-7 text-left text-4xl tracking-tight">
                    Finances
                </h2>

                {isStripeConnectInstanceReady && (
                    <ConnectNotificationBanner
                        collectionOptions={{
                            fields: "eventually_due",
                            futureRequirements: "include",
                        }}
                    />
                )}

                {isStripeConnectInstanceReady ? (
                    <Tabs defaultValue="summary" className="space-y-10">
                        <TabsList className="text-blue-200">
                            <TabsTrigger
                                className="data-[state=active]:border-primaryGreen data-[state=active]:text-primaryGreen data-[state=inactive]:text-zinc-400"
                                value="summary"
                            >
                                Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="paymentHistory"
                                className="text-primaryGreen data-[state=active]:border-primaryGreen data-[state=inactive]:text-zinc-400"
                            >
                                Payment History
                            </TabsTrigger>
                            <TabsTrigger
                                value="Settings"
                                className="text-primaryGreen data-[state=active]:border-primaryGreen data-[state=inactive]:text-zinc-400"
                            >
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary">
                            {isHostInfoLoading ? (
                                <div className="space-y-4">
                                    <SkeletonText className="w-1/3" />
                                    <SkeletonText className="w-2/3" />
                                    <SkeletonText className="w-full" />
                                </div>
                            ) : (
                                <FinancesSummary
                                    hostStripeConnectId={hostStripeConnectId}
                                    isStripeConnectInstanceReady={isStripeConnectInstanceReady}
                                    becameHostAt={hostInfo?.becameHostAt}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="paymentHistory">
                            {isUserLoading ? (
                                <div className="space-y-4">
                                    <SkeletonText className="w-1/3" />
                                    <SkeletonText className="w-full" />
                                    <Skeleton className="w-full h-16" />
                                </div>
                            ) : (
                                <PaymentHistory />
                            )}
                        </TabsContent>

                        <TabsContent value="Settings">
                            <div className="flex justify-around">
                                {isUserLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="w-20 h-20 rounded-full" />
                                        <SkeletonText className="w-1/3" />
                                    </div>
                                ) : user?.stripeConnectId && user.chargesEnabled ? (
                                    <div className="relative my-3 flex w-full flex-row items-center justify-around gap-x-10">
                                        <ConnectAccountManagement
                                            collectionOptions={{
                                                fields: "eventually_due",
                                                futureRequirements: "include",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        {!user?.stripeConnectId && <NoStripeAccount />}
                                        <ConnectAccountOnboarding
                                            onExit={() => {
                                                window.location.reload(); //default behavior we should change if ugly
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <NoStripeAccount />
                )}
            </main>
        </DashboadLayout>
    );
}
