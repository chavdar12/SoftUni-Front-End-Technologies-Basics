import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
test.afterEach(() => mock.timers.reset());

test('startAsyncGenerator logs each task a second apart', async () => {
    const { context, logs } = loadScript(file);
    context.startAsyncGenerator();
    for (const n of [1, 2, 3]) {
        await advance(mock.timers, 1000);
        assert.deepEqual(logs.at(-1), [`Task ${n} is done`]);
    }
});

test('asyncGenerator resolves with the generator return value', async () => {
    const { context } = loadScript(file);
    const result = await context.asyncGenerator(function* () {
        const a = yield Promise.resolve(2);
        const b = yield 3;
        return a * b;
    });
    assert.equal(result, 6);
});

test('asyncGenerator throws a rejected promise back into the generator', async () => {
    const { context } = loadScript(file);
    const result = await context.asyncGenerator(function* () {
        try {
            yield Promise.reject(new Error('boom'));
        } catch (e) {
            return e.message;
        }
    });
    assert.equal(result, 'boom');
});

test('asyncGenerator rejects when the generator throws before yielding', async () => {
    const { context } = loadScript(file);
    const gen = function* () { throw new Error('early'); };
    await assert.rejects(context.asyncGenerator(gen), { message: 'early' });
});
