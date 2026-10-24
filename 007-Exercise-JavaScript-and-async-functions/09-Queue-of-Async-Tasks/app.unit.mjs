import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
test.afterEach(() => mock.timers.reset());

test('runs queued tasks one after another in insertion order', async () => {
    const { context, logs } = loadScript(file);
    context.startQueue();
    await advance(mock.timers, 1000);
    assert.deepEqual(logs, [['Task 1 is done']]);
    await advance(mock.timers, 500);
    assert.deepEqual(logs, [['Task 1 is done'], ['Task 2 is done']]);
    await advance(mock.timers, 1500);
    assert.deepEqual(logs, [['Task 1 is done'], ['Task 2 is done'], ['Task 3 is done']]);
});

test('AsyncQueue is idle again after draining', async () => {
    const { get } = loadScript(file);
    const queue = new (get('AsyncQueue'))();
    const order = [];
    queue.enque(async () => order.push(1));
    queue.enque(async () => order.push(2));
    await advance(mock.timers, 50);
    assert.deepEqual(order, [1, 2]);
    assert.equal(queue.processing, false);
});
