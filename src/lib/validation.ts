/* eslint-disable no-underscore-dangle */
import { Request, ValidationOptions } from './config';
import * as Joi from '@hapi/joi';

export const validateRequest = async (
  request: Request,
  validators: ValidationOptions
): Promise<Request> => {
  // if we have configured validations, ensure that will
  // consider if event doesn`t provide any property
  // and avoid that additional properties on headers, query
  // and path fails the validations
  if (validators.headers)
    validators.headers = validators.headers.required().unknown(true);

  if (validators.queryParameters)
    validators.queryParameters = validators.queryParameters
      .required()
      .unknown(true);

  if (validators.pathParameters)
    validators.pathParameters = validators.pathParameters
      .required()
      .unknown(true);

  if (validators.body) validators.body = validators.body.required();

  try {
    await Joi.object(validators).unknown(true).validateAsync(request);

    return request;
  } catch (error) {
    // remove original values to avoid server information leaks
    delete error._original;
    throw error;
  }
};
