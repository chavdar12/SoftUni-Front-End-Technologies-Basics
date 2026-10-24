import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

test('handleCommand responds to show, exit and anything else', () => {
    const { context, logs } = loadScript(file);
    context.handleCommand('show');
    context.handleCommand('exit');
    context.handleCommand('foo');
    assert.deepEqual(logs.map((l) => l[0]), [
        'Current sum of even numbers: 0',
        'Calculation stopped.',
        'Invalid command. Use "show" or "exit".',
    ]);
});

test('startCalculation computes the exact sum, same on every click and stops on Cancel', () => {
    const answers = [' SHOW ', null, 'show', 'exit'];
    const { context, get } = loadScript(file, { prompt: () => answers.shift() });
    context.startCalculation();
    const first = get('evenSum');
    assert.equal(first, 250000000500000000n);
    context.startCalculation();
    assert.equal(get('evenSum'), first);
    assert.equal(answers.length, 0);
});
