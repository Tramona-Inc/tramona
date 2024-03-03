// config.js
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIA24GFETHPKJ4FHWFI",
  secretAccessKey: "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",
  region: "us-east-1",
});

const s3 = new AWS.S3();

export { s3 };
