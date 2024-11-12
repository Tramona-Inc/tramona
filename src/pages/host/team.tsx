import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MessageSquare,
  Users,
  Check,
  X,
  Trash2,
  Shield,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import UserAvatar from "@/components/_common/UserAvatar";
import { useState } from "react";
import { COHOST_ROLES, CoHostRole } from "@/server/db/schema/tables/hostTeams";
import Spinner from "@/components/_common/Spinner";
import { formatDistanceToNowStrict } from "date-fns";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";
import { zodEmail } from "@/utils/zod-utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";

const roleDescriptions = {
  "Match Manager": {
    title: "Match Manager",
    description:
      "Manage bookings, respond to requests, and handle availability.",
    icon: <Calendar className="size-4" />,
    color: "bg-blue-100 text-blue-800",
    checkColor: "text-blue-500",
    xColor: "text-blue-300",
    can: [
      "Accept or reject booking requests",
      "Adjust property availability",
      "Modify pricing for specific dates",
      "Communicate with potential guests",
    ],
    cant: [
      "Edit property details or photos",
      "Access financial information",
      "Modify overall pricing strategy",
    ],
  },
  "Listing Manager": {
    title: "Listing Manager",
    description: "Manage guest communications and property details.",
    icon: <MessageSquare className="size-4" />,
    color: "bg-green-100 text-green-800",
    checkColor: "text-green-500",
    xColor: "text-green-300",
    can: [
      "Update property descriptions and amenities",
      "Manage property photos",
      "Respond to guest inquiries",
      "Coordinate check-ins and check-outs",
    ],
    cant: [
      "Accept or reject booking requests",
      "Modify pricing or availability",
      "Access financial reports",
    ],
  },
  "Admin Access": {
    title: "Admin Access",
    description:
      "Provides full access to manage both booking and operational tasks.",
    icon: <Shield className="size-4" />,
    color: "bg-purple-100 text-purple-800",
    checkColor: "text-purple-500",
    xColor: "text-purple-300",
    can: [
      "All Match Manager permissions",
      "All Listing Manager permissions",
      "View financial reports",
      "Modify overall pricing strategy",
    ],
    cant: [
      "Access or modify payment information",
      "Delete the property listing",
      "Change the primary host",
    ],
  },
} as const;

const inviteSchema = z.object({
  email: zodEmail(),
  role: z.enum(COHOST_ROLES),
});

