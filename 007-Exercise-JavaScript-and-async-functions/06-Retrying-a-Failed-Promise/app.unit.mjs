import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);

test('retryPromise returns the first success', async () => {
    const { context } = loadScript(file);
    let attempts = 0;
    const flaky = () => (++attempts < 3 ? Promise.reject(new Error('no')) : Promise.resolve('ok'));
    assert.equal(await context.retryPromise(flaky), 'ok');
    assert.equal(attempts, 3);
});

test('retryPromise rethrows the last error after all retries fail', async () => {
    const { context } = loadScript(file);
    let attempts = 0;
    const broken = () => Promise.reject(new Error(`fail ${++attempts}`));
    await assert.rejects(context.retryPromise(broken, 2), { message: 'fail 2' });
    assert.equal(attempts, 2);
});

test('startRetry logs Success when Math.random favours it', async () => {
    const { context, logs } = loadScript(file, { Math: { random: () => 0.9 } });
    context.startRetry();
    await new Promise((r) => setImmediate(r));
    assert.deepEqual(logs, [['Result: Success!']]);
});

test('startRetry logs the error when every attempt fails', async () => {
    const { context, logs } = loadScript(file, { Math: { random: () => 0.1 } });
    context.startRetry();
    await new Promise((r) => setImmediate(r));
    assert.deepEqual(logs, [['Error: Failed!']]);
});
