import test from 'ava';
import { OutputType } from './config';
import { requestHandler } from './request-handler';
import * as response from './response';
import { logger } from './logger';

logger.log = console.log; // eslint-disable-line no-console

test('it should a return a 404 with null', t => {
  t.plan(1);
  const outputType: OutputType = 'document' as OutputType;
  const config = {
    target: async () => {
      return null;
    },
    outputType,
    supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    validators: {}
  };
  const request = {
    httpMethod: 'GET'
  };
  return requestHandler(config, request).then(result => {
    t.deepEqual(result, response.notFound());
  });
});

test('it should a return a 404 with undefined', t => {
  t.plan(1);
  const outputType: OutputType = 'document' as OutputType;
  const config = {
    target: async () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    outputType,
    supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    validators: {}
  };
  const request = {
    httpMethod: 'GET'
  };
  return requestHandler(config, request).then(result => {
    t.deepEqual(result, response.notFound());
  });
});

test('it should a return a 204 with null', t => {
  t.plan(1);
  const outputType: OutputType = 'document' as OutputType;
  const config = {
    target: async () => {
      return null;
    },
    outputType,
    supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    validators: {},
    consumes: ['application/json']
  };
  const request = {
    httpMethod: 'PUT',
    body: '{}',
    headers: {
      'content-type': 'application/json'
    }
  };
  return requestHandler(config, request).then(result => {
    t.deepEqual(result, response.noContent());
  });
});

test('it should a return a 204 with undefined', t => {
  t.plan(1);
  const outputType: OutputType = 'document' as OutputType;
  const config = {
    target: async () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    outputType,
    supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    validators: {},
    consumes: ['application/json']
  };
  const request = {
    httpMethod: 'PUT',
    body: '{}',
    headers: {
      'content-type': 'application/json'
    }
  };
  return requestHandler(config, request).then(result => {
    t.deepEqual(result, response.noContent());
  });
});
