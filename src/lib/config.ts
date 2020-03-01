import Joi from '@hapi/joi';

interface ValidationOptions {
  body?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
  pathParameters?: Joi.ObjectSchema;
  queryStringParameters?: Joi.ObjectSchema;
}

interface ApiLink {
  href: string;
  type: string;
}

export interface Request {
  body?: any;
  headers: { [name: string]: string };
  pathParameters: { [name: string]: string };
  queryStringParameters: { [name: string]: string };
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
  target: (request: Request) => Promise<any>;
  validators?: ValidationOptions;
}
