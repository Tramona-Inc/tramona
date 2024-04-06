import MainLayout from "@/components/_common/Layout/MainLayout";
import { Container } from "@react-email/components";
import { FieldPath, FieldValues, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileCheck2Icon } from "lucide-react";
import { api } from "@/utils/api";
import { getS3ImgUrl } from "@/utils/formatters";
import axios from "axios";
import { nanoid } from "nanoid";
import Dropzone from "../ui/dropzone";
import { ScrollBar, ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { z } from "zod";
import { plural } from "@/utils/utils";

export default function PhotosDropzone<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  minPhotosRequired,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  minPhotosRequired: number;
}) {
  const defaultValues = { files: [] };
  const form = useForm<{ files: File[] }>({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  });
  // Get current files from form state
  const currentFiles = form.watch("files");

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // Merge current files with new valid files
      const mergedFiles = [...currentFiles, ...acceptedFiles];

      form.setValue("files", mergedFiles);

      form.clearErrors("files");
    } else {
      form.setValue("files", []);
      form.setError("files", {
        message: "File is required",
        type: "typeError",
      });
    }
  }

  const uploadFileMutation = api.files.upload.useMutation();

  async function handleFormSubmit({ files }: { files: File[] }) {
    if (files.length < minPhotosRequired) {
      form.setError("files", {
        message: `Please upload at least ${plural(minPhotosRequired, "file")}`,
      });
    }

    await Promise.all(
      files.map(async (file) => {
        const fileName = file.name;
        const uploadUrlResponse = await uploadFileMutation.mutateAsync({
          fileName: nanoid(),
        });
        await axios.put(uploadUrlResponse, file);
        return getS3ImgUrl(fileName);
      }),
    )
      .then((urls) => {
        console.log("URLS", urls);
        return urls;
      })
      .catch(() => {
        form.setError("files", {
          message: "Couldn't upload files, please try again",
        });
      });
  }

  return (
    <Form {...form}>
      <form
        className="w-100 flex flex-col items-center justify-center gap-2"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        noValidate
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Dropzone
                  {...field}
                  accept="image/*"
                  dropMessage={
                    <>
                      Drag your photos here or{" "}
                      <span className="underline">upload from device</span>
                    </>
                  }
                  handleOnDrop={handleOnDrop}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ScrollArea>
          {currentFiles.map((file, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center gap-3 p-4"
            >
              <FileCheck2Icon className="h-4 w-4" />
              <Image src={} alt="" />
              <p className="text-sm font-medium">{file.name}</p>
            </div>
          ))}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
}
