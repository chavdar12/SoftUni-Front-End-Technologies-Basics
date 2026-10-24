import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('both handlers log the resolved value', async () => {
    const { context, logs } = loadScript(file);
    context.promiseWithMultipleHandlers();
    await advance(mock.timers, 2050);
    assert.deepEqual(logs, [['Hello World'], ['Hello World']]);
});
