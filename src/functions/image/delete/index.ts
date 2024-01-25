export default {
  handler: `src/functions/image/delete/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/image/delete',
        authorizer: 'authorizer',
      },
    },
  ],
};
