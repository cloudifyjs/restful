import Joi from '@hapi/joi';

interface ValidationOptions {
  body?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
  path?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

interface ApiLink {
  href: string;
  type: string;
}

export interface WrapperConfig {
  consumes?: string[];
  vendor?: string;
  decorator?: (
    result: any,
    links: { [name: string]: ApiLink },
    request: any
  ) => any;
  links?: { [name: string]: ApiLink };
  supportedMethods?: string[];
  target: (
    pathParameters: { [name: string]: string },
    queryStringParameters: { [name: string]: string },
    headers: { [name: string]: string },
    body?: any
  ) => Promise<any>;
  validators?: ValidationOptions;
}
