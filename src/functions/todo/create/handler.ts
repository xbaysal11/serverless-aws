import 'source-map-support/register';
import Todo from '@/db/models/todos';

const createTodo = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const created = await Todo.create({
      todo: body.todo,
      username: body.username,
    });

    console.log('Item created successfully:', created);
    return {
      statusCode: 200,
      body: JSON.stringify(created),
    };
  } catch (error) {
    console.error('error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const main = createTodo;
