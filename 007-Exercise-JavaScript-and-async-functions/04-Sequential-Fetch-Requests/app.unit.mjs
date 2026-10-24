import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
// fake fetch: maps URL -> JSON body (or an Error to reject with)
function fakeFetch(routes, calls = []) {
    return async (url) => {
        calls.push(url);
        const body = routes[url];
        if (body instanceof Error) throw body;
        return { ok: body !== undefined, status: body !== undefined ? 200 : 404, json: async () => body };
    };
}
const luke = { name: 'Luke Skywalker' };
const c3po = { name: 'C-3PO' };

test('requests person 1, then person 2, logging each', async () => {
    const calls = [];
    const routes = { 'https://swapi.dev/api/people/1': luke, 'https://swapi.dev/api/people/2': c3po };
    const { context, logs } = loadScript(file, { fetch: fakeFetch(routes, calls) });
    const run = context.fetchSequential();
    assert.equal(calls.length, 1);
    await run;
    assert.deepEqual(calls, Object.keys(routes));
    assert.deepEqual(logs, [[luke], [c3po]]);
});
