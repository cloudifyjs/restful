import { logger } from '../logger';

export default (...args: any[]) => {
  const req = args[0];
  const resp = args[1];

  // request normalization
  return {
    request: {
      body: req.rawBody,
      headers: req.headers,
      httpMethod: req.method,
      path: req.originalUrl,
      pathParameters: req.params,
      queryParameters: req.query
    },

    resolve: result => {
      resp.set(result.headers);
      resp.status(result.statusCode);
      resp.send(result.body);
    },

    reject: error => {
      logger.log(error);
      resp.status(500);
      resp.send('Internal Server error');
    }
  };
};
