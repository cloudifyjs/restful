import * as response from './response';
import { validateRequest } from './validation';
import { bodyDeserializer, UnsupportedMediaTypeError } from './request';
import { WrapperConfig, Request } from './config';
import { logger } from './logger';

export const requestHandler = (config: WrapperConfig, request) => {
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

    const callTargetFunction = (req: Request) => {
      config
        .target(req)
        .then(funcResult => {
          funcResult = config.decorator(funcResult, config.links, req);

          const emptyReturn = funcResult === null || funcResult === undefined; // eslint-disable-line id-blacklist
          if (
            emptyReturn &&
            req.httpMethod === 'GET' &&
            config.outputType === 'document'
          ) {
            resolve(response.notFound());
          } else if (
            emptyReturn &&
            ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.httpMethod) &&
            config.outputType === 'document'
          ) {
            resolve(response.noContent());
          } else {
            resolve(response.ok(funcResult));
          }
        })
        .catch(error => {
          logger.log('An error was caught from target function', error);
          resolve(response.internalServerError(error));
        });
    };

    validateRequest(request, config.validators)
      .then(callTargetFunction)
      .catch(error => {
        logger.log(
          'the request did not pass the validations, returning invalid request',
          error
        );
        resolve(
          response.preconditionFailed({
            message: 'Invalid request',
            rootCause: error
          })
        );
      });
  });
};
