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
import { Button } from "../ui/button";

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
    images.forEach((image, index) => {
      image.id === id && images.splice(index, 1);
    });
  }

  return (
    <div className="space-y-2">
      <Dropzone accept="image/*" handleOnDrop={handleOnDrop}>
        <div className="flex flex-col items-center space-y-2 text-center">
          <p className="h-16 w-16 border-2 border-primary"></p>
          <h1 className="text-lg font-bold">Drag your photos here</h1>
          <p className="text-sm text-muted-foreground">or</p>
          <p className="text-sm underline">Upload from device</p>
        </div>
      </Dropzone>
      <div className="flex justify-center">
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
          <div className="flex w-max items-center gap-2">
            {images.map((image, index) => (
              <div key={image.id} className="relative overflow-hidden">
                <Image
                  src={image.url}
                  className={cn(
                    image.status === "uploaded" ? "opacity-100" : "opacity-50",
                    "aspect-square object-cover",
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
                  <Button onClick={() => removeFromImages(image.id)}>X</Button>
                </div>
                <div className="absolute left-2 top-2">
                  {index === 0 && (
                    <p className="border-1 rounded-sm bg-zinc-400/50 p-1 text-sm font-bold text-secondary">
                      Cover Photo
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
