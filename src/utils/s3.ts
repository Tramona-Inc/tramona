import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: env.REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function uploadObjectToS3(file: File | null) {
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
    const presignedUrl = `https://tramona-map-screenshots.s3.amazonaws.com/${file.name}`;
    return presignedUrl;
  } catch (error) {
    throw new Error("Error uploading object");
  }
}
