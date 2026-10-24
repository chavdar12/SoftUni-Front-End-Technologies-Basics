import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('logs the rejection reason after 1s', async () => {
    const { context, logs } = loadScript(file);
    context.promiseRejection();
    await advance(mock.timers, 1050);
    assert.deepEqual(logs, [['Something went wrong!']]);
});
