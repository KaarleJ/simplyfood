import S3 from 'aws-sdk/clients/s3';
import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

// We use different buckets for development and production
const bucketName =
  process.env.NODE_ENV === 'development' ? 'simplyfood-dev' : 'simplyfood-prod';

const s3 = new S3({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'github-actions',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'github-actions',
  signatureVersion: 'v4',
});


// This function is executed server side. It generates a signed URL for the client to upload an image to S3
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

// This function is executed client side. It fetches a signed url from the API and uploads the image directly to S3
export const putImage = async (image: File) => {
  // Get the upload URL from the API
  const { url, error }: { url: string | undefined; error: string | undefined } =
    await fetch('/api/protected/s3').then((res) => res.json());

  // Check if there is an error or if the URL is not found
  if (error) {
    throw new Error(error);
  } else if (!url) {
    throw new Error('Upload URL not found');
  }

  // Upload the image directly to S3
  const upload = await fetch(url, {
    method: 'PUT',
    body: image,
  });
  if (!upload.ok) {
    throw new Error('Upload failed');
  }

  // Parse the image URL from the uploadUrl
  const imgUrl = url.split('?')[0];

  return imgUrl;
};

// This function is executed server side. It deletes an image from S3
export const deleteImage = async (imageUrl: string) => {
  // Parse the image key from the URL
  const key = imageUrl.split('/').slice(-1)[0];

  // Params for the delete request
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // Delete the image
  const res = await s3.deleteObject(params).promise();

  // Check if the image was deleted
  if (res.$response.error) {
    throw new Error(res.$response?.error.message);
  } else {
    return res;
  }
};
