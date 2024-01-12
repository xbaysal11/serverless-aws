import 'source-map-support/register';

import { formatJSONResponse } from '@/libs/apiGateway';
const { Client } = require('pg');

const getTodo = async () => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database:process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM todos');
    console.log('connect success:');
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
    };
  } catch (error) {
    console.error('connect error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    await client.end();
  }

  return formatJSONResponse({
    message: `success getTodo`,
  });
};

export const main = getTodo;
