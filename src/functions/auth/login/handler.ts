import 'source-map-support/register';
import { users } from '../../../user';

const login = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { username, password } = body;
    const user = users.find((u) => u.username === username);

    if (user && user.username === username && user.password === password) {
      console.log('true: ', user.token);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({ Token: user.token }),
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({ message: 'Unautherized' }),
      };
    }
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

export const main = login;
