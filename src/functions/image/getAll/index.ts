export default {
  handler: `src/functions/image/getAll/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/image/getAll',
        authorizer: "authorizer"
      },
    },
  ],
};
