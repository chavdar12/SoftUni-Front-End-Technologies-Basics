import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('logs only the first settled promise', async () => {
    const { context, logs } = loadScript(file);
    context.racePromise();
    await advance(mock.timers, 100);
    assert.deepEqual(logs, [['Resolve 1']]);
});
