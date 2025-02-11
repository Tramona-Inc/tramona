import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import Head from "next/head";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import { data } from "node_modules/cheerio/dist/esm/api/attributes";

interface Host {
    userId: string;
    name: string | null;
    email: string;
    phoneNumber: string | null;
    becameHostAt?: Date;
}

interface HostTeam {
    id: number;
    name: string;
    createdAt: Date;
    ownerId: string;
}

export default function Page() {
    const { data: hosts } = api.hosts.getAllHosts.useQuery();
    const [selectedHost, setSelectedHost] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Use the query hook directly
    const { data: hostTeams } = api.hostTeams.getHostTeamsByUserId.useQuery(
        { userId: selectedHost! },
        { enabled: !!selectedHost } // Only run query when we have a selectedHost
    );


    const handleViewDetails = (host: Host) => {
        setSelectedHost(host.userId);
        setIsDialogOpen(true);
        console.log("Host teams: ", hostTeams, "isDialogOpen: ", isDialogOpen)
    };

    return (
        <DashboardLayout>
            <Head>
                <title>Host Feed | Tramona</title>
            </Head>
            <div className="px-4 pb-64 pt-16">
                <div className="mx-auto max-w-5xl">
                    <h1 className="py-4 text-3xl font-bold text-black">Hosts Feed</h1>
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-sm font-semibold text-zinc-600">
                        {hosts?.length}
                    </span>

                    {hosts ? (
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Name</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Email</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Phone Number</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hosts.map((host) => (
                                    <tr key={host.userId}>
                                        <td className="border-b border-gray-200 px-4 py-2">{host.name}</td>
                                        <td className="border-b border-gray-200 px-4 py-2">{host.email}</td>
                                        <td className="border-b border-gray-200 px-4 py-2">{host.phoneNumber}</td>
                                        <td className="border-b border-gray-200 px-4 py-2">{host.becameHostAt ? new Date(host.becameHostAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border-b border-gray-200 px-4 py-2">
                                            <button
                                                className="inline-block rounded bg-teal-900 px-4 py-2 font-bold text-white no-underline"
                                                onClick={() => handleViewDetails(host)}
                                            >
                                                View Details
                                            </button>
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogTitle>Host Teams</DialogTitle>
                <DialogDescription>
                    <DialogContent>
                        <h2 className="text-lg font-semibold">Host Teams:</h2>
                        <ul className="list-disc pl-5">
                            {hostTeams && hostTeams.length > 0 ? (
                                hostTeams.map((team) => (
                                    <li key={team.id} className="py-1">{team.name}</li>
                                ))
                            ) : (
                                <li>No teams found for this host.</li>
                            )}
                        </ul>
                    </DialogContent>
                </DialogDescription>
                <DialogClose>Close</DialogClose>
            </Dialog>
        </DashboardLayout>
    );
} 