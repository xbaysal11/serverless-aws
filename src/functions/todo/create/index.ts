export default {
  handler: `src/functions/todo/create/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/todo/create',
        authorizer: "authorizer"
      },
    },
  ],
};
