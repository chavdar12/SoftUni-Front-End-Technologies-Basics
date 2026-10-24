import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('ticks every second and saves every 5 seconds', async () => {
    const { context, logs } = loadScript(file);
    context.startStopWatch();
    await advance(mock.timers, 5000);
    const lines = logs.map((l) => l[0]);
    assert.deepEqual(lines.filter((l) => l.startsWith('Elapsed')), [1, 2, 3, 4, 5].map((s) => `Elapsed time: ${s} s`));
    assert.deepEqual(lines.filter((l) => l.startsWith('Saved')), ['Saved time: 5 s']);
    context.stopStopWatch();
});

test('stop clears the timers and resets the counter', async () => {
    const { context, logs, get } = loadScript(file);
    context.startStopWatch();
    await advance(mock.timers, 2000);
    context.stopStopWatch();
    const count = logs.length;
    await advance(mock.timers, 6000);
    assert.equal(logs.length, count);
    assert.equal(get('stopWatchSec'), 0);
});

test('starting twice does not double the ticks', async () => {
    const { context, logs } = loadScript(file);
    context.startStopWatch();
    context.startStopWatch();
    await advance(mock.timers, 1000);
    assert.deepEqual(logs, [['Elapsed time: 1 s']]);
    context.stopStopWatch();
});
