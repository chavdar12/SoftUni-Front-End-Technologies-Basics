import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

for (const fn of ['helloWorld', 'helloWorldWithPromise', 'helloWorldWithAsync']) {
    test(`${fn} logs Hello now and World after 2s`, async () => {
        const { context, logs } = loadScript(file);
        context[fn]();
        assert.deepEqual(logs, [['Hello']]);
        await advance(mock.timers, 1950);
        assert.deepEqual(logs, [['Hello']]);
        await advance(mock.timers, 100);
        assert.deepEqual(logs, [['Hello'], ['World']]);
    });
}
