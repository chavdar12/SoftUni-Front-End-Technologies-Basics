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

test('fetches person 1 and logs the parsed JSON', async () => {
    const calls = [];
    const { context, logs } = loadScript(file, { fetch: fakeFetch({ 'https://swapi.dev/api/people/1': luke }, calls) });
    await context.fetchData();
    assert.deepEqual(calls, ['https://swapi.dev/api/people/1']);
    assert.deepEqual(logs, [[luke]]);
});
