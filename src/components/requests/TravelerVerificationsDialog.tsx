import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { type HostDashboardRequest } from "./RequestCard";
import { getAge } from "@/utils/utils";
import UserAvatar from "../_common/UserAvatar";
import { BadgeCheck, BadgeX } from "lucide-react";

export function TravelerVerificationsDialog({
  request,
}: {
  request: HostDashboardRequest;
}) {
  const { data: verificationList } = api.users.getUserVerifications.useQuery({
    madeByGroupId: request.madeByGroupId,
  });

  if (!verificationList) return null;

  const verifications = [
    {
      name:
        verificationList.dateOfBirth &&
        `Age: ${getAge(verificationList.dateOfBirth)}`,
      verified: verificationList.dateOfBirth !== null,
    },
    {
      name: verificationList.censoredEmail,
      verified: true,
    },
    {
      name: verificationList.censoredPhoneNumber,
      verified: verificationList.censoredPhoneNumber,
    },
  ];

  const travelerLastInitial = request.traveler.lastName
    ? request.traveler.lastName[0]
    : "";

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <p className="underline underline-offset-2">
            {request.traveler.firstName + " " + travelerLastInitial}
          </p>
        </DialogTrigger>
        <DialogContent>
          <div className="flex items-center gap-4">
            <UserAvatar
              size="lg"
              name={request.traveler.name}
              image={request.traveler.image}
            />
            <div className="flex-col">
              <p className="text-lg font-bold">
                {request.traveler.firstName + " " + travelerLastInitial}
              </p>
              <p className="text-muted-foreground">
                Located in {request.traveler.location}
              </p>
            </div>
          </div>
          {verifications.map((verification, index) => (
            <div
              key={index}
              className="flex items-center justify-between font-semibold"
            >
              <p>{verification.name}</p>
              {verification.verified ? (
                <div className="flex gap-2 text-teal-800">
                  <BadgeCheck />
                  <p>Verified</p>
                </div>
              ) : (
                <div className="flex gap-2 text-red-500">
                  <BadgeX />
                  <p>Not verified</p>
                </div>
              )}
            </div>
          ))}
          {request.traveler.about && (
            <div className="mt-4">
              <p className="font-semibold">About</p>
              <p>{request.traveler.about}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="flex flex-row items-center">
        <p className="mr-2">&middot;</p>
        {
          /*verificationList.emailVerified &&
        verificationList.censoredPhoneNumber &&
        verificationList.dateOfBirth*/ true ? (
            <div className="flex items-center gap-1 text-teal-800">
              <BadgeCheck size={16} />
              <p>Verified</p>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <BadgeX size={16} />
              <p>Not verified</p>
            </div>
          )
        }
      </div>
    </>
  );
}
