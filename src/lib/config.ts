import Joi from '@hapi/joi';

export interface ValidationOptions {
  body?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
  pathParameters?: Joi.ObjectSchema;
  queryParameters?: Joi.ObjectSchema;
}

interface ApiLink {
  href: string;
  type: string;
}

export type OutputType = 'document' | 'collection';

export interface Request {
  body?: any;
  headers: { [name: string]: string };
  httpMethod: string;
  path: string;
  pathParameters: { [name: string]: string };
  queryParameters: { [name: string]: string };
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
  outputType?: OutputType;
  supportedMethods?: string[];
  target: (request: Request) => Promise<any>;
  validators?: ValidationOptions;
}
