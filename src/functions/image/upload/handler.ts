import 'source-map-support/register';
import Image from '@/db/models/images';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const uploadImage = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const username = event.requestContext.authorizer.username;
    const fileId = `${username}/${uuidv4()}.${body.fileformat}`;

    const created = await Image.create({
      fileid: fileId,
      description: body.description,
      status: 'PENDING',
      fileformat: body.fileformat,
    });
    const createPresignedUrlWithClient = ({ region, bucket, key }) => {
      const client = new S3Client({ region });
      const command = new PutObjectCommand({ Bucket: bucket, Key: key });
      return getSignedUrl(client, command, { expiresIn: 3600 });
    };

    const clientUrl = await createPresignedUrlWithClient({
      region: 'us-east-1',
      bucket: 'aws-bucket-image-test',
      key: fileId,
    });

    console.log('Item created successfully:', created);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ created, clientUrl }),
    };
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = uploadImage;
