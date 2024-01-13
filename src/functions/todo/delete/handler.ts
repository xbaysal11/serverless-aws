import 'source-map-support/register';
import Todo from '@/db/models/todos';

const deleteTodo = async (event) => {
  try {
    const queryParams = event.queryStringParameters;

    await Todo.destroy({
      where: {
        id: queryParams.id,
      },
    });

    console.log('Item deleted successfully');
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = deleteTodo;
