// import schema from './schema';

export default {
  handler: `src/functions/deleteTodo/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/delete-todo',
        // request: {
        //   schemas: {
        //     'application/json': schema,
        //   },
        // },
      },
    },
  ],
};
