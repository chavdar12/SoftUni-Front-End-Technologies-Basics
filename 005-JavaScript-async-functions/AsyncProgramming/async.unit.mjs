import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, openPage, click, advance, flush } from '../../test-utils/index.mjs';

test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
test.afterEach(() => mock.timers.reset());

test('function.js logs synchronously first, then the timeout callback after 4s', async () => {
    const { logs } = loadScript(new URL('./function.js', import.meta.url));
    assert.deepEqual(logs, [['Hello'], ['Hello again']]);
    await advance(mock.timers, 4000, 500);
    assert.deepEqual(logs, [['Hello'], ['Hello again'], ['GoodBye']]);
});

test('example.js calls the passed callback', () => {
    const { logs, context } = loadScript(new URL('./example.js', import.meta.url));
    assert.deepEqual(logs, [['Running sprint']]);
    context.category(() => 'Walking', 'slow');
    assert.deepEqual(logs.at(-1), ['Walking slow']);
});
