import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

// We use different buckets for development and production
const bucketName =
  process.env.NODE_ENV === 'development' ? 'simplyfood-dev' : 'simplyfood-prod';

const s3 = new aws.S3({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

// This function is used to send a upload url to the client. The client will use this url to upload the image to S3
export const generateUploadUrl = async () => {
  // Generate a unique name for the image
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  // Params for the url
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  // Generate and return the upload url
  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
  return uploadUrl;
};
