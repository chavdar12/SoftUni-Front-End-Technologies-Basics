import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
test.afterEach(() => mock.timers.reset());

test('logs the status of every promise after all settle', async () => {
    const { context, logs } = loadScript(file);
    context.multiplePromises();
    await advance(mock.timers, 2950);
    assert.deepEqual(logs, []);
    await advance(mock.timers, 100);
    assert.deepEqual(logs, [
        ['fulfilled', 'Promise 1 resolved'],
        ['fulfilled', 'Promise 2 resolved'],
        ['rejected', 'Promise 3 rejected'],
    ]);
});
