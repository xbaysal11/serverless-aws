export default {
  handler: `src/functions/auth/login/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/auth/login',
        // authorizer: {
        //   name: 'Authorizer',
        //   // arn: 'arn:aws:cognito-idp:us-east-1:951772855919:userpool/us-east-1_AGN950jC4',
        //   resultTtlInSeconds: 30,
        //   identitySource: 'method.request.header.Authorization',
        //   type: 'COGNITO_USER_POOLS',
        // },
      },
    },
  ],
};
