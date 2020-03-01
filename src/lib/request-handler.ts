import * as response from './response';
import { validateRequest } from './validation';
import { bodyDeserializer, UnsupportedMediaTypeError } from './request';
import { logger } from './logger';

export const requestHandler = (config, request) => {
  config.decorator = config.decorator || response.bodyDecorator;

  return new Promise(resolve => {
    if (!config.supportedMethods.includes(request.httpMethod)) {
      resolve(response.unsupportedMethod(request.httpMethod));
      return;
    }

    // deserialize request body
    if (['POST', 'PUT', 'PATCH'].includes(request.httpMethod)) {
      try {
        request.body = bodyDeserializer(request, config.consumes);
      } catch (error) {
        if (error instanceof UnsupportedMediaTypeError) {
          resolve(response.unsupportedMediaType(error.message));
          return;
        } else {
          resolve(
            response.badRequest({
              message: 'Invalid request body',
              rootCause: error
            })
          );
          return;
        }
      }
    }

    validateRequest(request, config.validators)
      .then(() => {
        config
          .target(request)
          .then(funcResult => {
            funcResult = config.decorator(funcResult, config.links, request);
            resolve(response.ok(funcResult));
          })
          .catch(error => {
            logger.log('An error was caught from target function', error)
            resolve(response.internalServerError(error));
          });
      })
      .catch(error => {
        logger.log('the request did not pass the validations, returning invalid request', error)
        resolve(
          response.badRequest({
            message: 'Invalid request',
            rootCause: error
          })
        );
      });
  });
};
