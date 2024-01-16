/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import {
  createTodo,
  getTodo,
  deleteTodo,
  login,
  authorizer,
} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'image-hosting',
  frameworkVersion: '3',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'yarn',
    },
    stage: 'dev',
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['codedeploy:*'],
        Resource: '*',
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: false, // activate to see CacheHits and Misses
    },
    logs: {
      // activate to see API Gateway logs
      restApi: {
        accessLogging: false,
        executionLogging: false,
        level: 'INFO',
        fullExecutionData: false,
      },
    },
    environment: {},
    lambdaHashingVersion: '20201221',
  },
  functions: {
    createTodo,
    getTodo,
    deleteTodo,
    login,
    authorizer,
  },
};

module.exports = serverlessConfiguration;
