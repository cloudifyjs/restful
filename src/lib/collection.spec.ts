/* eslint-disable */
import test from 'ava';
import { collection } from './collection';

test('it should return an event handler', (t) => {
  const handler = collection({ target: async () => ({}) });
  t.truthy(handler);
});

test.cb('it fail with 415', (t) => {
  const targetResult = [];
  const handler = collection({ target: async () => targetResult });

  t.plan(1);

  handler({ httpMethod: 'POST', requestContext: {} }, {}, (error, result) => {
    if (error) {
      t.fail();
      return;
    }
    t.deepEqual(result, {
      body: JSON.stringify({
        message: 'Method Not Allowed: POST',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 405,
    });

    t.end();
  });
});

test.cb('it should handle event correctly', (t) => {
  const targetResult = [];
  const handler = collection({ target: async () => targetResult });
  t.plan(1);

  handler({ httpMethod: 'GET', requestContext: {} }, {}, (error, result) => {
    if (error) {
      t.fail();
      return;
    }

    t.deepEqual(
      result,
      {
        body: JSON.stringify(targetResult),
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
      },
      'response it not equals'
    );

    t.end();
  });
});

test.cb('it should decorate response object with HATEOS links', (t) => {
  t.plan(1);
  const targetResult = [{ id: '123', text: 'test' }];
  const decoratedReponse = [
    {
      id: '123',
      text: 'test',
      links: [
        { href: '/todos/123', rel: 'self', type: 'GET' },
        { href: '/todos/123/views', rel: 'views', type: 'GET' },
      ],
    },
  ];
  const handler = collection({
    target: async () => targetResult,
    links: {
      self: {
        type: 'GET',
        href: '${request.path}/${item.id}',
      },
      views: {
        type: 'GET',
        href: '${request.path}/${item.id}/views',
      },
    },
  });

  handler(
    { httpMethod: 'GET', requestContext: { path: '/todos' } },
    {},
    (error, result) => {
      if (error) {
        t.fail();
        return;
      }

      t.deepEqual(result, {
        body: JSON.stringify(decoratedReponse),
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
      });

      t.end();
    }
  );
});
