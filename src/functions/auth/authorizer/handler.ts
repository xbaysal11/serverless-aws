import { APIGatewayProxyResult } from 'aws-lambda';
import { users } from '../../../user';
/**
 * @description The controller.
 */
export async function handler(event: any): Promise<APIGatewayProxyResult> {
  const clientToken = event.authorizationToken || event.headers.Authorization; // Do something with an incoming auth token
  console.log('clientToken: ', clientToken);

  const user = users.find(u => u.token === clientToken); // Do something to check if user is active or similar

  const policy = user ? 'Allow' : 'Deny';
  console.log(`Is user active? ${user}`);
  
  console.log('HELLO ');
  console.log('event.methodArn: ', event.methodArn);
  return generatePolicy(user.id, policy, event.methodArn, user.username);
}

/**
 * @description Creates the IAM policy for the response.
 */
const generatePolicy = (
  principalId: any,
  effect: any,
  resource: any,
  username: string,
) => {
  // @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
  const authResponse: any = {
    principalId,
  };

  if (effect && resource) {
    const policyDocument: any = {
      Version: '2012-10-17',
      Statement: [],
    };

    const statement = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: [
        "arn:aws:execute-api:us-east-1:951772855919:vx8nmunyyb/dev/GET/image/getAll",
        "arn:aws:execute-api:us-east-1:951772855919:vx8nmunyyb/dev/DELETE/image/delete",
        "arn:aws:execute-api:us-east-1:951772855919:vx8nmunyyb/dev/POST/image/upload",
        "arn:aws:execute-api:us-east-1:951772855919:vx8nmunyyb/dev/GET/image/download",
      ],
    };

    policyDocument.Statement[0] = statement;
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    username: username,
    //role: user.role --> "principalId" could be an object that also has role
  };

  console.log('authResponse', authResponse);

  return authResponse;
};
