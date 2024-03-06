import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { s3 } from "@/server/s3";
import { env } from "@/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { z } from "zod";

export const filesRouter = createTRPCRouter({
  upload: roleRestrictedProcedure(["admin", "host"])
    .input(z.object({ file: z.instanceof(File) }))
    .mutation(async ({ input }) => {
      try {
        const presignedUrl = await uploadToS3(input.file);
        return presignedUrl;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error uploading file",
        });
      }
    }),
});

async function uploadToS3(file: File): Promise<string> {
  if (!file) {
    throw new Error("no file selected");
  }

  const params: PutObjectCommandInput = {
    Bucket: env.MAP_SCREENSHOTS_BUCKET_NAME,
    Key: file.name,
    Body: file,
    ACL: "public-read",
  };

  try {
    const command: PutObjectCommand = new PutObjectCommand(params);
    await s3.send(command);
    const presignedUrl = `https://${env.MAP_SCREENSHOTS_BUCKET_NAME}.s3.amazonaws.com/${file.name}`;
    return presignedUrl;
  } catch (error) {
    throw new Error("Error uploading object");
  }
}
