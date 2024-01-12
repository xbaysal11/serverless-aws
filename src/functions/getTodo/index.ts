// import schema from './schema';

export default {
  handler: `src/functions/getTodo/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/get-todo',
        // request: {
        //   schemas: {
        //     'application/json': schema,
        //   },
        // },
      },
    },
  ],
};
