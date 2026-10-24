import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
test.afterEach(() => mock.timers.reset());

test('logs the data when fetch beats the timeout', async () => {
    const fetch = async () => ({ json: async () => ({ name: 'Luke' }) });
    const { context, logs } = loadScript(file, { fetch });
    await context.fetchWithTimeout();
    assert.deepEqual(logs, [[{ name: 'Luke' }]]);
});

test('logs Timeout reached! when fetch is too slow', async () => {
    const fetch = () => new Promise(() => {});
    const { context, logs } = loadScript(file, { fetch });
    const run = context.fetchWithTimeout('x', 1000);
    await advance(mock.timers, 1000);
    await run;
    assert.deepEqual(logs, [['Timeout reached!']]);
});

test('logs the fetch error message', async () => {
    const fetch = async () => { throw new Error('fetch failed'); };
    const { context, logs } = loadScript(file, { fetch });
    await context.fetchWithTimeout();
    assert.deepEqual(logs, [['fetch failed']]);
});
