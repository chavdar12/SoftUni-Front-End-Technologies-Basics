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

test('logs the data when the response is ok', async () => {
    const { context, logs } = loadScript(file, { fetch: fakeFetch({ 'https://swapi.dev/api/people/1': luke }) });
    await context.fetchDataWithErrorHandling();
    assert.deepEqual(logs, [[luke]]);
});

test('logs an error for a non-ok response', async () => {
    const { context, logs } = loadScript(file, { fetch: fakeFetch({}) });
    await context.fetchDataWithErrorHandling();
    assert.equal(logs[0][0], 'Error while fetching data: ');
    assert.equal(logs[0][1].message, 'Network response is not ok');
});

test('logs an error when the network fails', async () => {
    const { context, logs } = loadScript(file, { fetch: fakeFetch({ 'https://swapi.dev/api/people/1': new Error('offline') }) });
    await context.fetchDataWithErrorHandling();
    assert.equal(logs[0][1].message, 'offline');
});
