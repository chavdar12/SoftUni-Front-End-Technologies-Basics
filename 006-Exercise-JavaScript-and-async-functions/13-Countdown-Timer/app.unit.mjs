import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('counts down from 10 to 0, then saves', async () => {
    const { context, logs } = loadScript(file);
    const run = context.startCountdown();
    await advance(mock.timers, 11000 + 2000);
    await run;
    const lines = logs.map((l) => l[0]);
    const expected = [];
    for (let i = 10; i >= 0; i--) expected.push(`Remaining time: ${i} seconds`);
    assert.deepEqual(lines, [...expected, 'Countdown finished!', 'Saving remaining time...', 'Remaining time saved successfully!']);
});
