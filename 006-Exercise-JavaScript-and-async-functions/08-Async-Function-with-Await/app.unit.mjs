import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('awaits and logs the message after 2s', async () => {
    const { context, logs } = loadScript(file);
    context.simplePromiseAsync();
    await advance(mock.timers, 2050);
    assert.deepEqual(logs, [['Async/Await is awesome!']]);
});
