import 'source-map-support/register';
import Image from '@/db/models/images';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const deleteImage = async (event) => {
  try {
    const fileId = event.queryStringParameters.fileid;

    await Image.destroy({
      where: {
        fileid: fileId,
      },
    });

    const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
      const client = new S3Client({ region });
      const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
      const result = await client.send(command);
      return result
    };

    
    await createPresignedUrlWithClient({
      region: 'us-east-1',
      bucket: 'aws-bucket-image-test',
      key: fileId,
    });

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'deleted' }),
    };
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = deleteImage;
