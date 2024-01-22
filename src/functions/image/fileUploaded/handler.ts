import 'source-map-support/register';
import Image from '@/db/models/images';

const fileUploaded = async (event) => {
  try {
    const fileId = event.Records[0].s3.object.key;
    console.log('fileId: ', fileId);
    const newData = {
      status: 'SUCCESS',
    };
    const updated = await Image.update(newData, {
      where: { fileid: fileId },
    });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ updated }),
    };
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = fileUploaded;
