export default {
  handler: `src/functions/todo/get/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/todo/get',
        authorizer: 'authorizer',
      },
    },
  ],
};
