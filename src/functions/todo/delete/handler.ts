import 'source-map-support/register';
const { Client } = require('pg');

const deleteTodo = async (event) => {
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

  console.log(process.env);
  try {
    await client.connect();
    console.log('connect success:');

    const queryParams = event.queryStringParameters;

    const result = await client.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [queryParams.id],
    );

    if (result.rows.length === 0) {
      console.log('Item not found.');
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found.' }),
      };
    }

    const deletedItem = result.rows[0];

    console.log('Item deleted successfully:', deletedItem);
    return {
      statusCode: 200,
      body: JSON.stringify(deletedItem),
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

export const main = deleteTodo;
