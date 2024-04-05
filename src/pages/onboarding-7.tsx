import MainLayout from "@/components/_common/Layout/MainLayout";
import { Container } from "@react-email/components";
import Dropzone from "./dropzone";
import { useForm } from "react-hook-form";
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

export default function Onboarding7() {
  const defaultValues: { file: null | File } = {
    file: null,
  };
  const methods = useForm({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  });

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        {
          name: "image",
          types: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/pdf",
          ],
        },
      ];
      const fileType = allowedTypes.find((allowedType) =>
        allowedType.types.find((type) => type === acceptedFiles[0].type),
      );
      if (!fileType) {
        methods.setValue("file", null);
        methods.setError("file", {
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        methods.setValue("file", acceptedFiles[0]);
        methods.clearErrors("file");
      }
    } else {
      methods.setValue("file", null);
      methods.setError("file", {
        message: "File is required",
        type: "typeError",
      });
    }
  }

  const uploadFileMutation = api.files.upload.useMutation();

  async function handleFormSubmit(data: { file: File | null }) {
    let url: string | null = null;

    const file = data.file;

    if (file) {
      const fileName = file.name;

      try {
        const uploadUrlResponse = await uploadFileMutation.mutateAsync({
          fileName,
        });
        await axios.put(uploadUrlResponse, file);
        url = getS3ImgUrl(fileName);
      } catch (error) {
        throw new Error("error uploading file");
      }
    }
  }
  return (
    <MainLayout>
      <Container className="my-10">
        <h1 className="my-3 text-3xl font-bold">
          Add some photos of your property
        </h1>
        <p className="mb-5 text-slate-500">Choose at least 5 photos</p>
        <Form {...methods}>
          <form
            className="w-100 flex flex-col items-center justify-center gap-2"
            onSubmit={methods.handleSubmit(handleFormSubmit)}
            noValidate
            autoComplete="off"
          >
            <FormField
              control={methods.control}
              name="file"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Dropzone
                      {...field}
                      dropMessage="Drag your photos here"
                      handleOnDrop={handleOnDrop}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {methods.watch("file") && (
              <div className="relative flex items-center justify-center gap-3 p-4">
                <FileCheck2Icon className="h-4 w-4" />
                <p className="text-sm font-medium">
                  {methods.watch("file")?.name}
                </p>
              </div>
            )}
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </Container>
    </MainLayout>
  );
}
