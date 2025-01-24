"use client";

import { ChangeEvent, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2Icon } from "lucide-react";
import { api } from "@/utils/api";
import { nanoid } from "nanoid";
import { getS3ImgUrl } from "@/utils/formatters";
import axios from "axios";
import { cn } from "@/utils/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { RouterOutputs } from "@/utils/api";
import FileUploadImage from "@/components/_common/FileUploadImage";
import Image from "next/image";
import { useSession } from "next-auth/react";

type MyUserWProfile = RouterOutputs["users"]["getMyUserWProfile"];

type ProfilePhotoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  myUserWProfile: MyUserWProfile | undefined;
};

type SelectedImage =
  | { status: "uploading"; url: string }
  | { status: "error"; error: string; url: string }
  | { status: "uploaded"; url: string }
  | { status: "idle"; url: string | null };

export function ProfilePhotoDialog({
  open,
  onOpenChange,
  myUserWProfile,
}: ProfilePhotoDialogProps) {
  const { data: session, update } = useSession();

  const { mutateAsync: updateUserImage } =
    api.users.updateUserImage.useMutation();

  const { mutateAsync: uploadFile } = api.files.upload.useMutation();

  const [selectedImage, setSelectedImage] = useState<SelectedImage>({
    status: "idle",
    url: null,
  });
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = nanoid();
    const previewUrl = URL.createObjectURL(file);
    const s3Url = getS3ImgUrl(id);

    setSelectedImage({ status: "uploading", url: previewUrl });

    uploadFile({ fileName: id })
      .then((res) => axios.put(res, file))
      .then(() => setSelectedImage({ status: "uploaded", url: s3Url }))

      .catch(() => {
        // TODO: errors for file too big/too small
        const error = "Couldn't upload image, please try again";
        setSelectedImage({ status: "error", error, url: previewUrl });
      });
  };

  const handleSave = useCallback(async () => {
    if (selectedImage.status === "uploaded") {
      try {
        await updateUserImage(selectedImage.url);
      } catch (e) {
        console.error("Error uploading the image url: ", e);
      } finally {
        onOpenChange(false);
        if (session?.user) {
          void update();
        }
      }
    }
  }, [selectedImage, updateUserImage, onOpenChange, update, session?.user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit profile photo
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {selectedImage.url ? (
              <div className="relative h-32 w-32">
                <Image
                  src={selectedImage.url}
                  alt="Profile preview"
                  fill
                  className={cn(
                    "h-full w-full rounded-full",
                    selectedImage.status === "uploaded"
                      ? "opacity-100"
                      : "opacity-50",
                  )}
                />
                <div className="absolute inset-0 grid place-items-center">
                  {selectedImage.status === "uploading" && (
                    <Loader2Icon className="animate-spin" />
                  )}
                </div>
                {selectedImage.status === "error" && (
                  <Tooltip>
                    <TooltipTrigger
                      type="button" // to prevent form submit
                      className="absolute right-1 top-1 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-black p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>{selectedImage.error}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                <FileUploadImage
                  onChange={handleFileChange}
                  initialPreviewUrl={myUserWProfile?.user.image ?? null}
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="max-w-xs cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={selectedImage.status !== "uploaded"}
          >
            Save photo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
