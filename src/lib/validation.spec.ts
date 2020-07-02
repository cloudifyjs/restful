import test from 'ava';
import async from 'async';
import * as Joi from '@hapi/joi';
import { validateRequest } from './validation';

test('it should validate event', async (t) => {
  const testCases = [
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {},
    },
    {
      request: {
        headers: { accept: 'application/json' },
        httpMethod: 'GET',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {},
    },
    {
      request: {
        body: {},
        headers: {},
        httpMethod: 'PUT',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {},
    },
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: { expand: 'true' },
        queryParameters: { id: '123' },
      },
      validators: {},
    },
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: { id: '123' },
        queryParameters: {},
      },
      validators: {
        pathParameters: Joi.object({ id: Joi.number().required() }),
      },
    },
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: {},
        queryParameters: { expand: 'true' },
      },
      validators: {
        queryParameters: Joi.object({ expand: Joi.string().required() }),
      },
    },
    {
      request: {
        headers: { authorication: 'Basic user:pass' },
        httpMethod: 'GET',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {
        headers: Joi.object({ authorication: Joi.string().required() }),
      },
    },
    {
      request: {
        body: { text: 'New item', checked: true },
        headers: {},
        httpMethod: 'POST',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {
        body: Joi.object({
          text: Joi.string().required(),
          checked: Joi.boolean().required(),
        }),
      },
    },
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: { queryParameters: Joi.object({ expand: Joi.boolean() }) },
    },
  ];

  await async.each(testCases, async (item) => {
    await t.notThrowsAsync(async () => {
      await validateRequest(item.request, item.validators);
    });
  });
});

test('it should throw a validation error', async (t) => {
  const testCases = [
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: { id: '123' },
        queryParameters: {},
      },
      validators: {
        pathParameters: Joi.object({ id: Joi.boolean().required() }),
      },
      message: '"pathParameters.id" must be a boolean',
    },
    {
      request: {
        headers: {},
        httpMethod: 'GET',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {
        queryParameters: Joi.object({ id: Joi.string().required() }),
      },
      message: '"queryParameters.id" is required',
    },
    {
      request: {
        body: { checked: true },
        headers: {},
        httpMethod: 'POST',
        path: '/',
        pathParameters: {},
        queryParameters: {},
      },
      validators: {
        body: Joi.object({
          text: Joi.string().required(),
          checked: Joi.boolean(),
        }),
      },
      message: '"body.text" is required',
    },
  ];

  await async.each(testCases, async (item) => {
    await t.throwsAsync(
      async () => {
        await validateRequest(item.request, item.validators);
      },
      { instanceOf: Error, message: item.message }
    );
  });
});
