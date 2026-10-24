import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('logs all three results after 3s', async () => {
    const { context, logs } = loadScript(file);
    context.chainedPromisesAsync();
    await advance(mock.timers, 2950);
    assert.deepEqual(logs, []);
    await advance(mock.timers, 100);
    assert.deepEqual(logs, [['Promise 1', 'Promise 2', 'Promise 3']]);
});
