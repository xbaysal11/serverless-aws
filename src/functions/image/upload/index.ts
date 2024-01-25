export default {
  handler: `src/functions/image/upload/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/image/upload',
        authorizer: "authorizer"
      },
    },
  ],
};
