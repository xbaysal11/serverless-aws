export default {
  handler: `src/functions/todo/delete/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/todo/delete',
       
      },
    },
  ],
};
