import 'source-map-support/register';
import { v4 as uuidv4 } from 'uuid';
const { Client } = require('pg');

const createTodo = async (event) => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('connect success:');

    const body = JSON.parse(event.body);

    const result = await client.query(
      'INSERT INTO todos (id,todo, username) VALUES ($1, $2, $3) RETURNING *',
      [uuidv4(), body.todo, body.username],
    );

    console.log('Item created successfully:', result.rows[0]);
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
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
};

export const main = createTodo;
