import 'source-map-support/register';
import Image from '@/db/models/images';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
const fs = require('fs');
const https = require('https');

const downloadImage = async (event) => {
  const createPresignedUrlWithClient = ({ region, bucket, key }) => {
    const client = new S3Client({ region });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 100000 });
  };

  async function fetchData(link) {
    try {
      const response = await fetch(link);
      // Check if the request was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response JSON
      const imageBuffer = await response.blob();

      // Now 'data' contains the parsed JSON data
      console.log(imageBuffer);

      // You can return the data if needed
      return imageBuffer;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // Handle the error as needed
    }
  }

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

      async function getImageBase64(url) {
        return new Promise((resolve, reject) => {
          https
            .get(url, { responseType: 'arraybuffer' }, (response) => {
              let data = Buffer.from([]);

              response.on('data', (chunk) => {
                data = Buffer.concat([data, chunk]);
              });

              response.on('end', () => {
                const base64String = data.toString('base64');
                resolve(base64String);
              });
            })
            .on('error', (error) => {
              reject(error);
            });
        });
      }
      const base64Data = await getImageBase64(clientUrl);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ imageRow, clientUrl, base64Data }),
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
