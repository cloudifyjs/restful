/* eslint-disable no-template-curly-in-string */
import test from 'ava';
import { document } from './document';
import * as Joi from '@hapi/joi';

test('it should return an event handler', t => {
  const handler = document({ target: async () => ({}) });
  t.truthy(handler);
});

test('it should throw an invalid configuration', t => {
  t.plan(1);
  t.throws(
    () => {
      document.apply(null, [{}]);
    },
    { message: 'Invalid event configuration (target not found)' }
  );
});

test.cb('it should handle event correctly', t => {
  const targetResult = {};
  const handler = document({ target: async () => targetResult });
  t.plan(1);

  handler({ httpMethod: 'GET', requestContext: {} }, {}, (error, result) => {
    if (error) {
      t.fail();
      return;
    }
    t.deepEqual(result, {
      body: JSON.stringify(targetResult),
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200
    });
    t.end();
  });
});

test.cb('it should decorate response object with HATEOS links', t => {
  const targetResult = { id: '123' };
  const decoratedReponse = {
    id: '123',
    links: [
      { href: '/todos/123', rel: 'self', type: 'GET' },
      { href: '/todos/123/views', rel: 'views', type: 'GET' }
    ]
  };
  t.plan(1);
  const handler = document({
    target: async () => targetResult,
    links: {
      self: {
        type: 'GET',
        href: '${request.path}'
      },
      views: {
        type: 'GET',
        href: '${request.path}/views'
      }
    }
  });

  handler(
    { httpMethod: 'GET', requestContext: { path: '/todos/123' } },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }
      t.deepEqual(result, {
        body: JSON.stringify(decoratedReponse),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200
      });
      t.end();
    }
  );
});

test.cb('it should handle event body properly', t => {
  const targetResult = {};
  const handler = document({ target: async () => targetResult });
  t.plan(1);
  handler(
    {
      httpMethod: 'POST',
      requestContext: {},
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }
      t.deepEqual(result, {
        body: JSON.stringify(targetResult),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200
      });
      t.end();
    }
  );
});

test.cb('it should return an HTTP 415', t => {
  const targetResult = {};
  const handler = document({
    target: async () => targetResult,
    consumes: ['text/json']
  });
  t.plan(1);

  handler(
    {
      httpMethod: 'PUT',
      requestContext: {},
      headers: { 'content-type': 'application/json' },
      body: null
    },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }
      t.deepEqual(result, {
        body: JSON.stringify({
          message: 'Unsupported Media type application/json'
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 415
      });
      t.end();
    }
  );
});

test.cb('it should return an HTTP 400 (invalid body)', t => {
  const targetResult = {};
  const handler = document({
    target: async () => targetResult,
    consumes: ['text/json']
  });
  t.plan(1);

  handler(
    {
      httpMethod: 'PUT',
      requestContext: {},
      headers: { 'content-type': 'text/json' },
      body: '{invalid json'
    },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }

      t.deepEqual(result, {
        body: JSON.stringify({
          message: 'Invalid request body',
          rootCause: {}
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400
      });
      t.end();
    }
  );
});

test.cb('it should return an HTTP 400 (validation error)', t => {
  const targetResult = {};
  const handler = document({
    target: async () => targetResult,
    consumes: ['text/json'],
    validators: {
      body: Joi.object({ text: Joi.string().required() }).unknown(true)
    }
  });
  t.plan(1);

  handler(
    {
      httpMethod: 'PUT',
      requestContext: {},
      headers: { 'content-type': 'text/json' },
      body: JSON.stringify({ checked: true })
    },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }
      t.deepEqual(result, {
        body: JSON.stringify({
          message: 'Invalid request',
          rootCause: {
            details: [
              {
                message: '"body.text" is required',
                path: ['body', 'text'],
                type: 'any.required',
                context: { label: 'body.text', key: 'text' }
              }
            ]
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400
      });
      t.end();
    }
  );
});

test.cb('it should return an HTTP 500', t => {
  const handler = document({
    target: async () => {
      throw Error('Unhandled application error');
    },
    consumes: ['text/json'],
    validators: {
      body: Joi.object({ text: Joi.string().required() }).unknown(true)
    }
  });
  t.plan(1);

  handler(
    {
      httpMethod: 'PUT',
      requestContext: {},
      headers: { 'content-type': 'text/json' },
      body: JSON.stringify({ text: 'new item', checked: true })
    },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }
      t.deepEqual(result, {
        body: JSON.stringify({ message: 'Unhandled application error' }),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 500
      });
      t.end();
    }
  );
});
