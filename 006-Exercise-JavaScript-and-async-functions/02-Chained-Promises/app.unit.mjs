import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

for (const fn of ['chainedPromises', 'chainedPromisesWithPromise']) {
    test(`${fn} counts 1, 2, 3 one second apart`, async () => {
        const { context, logs } = loadScript(file);
        context[fn]();
        assert.deepEqual(logs, [['Start']]);
        for (const n of ['1', '2', '3']) {
            await advance(mock.timers, 1000);
            assert.deepEqual(logs.at(-1), [n]);
        }
        assert.equal(logs.length, 4);
    });
}

test('wait resolves after the given time', async () => {
    const { context } = loadScript(file);
    let done = false;
    context.wait(500).then(() => (done = true));
    await advance(mock.timers, 450);
    assert.equal(done, false);
    await advance(mock.timers, 100);
    assert.equal(done, true);
});
