import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';

export default function CheckingHospitableStatus() {
  const router = useRouter();
  const { data: session } = useSession({ required: true });
  const { data: isUserHostTeamOwner } = api.hostTeams.isUserHostTeamOwner.useQuery(
    { userId: session?.user.id ?? "" },
    { enabled: !!session }
  );

  useEffect(() => {
    if (isUserHostTeamOwner !== undefined) {
      if (isUserHostTeamOwner) {
        router.push("/load-airbnb-properties");
      } else {
        router.push("/why-list");
      }
    }
  }, [isUserHostTeamOwner, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <Loader2 className="mx-auto mb-4 h-12 w-12 text-blue-500 animate-spin" />
        <h2 className="text-xl font-semibold text-gray-700">
          Analyzing Results
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we check the hospitable status
        </p>
      </div>
    </div>
  );
}