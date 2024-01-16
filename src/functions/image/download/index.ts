export default {
  handler: `src/functions/image/download/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/image/download',
        authorizer: "authorizer"
      },
    },
  ],
};
