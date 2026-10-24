import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, openPage, click, advance, flush } from '../../test-utils/index.mjs';

test('promise.js logs the success message after 1s', async () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    try {
        const { logs } = loadScript(new URL('./promise.js', import.meta.url));
        await advance(mock.timers, 1000);
        assert.deepEqual(logs, [['Operation successful']]);
    } finally {
        mock.timers.reset();
    }
});

test('promiseMethods.js validateInput resolves only for the expected input', async () => {
    const { context, logs } = loadScript(new URL('./promiseMethods.js', import.meta.url));
    await flush();
    assert.deepEqual(logs, [['Valid Input']]);
    assert.equal(await context.validateInput('expectedInput'), 'Valid Input');
    await assert.rejects(context.validateInput('other'), (e) => e === 'Invalid Input');
});
