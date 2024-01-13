import 'source-map-support/register';
import Todo from '@/db/models/todos';

const getTodo = async () => {
  try {
    const all = await Todo.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(all),
    };
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = getTodo;
