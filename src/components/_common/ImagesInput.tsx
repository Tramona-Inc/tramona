import { api } from "@/utils/api";
import { getS3ImgUrl } from "@/utils/formatters";
import axios from "axios";
import { nanoid } from "nanoid";
import Dropzone from "../ui/dropzone";
import { ScrollBar, ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

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

  function removeFromImages(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <div className="space-y-2">
      <Dropzone accept="image/*" handleOnDrop={handleOnDrop}>
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-zinc-200 p-3">
            <ImagePlusIcon className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold">Drag your photos here</p>
          <p className="text-sm text-muted-foreground">or</p>
          <p className="text-sm underline">Upload from device</p>
        </div>
      </Dropzone>
      <ScrollArea className="rounded-md border p-2">
        {images.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Your photos will show up here
            </p>
          </div>
        ) : (
          <div className="flex h-40 w-max gap-2">
            {images.map((image, index) => (
              <div key={image.id} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  className={cn(
                    "h-full w-auto",
                    image.status === "uploaded" ? "opacity-100" : "opacity-50",
                  )}
                  alt=""
                />
                <div className="absolute inset-0 grid place-items-center">
                  {image.status === "uploading" && (
                    <Loader2Icon className="animate-spin" />
                  )}
                </div>
                <div className="absolute left-2 top-2">
                  {index === 0 && (
                    <p className="border-1 rounded-full bg-white p-1 px-2 text-xs font-semibold text-black">
                      Cover Photo
                    </p>
                  )}
                </div>
                <Tooltip>
                  <TooltipTrigger
                    type="button" // to prevent form submit
                    className="absolute right-1 top-1 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-black p-1 text-white"
                    onClick={() => removeFromImages(image.id)}
                  >
                    <XIcon className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>Remove image</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
