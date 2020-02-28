import test from 'ava';
import ninos from 'ninos';
import { autoDetect, translate } from './vendors';

const ntest = ninos(test);

test('it should return correct vendor', t => {
  t.plan(3);
  t.is(autoDetect(), 'aws'); // default
  t.is(autoDetect({}), 'aws');
  t.is(autoDetect({ headers: { 'x-cloud-trace-context': 'xxxx' } }), 'google');
});

ntest('it should translate google call to request', t => {
  t.plan(13);

  const setStub = t.context.stub();
  const statusStub = t.context.stub();
  const sendStub = t.context.stub();

  const { request, resolve, reject } = translate(
    'google',
    {
      headers: { 'x-cloud-trace-context': 'xxxx' }
    },
    {
      set: setStub,
      status: statusStub,
      send: sendStub
    }
  );

  t.truthy(request);
  t.truthy(resolve);
  t.truthy(reject);

  // when request is resolved
  const result = { headers: {}, statusCode: 200, body: {} };
  resolve(result);
  t.is(setStub.calls.length, 1);
  t.is(setStub.calls[0].arguments[0], result.headers);
  t.is(statusStub.calls.length, 1);
  t.is(statusStub.calls[0].arguments[0], result.statusCode);
  t.is(sendStub.calls.length, 1);
  t.is(sendStub.calls[0].arguments[0], result.body);

  // when request is reject
  reject(new Error('unexpected error'));
  t.is(statusStub.calls.length, 2);
  t.is(statusStub.calls[1].arguments[0], 500);
  t.is(sendStub.calls.length, 2);
  t.is(sendStub.calls[1].arguments[0], 'Internal Server error');
});

ntest('it should translate aws call to request', t => {
  t.plan(8);

  const awsEventCallBack = t.context.stub();

  const { request, resolve, reject } = translate(
    'aws',
    {},
    {},
    awsEventCallBack
  );

  t.truthy(request);
  t.truthy(resolve);
  t.truthy(reject);

  // when request is resolved
  const result = { headers: {}, statusCode: 200, body: {} };
  resolve(result);
  t.is(awsEventCallBack.calls.length, 1);
  t.is(awsEventCallBack.calls[0].arguments[0], null);
  t.is(awsEventCallBack.calls[0].arguments[1], result);

  // when request is reject
  const error = new Error('unexpected error');
  reject(error);
  t.is(awsEventCallBack.calls.length, 2);
  t.is(awsEventCallBack.calls[1].arguments[0], error);
});
