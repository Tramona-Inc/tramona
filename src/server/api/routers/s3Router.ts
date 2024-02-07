import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "@/env";

import {
  PutObjectCommand,
  UploadPartCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Router = createTRPCRouter({
  getAllObjects: protectedProcedure.query(async ({ ctx }) => {
    const listObjectOutput = await ctx.s3.listObjectsV2({
      Bucket: env.BUCKET_NAME,
    });

    return listObjectOutput ?? [];
  }),

  getStandardUploadPresignedUrl: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        acl: z.nativeEnum(ObjectCannedACL),
        meta: z.record(z.string(), z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { key, acl, meta } = input;

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: key,
        ACL: acl,
        Metadata: meta,
      });

      return await getSignedUrl(ctx.s3, putObjectCommand);
    }),

  getMultipartUploadPresignedUrl: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        acl: z.nativeEnum(ObjectCannedACL),
        filePartTotal: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { key, acl, filePartTotal } = input;

      const uploadId =
        (
          await ctx.s3.createMultipartUpload({
            Bucket: env.BUCKET_NAME,
            Key: key,
            ACL: acl,
          })
        ).UploadId ?? "";

      if (uploadId === "") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Create multipart upload id failed",
        });
      }

      const urls: Promise<{ url: string; partNumber: number }>[] = [];

      for (let i = 1; i <= filePartTotal; i++) {
        const uploadPartCommand = new UploadPartCommand({
          Bucket: env.BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
          PartNumber: i,
        });

        const url = getSignedUrl(ctx.s3, uploadPartCommand).then((url) => ({
          url,
          partNumber: i,
        }));

        urls.push(url);
      }

      return {
        uploadId,
        urls: Promise.all(urls),
      };
    }),

  completeMultipartUpload: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        uploadId: z.string(),
        parts: z.array(
          z.object({
            ETag: z.string(),
            PartNumber: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { key, uploadId, parts } = input;

      const completeMultipartUploadOutput =
        await ctx.s3.completeMultipartUpload({
          Bucket: env.BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: parts,
          },
        });

      return completeMultipartUploadOutput;
    }),
});
