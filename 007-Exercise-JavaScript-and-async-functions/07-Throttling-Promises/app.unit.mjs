import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
test.afterEach(() => mock.timers.reset());

test('runs at most 2 tasks at a time and returns results in order', async () => {
    const { context, logs } = loadScript(file);
    const run = context.throttlePromises();
    // tasks 1 (1000ms) and 2 (1500ms) start first; 3 (500ms) starts when 1 ends; 4 (2000ms) when 3 ends
    await advance(mock.timers, 1000);
    assert.deepEqual(logs.map((l) => l[0]), ['Task 1']);
    await advance(mock.timers, 500);
    assert.deepEqual(logs.map((l) => l[0]), ['Task 1', 'Task 2', 'Task 3']);
    await advance(mock.timers, 2000);
    await run;
    assert.deepEqual(logs.at(-1), ['All task are done', ['Task 1 done', 'Task 2 done', 'Task 3 done', 'Task 4 done']]);
});
