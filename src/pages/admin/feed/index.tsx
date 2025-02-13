import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import Head from "next/head";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { create } from "zustand";

interface HostState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useHostStore = create<HostState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
}));

interface Host {
  userId: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  becameHostAt?: Date;
  firstName?: string | null;
  lastName?: string | null;
}

interface HostTeam {
  id: number;
  name: string;
  createdAt: Date;
  ownerId: string;
}

export default function Page() {
  const { data: hosts } = api.hosts.getAllHosts.useQuery();
  const searchTerm = useHostStore((state) => state.searchTerm);

  const filteredHosts = hosts
    ? hosts.filter((host) => {
        const fullName = (host.firstName || "") + " " + (host.lastName || "");
        return host.email.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <DashboardLayout>
      <Head>
        <title>Host Feed | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="py-4 text-3xl font-bold text-black">Hosts Feed</h1>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-sm font-semibold text-zinc-600">
            {filteredHosts?.length}
          </span>
          <div className="mb-4" />
          <HostSearchBar />
          {hosts ? (
            <table className="mt-4 min-w-full">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    Email
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    ID
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    Phone Number
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHosts.map((host) => (
                  <tr key={host.userId}>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {(host.firstName ?? host.lastName)
                        ? (host.firstName ? host.firstName : "") +
                          (host.lastName ? " " + host.lastName : "")
                        : "N/A"}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {host.email}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {host.userId}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {host.phoneNumber}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {host.becameHostAt
                        ? new Date(host.becameHostAt)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      <HostTeams hostUserId={host.userId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// component for the view details dialog
function HostTeams({ hostUserId }: { hostUserId: string }) {
  const { data: hostTeams } = api.hostTeams.getHostTeamsByUserId.useQuery({
    userId: hostUserId,
  });

  return (
    <Dialog>
      <DialogTrigger>View Details</DialogTrigger>
      <DialogContent>
        {(() => {
          return (
            <>
              <h2 className="text-lg font-semibold">All Associated Teams:</h2>
              <ul className="list-disc pl-5">
                {hostTeams && hostTeams.length > 0 ? (
                  hostTeams.map((team) => (
                    <li key={team.id} className="py-1">
                      {team.name} (ID: {team.id})
                    </li>
                  ))
                ) : (
                  <li>No teams found for this host.</li>
                )}
              </ul>
            </>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}

// host search component
const HostSearchBar = () => {
  const { searchTerm, setSearchTerm } = useHostStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring"
      />
    </div>
  );
};
