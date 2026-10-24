import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('catches the rejection and logs the error', async () => {
    const { context, logs } = loadScript(file);
    const run = context.promiseRejectionAsync();
    await advance(mock.timers, 1050);
    await run;
    assert.equal(logs.length, 1);
    assert.equal(logs[0][0].message, 'Error is found!');
});
