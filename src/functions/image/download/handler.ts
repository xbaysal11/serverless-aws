import 'source-map-support/register';
import Image from '@/db/models/images';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const downloadImage = async (event) => {
  const createPresignedUrlWithClient = ({ region, bucket, key }) => {
    const client = new S3Client({ region });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 100000 });
  };

  try {
    const fileId = event.queryStringParameters.fileid;

    const imageRow = await Image.findOne({
      where: {
        fileid: fileId,
        status: 'SUCCESS',
      },
    });

    if (imageRow) {
      const clientUrl = await createPresignedUrlWithClient({
        region: 'us-east-1',
        bucket: 'aws-bucket-image-test',
        key: fileId,
      });
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ imageRow, clientUrl }),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': true,
        },
      };
    }
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = downloadImage;