export default function Component() {
  const { data: session } = useSession({ required: true });
  const { data: hostProfile } = api.hosts.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();

  const curTeam =
    hostProfile && hostTeams?.find((team) => team.id === hostProfile.curTeamId);

  const updateRoleMutation = api.hostTeams.updateCoHostRole.useMutation();

  const inviteMutation = api.hostTeams.inviteCoHost.useMutation();

  const resendInviteMutation = api.hostTeams.resendInvite.useMutation();

  const cancelInviteMutation = api.hostTeams.cancelInvite.useMutation();

  const removeHostTeamMemberMutation =
    api.hostTeams.removeHostTeamMember.useMutation();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const form = useZodForm({
    schema: inviteSchema,
    defaultValues: {
      role: "Match Manager",
    },
  });

  const onSubmit = form.handleSubmit(async ({ email, role }) => {
    await inviteMutation
      .mutateAsync({ email, role })
      .then(({ status }) => {
        console.log(status);
        switch (status) {
          case "sent invite":
            toast({
              title: `Emailed an invite to ${email}`,
              description: "The invite will expire in 24 hours",
            });
            form.reset();

            break;

          case "already in team":
            form.setError("email", { message: "User is already in the team" });
            break;

          case "already invited":
            form.setError("email", { message: "User is already invited" });
            break;
        }

        setInviteDialogOpen(false);
      })
      .catch(() => errorToast());
  });

  if (!session || !curTeam) return <Spinner />;

  const CoHostsList = () => (
    <div className="min-h-40 space-y-4">
      <CardTitle>Current Co-Hosts</CardTitle>
      {curTeam.members.map((member) => (
        <div key={member.userId} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar {...member.user} />
            <div>
              <div className="font-medium">{member.user.name}</div>
              <div className="text-sm text-muted-foreground">
                {member.user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={member.role}
              onValueChange={(newRole) => {
                updateRoleMutation
                  .mutateAsync({
                    userId: member.userId,
                    role: newRole as CoHostRole,
                    hostTeamId: curTeam.id,
                  })
                  .then(() => {
                    toast({
                      title: "Role updated",
                      description:
                        "The co-host's role has been updated successfully",
                    });
                  })
                  .catch(() => errorToast());
              }}
              disabled={
                updateRoleMutation.isLoading ||
                member.userId === curTeam.ownerId
              }
            >
              <SelectTrigger className="w-48 pl-2">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-1.5 ${roleDescriptions[member.role].color}`}
                    >
                      {roleDescriptions[member.role].icon}
                    </div>
                    <span>{roleDescriptions[member.role].title}</span>
                  </div>
                </SelectValue>
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDescriptions).map(
                  ([role, { title, icon, color }]) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full p-1.5 ${color}`}>
                          {icon}
                        </div>
                        <span>{title}</span>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            {member.userId !== curTeam.ownerId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  removeHostTeamMemberMutation
                    .mutateAsync({
                      memberId: member.userId,
                      hostTeamId: curTeam.id,
                    })
                    .then(() => {
                      toast({
                        title: "Member removed",
                        description:
                          "The team member has been removed successfully",
                      });
                    })
                    .catch(() => errorToast());
                }}
                disabled={removeHostTeamMemberMutation.isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const PendingInvitesList = () => (
    <div className="min-h-40 space-y-4">
      <CardTitle>Pending Invites</CardTitle>
      <CardContent>
        {curTeam.invites.length === 0 ? (
          <p className="text-pretty py-16 text-center text-sm text-zinc-500">
            No pending invites, invite co-hosts by email with the form above
          </p>
        ) : (
          <div className="divide-y">
            {curTeam.invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <div className="font-medium">{invite.inviteeEmail}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className={`rounded-full p-1.5 ${roleDescriptions[invite.role].color}`}
                    >
                      {roleDescriptions[invite.role].icon}
                    </div>
                    <span>{roleDescriptions[invite.role].title}</span>
                    <span>·</span>
                    <span>
                      Expires{" "}
                      {formatDistanceToNowStrict(invite.expiresAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        resendInviteMutation
                          .mutateAsync({
                            email: invite.inviteeEmail,
                            hostTeamId: curTeam.id,
                          })
                          .then((res) => {
                            if (res.status === "invite resent") {
                              toast({
                                title: "Invitation resent",
                                description:
                                  "The invitation will expire in 24 hours",
                              });
                            } else {
                              toast({
                                title: "Invite failed",
                                description:
                                  "Please wait a few minutes before resending",
                                variant: "destructive",
                              });
                            }
                          })
                          .catch(() => errorToast())
                      }
                      disabled={resendInviteMutation.isLoading}
                    >
                      <ReloadIcon className="mr-2 h-4 w-4" />
                      Resend invitation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      red
                      onClick={() =>
                        cancelInviteMutation
                          .mutateAsync({
                            email: invite.inviteeEmail,
                            hostTeamId: curTeam.id,
                          })
                          .then(() => {
                            toast({
                              title: "Invitation cancelled",
                              description:
                                "The co-host invitation has been cancelled",
                            });
                          })
                          .catch(() => errorToast())
                      }
                      disabled={cancelInviteMutation.isLoading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel invitation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );

  return (
    <HostDashboardLayout>
      <div className="mx-auto max-w-4xl space-y-4 py-16">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Manage Co-Hosts</h1>
          </div>
          <p className="text-muted-foreground">
            Assign specific roles to your co-hosts to control their access and
            responsibilities.
          </p>
        </div>

        {/* Add New Co-Host Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Co-Host</CardTitle>
            <CardDescription>
              You can always adjust a co-host&apos;s role later if needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-2 sm:flex-row sm:items-end"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-start justify-between pb-1">
                        <FormLabel>Invite Co-Host by Email</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          autoComplete="email"
                          placeholder="Enter email address"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="min-w-48">
                      <FormLabel>Select Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-2">
                            <SelectValue />
                            <ChevronDown className="h-4 w-4" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(roleDescriptions).map(
                            ([role, { title, icon, color }]) => (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`rounded-full p-1.5 ${color}`}
                                  >
                                    {icon}
                                  </div>
                                  <div className="font-medium">{title}</div>
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Invite Co-Host
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Lists */}
        <Card>
          <CoHostsList />
        </Card>

        <Card>
          <PendingInvitesList />
        </Card>

        {/* Understanding Roles */}
        <Card>
          <CardTitle>Understanding Co-Host Roles</CardTitle>
          <div className="space-y-6">
            {Object.entries(roleDescriptions).map(
              (
                [
                  role,
                  {
                    title,
                    description,
                    icon,
                    color,
                    can,
                    cant,
                    checkColor,
                    xColor,
                  },
                ],
                index,
              ) => (
                <div key={role}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="rounded-lg bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className={`rounded-full p-1.5 ${color}`}>
                        {icon}
                      </div>
                      <h4 className="text-lg font-medium">{title}</h4>
                      {role === "adminAccess" && (
                        <Badge variant="secondary" className="ml-2">
                          Equivalent to Airbnb Co-Host
                        </Badge>
                      )}
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {description}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h5 className="mb-2 flex items-center gap-2 font-medium">
                          <Check className={`h-4 w-4 ${checkColor}`} />
                          Can:
                        </h5>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                          {can.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="mb-2 flex items-center gap-2 font-medium">
                          <X className={`h-4 w-4 ${xColor}`} />
                          Can&apos;t:
                        </h5>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          {cant.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </Card>
      </div>
    </HostDashboardLayout>
  );
}
