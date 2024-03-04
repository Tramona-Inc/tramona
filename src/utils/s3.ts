import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";

export default async function uploadObjectToS3(file: File | null) {
  const configuration = {
    region: env.NEXT_PUBLIC_REGION,
    credentials: {
      accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
  };

  const client = new S3Client(configuration);

  if (!file) {
    throw new Error("no file selected");
  }

  const params: PutObjectCommandInput = {
    Bucket: env.NEXT_PUBLIC_MAP_SCREENSHOTS_BUCKET_NAME,
    Key: file.name,
    Body: file,
    ACL: "public-read",
  };

  try {
    const command: PutObjectCommand = new PutObjectCommand(params);
    await client.send(command);
    const presignedUrl = `https://tramona-map-screenshots.s3.amazonaws.com/${file.name}`;
    return presignedUrl;
  } catch (error) {
    throw new Error("Error uploading object");
  }
}
