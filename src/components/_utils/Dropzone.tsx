import { Input } from "@/components/ui/input";
import RadialProgress from "@/components/ui/progress";
import { api } from "@/utils/api";
import axios from "axios";
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { Ref } from "react";
import { useDropzone } from "react-dropzone";
import UploadIcon from "../_icons/UploadIcon";
import md5 from "md5";

export interface DropzoneRef {
  uploadS3: () => Promise<void>;
  hashKeys: Array<string>;
}

export const Dropzone = React.forwardRef((_, ref: Ref<DropzoneRef>) => {
  const s3Mutation = api.s3.getStandardUploadPresignedUrl.useMutation();

  // <K, V>: <hash of filename, presigned url>
  const [presignedUrlPool, setPresignedUrlPool] = useState<
    Record<string, string>
  >({});

  // <K, V>: <original filename, hash of filename>
  const [hashKeyPool, setHashKeyPool] = useState<Record<string, string>>({});

  const [progress, setProgress] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const apiUtils = api.useUtils();

  const onDropAccepted = (files: Array<File>) => {
    setHashKeyPool({});
    setPresignedUrlPool({});
    setLoading(true);
    setProgress(0);

    files.forEach((f: File, idx: number) => {
      const key = md5(f.name).toString(); // hash on file name

      s3Mutation
        .mutateAsync({
          key,
          acl: "public-read",
          meta: {
            name: f.name,
            timestamp: Date.now().toString(),
          },
        })
        .then((url) => {
          setHashKeyPool((prevPool) => ({
            ...(prevPool || {}),
            [f.name]: key,
          }));

          setPresignedUrlPool((prevPool) => ({
            ...(prevPool || {}),
            [key]: url,
          }));

          setProgress(
            (prev) => prev + Math.floor((idx + 1) / files.length) * 100,
          );
        })
        .catch((err: string | undefined) => {
          setLoading(false);
          setProgress(0);
          throw new Error(err);
        });
    });
  };

  // useEffect(() => {
  //   console.log("progress updated: ", progress);
  // }, [progress]);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    maxFiles: 0,
    maxSize: 5 * 2 ** 30, // roughly 5GB
    multiple: true,
    onDropAccepted,
  });

  const uploadS3 = useCallback(async () => {
    if (acceptedFiles.length > 0 && Object.keys(presignedUrlPool).length > 0) {
      const uploads: Promise<void>[] = [];

      acceptedFiles.forEach((f: File) => {
        const upload = axios
          .put(presignedUrlPool[hashKeyPool[f.name]!]!, f.slice(), {
            headers: {
              "Content-Type": f.type,
            },
          })
          .then(() => {
            // console.log("[StandardDropzone handleSubmit success]: ", res);
          })
          .catch((err: string | undefined) => {
            // console.log("[StandardDropzone handleSubmit fail]: ", err);
            throw new Error(err);
          });

        uploads.push(upload);
      });

      await Promise.all(uploads);

      await apiUtils.s3.getAllObjects.invalidate();
    }
  }, [acceptedFiles, presignedUrlPool, apiUtils.s3.getAllObjects, hashKeyPool]);

  const hashKeys = useMemo(
    () => Object.keys(presignedUrlPool),
    [presignedUrlPool],
  );

  useImperativeHandle(ref, () => ({ uploadS3, hashKeys }), [
    uploadS3,
    hashKeys,
  ]); // specify the ref object forwarded

  return (
    <section className="col-span-full">
      <div
        {...getRootProps()}
        className=" flex w-full items-center justify-center"
      >
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          {loading && (
            <div className=" max-w-md text-center  ">
              <RadialProgress progress={progress} />
              <p className=" text-sm font-semibold">Uploading Picture</p>
              <p className=" text-xs text-gray-400">
                Do not refresh or perform any other action while the picture is
                being upload
              </p>
            </div>
          )}

          {!loading && (
            <div className=" text-center">
              <div className="mx-auto max-w-min rounded-md">
                <UploadIcon />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag one or more images</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                Click to upload &#40; image should be 500x500 px & under 10 MB
                &#41;
              </p>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
        />
      </div>
    </section>
  );
});

Dropzone.displayName = "dropzone";
