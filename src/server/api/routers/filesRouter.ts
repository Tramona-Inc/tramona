import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { env } from "@/env";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const filesRouter = createTRPCRouter({
  upload: roleRestrictedProcedure(["admin", "host"])
    .input(z.object({ fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { fileName } = input;
      const { s3 } = ctx;

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.MAP_SCREENSHOTS_BUCKET_NAME,
        Key: fileName,
        ACL: "public-read",
      });

      const uploadUrl = await getSignedUrl(s3, putObjectCommand);
      return uploadUrl;
    }),
  download: protectedProcedure
    .input(z.object({ fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { fileName } = input;
      const { s3 } = ctx;

      const getObjectCommand = new GetObjectCommand({
        Bucket: env.MAP_SCREENSHOTS_BUCKET_NAME,
        Key: fileName,
      });

      const downloadUrl = await getSignedUrl(s3, getObjectCommand);
      return downloadUrl;
    }),
});
