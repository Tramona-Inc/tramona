import { api } from "../api";
import { useSession } from "next-auth/react";

export function useUpdateUser() {
  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation();
  const { update } = useSession();

  return {
    updateUser: async (updates: Parameters<typeof updateProfile>[0]) => {
      await updateProfile(updates);
      await update();
    },
  };
}