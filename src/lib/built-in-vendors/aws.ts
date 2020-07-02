import { logger } from '../logger';

export default (...args: any[]) => {
  const event = args[0];
  const awsEventCallBack = args[2];

  // normalize event
  event.pathParameters = event.pathParameters || {};
  event.queryStringParameters = event.queryStringParameters || {};
  event.headers = event.headers || {};
  event.requestContext = event.requestContext || {};

  // request normalization
  return {
    request: {
      body: event.body,
      headers: event.headers,
      httpMethod: event.httpMethod,
      path: event.requestContext.path || event.path,
      pathParameters: event.pathParameters,
      queryParameters: event.queryStringParameters,
    },

    resolve: (result) => {
      awsEventCallBack(null, result);
    },

    reject: (error) => {
      logger.log(error);
      awsEventCallBack(error);
    },
  };
};
