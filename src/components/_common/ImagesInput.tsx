import { api } from "@/utils/api";
import { getS3ImgUrl } from "@/utils/formatters";
import axios from "axios";
import { nanoid } from "nanoid";
import Dropzone from "../ui/dropzone";
import { ScrollBar, ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import { Badge } from "../ui/badge";
import { Loader2Icon } from "lucide-react";

type SelectedImage = { id: string; url: string } & (
  | { status: "uploading" }
  | { status: "error"; error: string }
  | { status: "uploaded" }
);

export default function ImagesInput({
  onChange: setUrls, // needs to be called "onChange" for react-hook-form to work
}: {
  onChange: (value: string[]) => void;
}) {
  const { mutateAsync: uploadFile } = api.files.upload.useMutation();
  const [images, setImages] = useState<SelectedImage[]>([]);

  useEffect(() => {
    setUrls(
      images
        .filter((image) => image.status === "uploaded")
        .map((image: { url: string }) => image.url),
    );
  }, [images, setUrls]);

  function handleOnDrop(fileList: FileList | null) {
    if (!fileList) return;
    void Promise.all(
      [...fileList].map(async (file) => {
        const id = nanoid();
        const previewUrl = URL.createObjectURL(file);
        const s3Url = getS3ImgUrl(id);

        setImages((prev) => [
          ...prev,
          { id, url: previewUrl, status: "uploading" },
        ]);

        await uploadFile({ fileName: id })
          .then((res) => axios.put(res, file))
          .then(() =>
            setImages((prev) =>
              prev.map((img) =>
                img.id === id ? { id, status: "uploaded", url: s3Url } : img,
              ),
            ),
          )
          .catch(() => {
            // TODO: errors for file too big/too small
            const error = "Couldn't upload image, please try again";
            setImages((prev) =>
              prev.map((img) =>
                img.id === id
                  ? { id, url: previewUrl, error, status: "error" }
                  : img,
              ),
            );
          });
      }),
    );
  }

  return (
    <div className="space-y-2">
      <Dropzone
        accept="image/*"
        dropMessage={
          <>
            Drag your photos here or{" "}
            <span className="underline">upload from device</span>
          </>
        }
        handleOnDrop={handleOnDrop}
      />
      <ScrollArea>
        <div className="flex gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <Image
                src={image.url}
                className={cn(
                  image.status === "uploaded" ? "opacity-100" : "opacity-50",
                )}
                width={200}
                height={200}
                alt=""
              />
              <div className="absolute right-2 top-2">
                {image.status === "uploading" && (
                  <Loader2Icon className="animate-spin" />
                )}
                {image.status === "error" && (
                  <Badge variant="solidRed" size="sm">
                    Error
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
