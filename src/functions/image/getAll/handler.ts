import 'source-map-support/register';
import Image from '@/db/models/images';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sequelize from 'sequelize';

const getAllImages = async (event) => {
  const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
    const client = new S3Client({ region });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(client, command, { expiresIn: 100000 });
  };

  try {
    const username = event.queryStringParameters.username;

    const imagesList = await Image.findAll({
      where: {
        fileid: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('fileid')),
          'LIKE',
          '%' + username.toLowerCase() + '%',
        ),
        status: 'SUCCESS',
      },
    });
    console.log(imagesList.length);

    const result = [];
    for (const i in imagesList) {
      const link = await createPresignedUrlWithClient({
        region: 'us-east-1',
        bucket: 'aws-bucket-image-test',
        key: imagesList[i].fileid,
      });
      console.log('link: ', link);

      result.push({
        fileid: imagesList[i].fileid,
        description: imagesList[i].description,
        link,
      });
    }

    // const result = await Promise.all(
    //   imagesList.map(async (i) => {
    //     const a = await createPresignedUrlWithClient({
    //       region: 'us-east-1',
    //       bucket: 'aws-bucket-image-test',
    //       key: i.fileid,
    //     }).then((res) => {
    //       const data = {
    //         fileid: i.fileid,
    //         description: i.description,
    //         link: res,
    //       };
    //       return data;
    //     });
    //     return a;
    //   }),
    // );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ result }),
    };
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

export const main = getAllImages;
