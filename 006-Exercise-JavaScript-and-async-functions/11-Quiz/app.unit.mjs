import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

function run(answers) {
    const queue = [...answers];
    const script = loadScript(file, { prompt: () => queue.shift() });
    return script.context.startQuiz().then(() => script.logs.map((l) => l.join(' ')));
}

test('all correct answers score 3', async () => {
    assert.deepEqual(await run(['1', '2', '0']), ['Correct!', 'Correct!', 'Correct!', 'Final score: 3']);
});

test('wrong and cancelled answers are not counted', async () => {
    assert.deepEqual(await run(['0', null, '0']), ['Not correct!', 'Not correct!', 'Correct!', 'Final score: 1']);
});

test('askQuestion lists the numbered answers in the prompt', async () => {
    let shown;
    const { context } = loadScript(file, { prompt: (m) => ((shown = m), '1') });
    assert.equal(await context.askQuestion('Q?', ['a', 'b']), 1);
    assert.equal(shown, 'Q?\n0. a\n1. b\n');
});
