import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import supabase from "@/utils/supabase-client";

export default function CheckingHospitableStatus() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [hasHostTeamCreatedEvent, setHasHostTeamCreatedEvent] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing Results");
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const { data: isUserHostTeamOwner, refetch: refetchIsUserHostTeamOwner } =
    api.hostTeams.isUserHostTeamOwner.useQuery( // Keep this tRPC query for ownership check
      { userId: session?.user.id ?? "" },
      { enabled: false },
    );

  useEffect(() => {
    if (status === "authenticated") {
      setIsSessionLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoadingMessage("Timeout Expired. Redirecting...");
      router.push("/why-list");
    }, 60000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const checkHostTeamOwnership = async () => {
      if (hasHostTeamCreatedEvent) {
        setLoadingMessage("Checking Host Team Ownership...");
        await refetchIsUserHostTeamOwner().then(() => {
          setLoadingMessage("Redirecting...");
          if (isUserHostTeamOwner) {
            router.push("/load-airbnb-properties");
          } else {
            router.push("/why-list");
          }
        });
      }
    };
    void checkHostTeamOwnership();
  }, [
    hasHostTeamCreatedEvent,
    isUserHostTeamOwner,
    refetchIsUserHostTeamOwner,
    router,
  ]);

  useEffect(() => {
    if (isSessionLoaded && session?.user.id) {
      const channel = supabase.channel('host_teams_channel'); // Match channel name from trigger

      channel.on('postgres_changes', {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE on this channel) - or 'INSERT' specifically if you only care about creation
        schema: 'public', // Your database schema (usually 'public')
        table: 'host_teams', // Your host teams table name
      },
      (payload) => {
        if (payload.eventType === 'INSERT' && payload.new.owner_id === session.user.id) { // Adjust based on your payload structure and logic
          setHasHostTeamCreatedEvent(true);
          setLoadingMessage("Host Team Created Event Received (Supabase Realtime)...");
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      })
      .subscribe();

      return () => {
        void supabase.removeChannel(channel); // Unsubscribe on component unmount
      };
    }
  }, [isSessionLoaded, session?.user.id, supabase]); // supabase client as dependency

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-700">
          {loadingMessage}
        </h2>
        <p className="mt-2 text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}