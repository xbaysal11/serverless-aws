// import schema from './schema';

export default {
  handler: `src/functions/createTodo/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/create-todo',
        authorizer: {
          name: 'authorizer',
          arn: 'arn:aws:cognito-idp:eu-north-1:951772855919:userpool/eu-north-1_UOFjct577',
        },
        // request: {
        //   schemas: {
        //     'application/json': schema,
        //   },
        // },
      },
    },
  ],
};
