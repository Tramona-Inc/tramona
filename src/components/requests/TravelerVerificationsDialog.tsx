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
      verified: verificationList.dateOfBirth,
    },
    {
      name: verificationList.email,
      verified: verificationList.emailVerified,
    },
    {
      name: verificationList.phoneNumber,
      verified: verificationList.phoneNumber,
    },
  ];

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <p className="underline">{request.traveler.name}</p>
        </DialogTrigger>
        <DialogContent>
          <div className="flex items-center gap-2">
            <UserAvatar
              size="sm"
              name={request.traveler.name}
              image={request.traveler.image}
            />
            <p className="text-lg font-bold">{request.traveler.name}</p>
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
        </DialogContent>
      </Dialog>
      <div>
        {verificationList.emailVerified &&
        verificationList.phoneNumber &&
        verificationList.dateOfBirth ? (
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
    </>
  );
}
