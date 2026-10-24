import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, openPage, click, advance, flush } from '../../test-utils/index.mjs';

const repos = [{ name: 'repo-a' }, { name: 'repo-b' }];

test('functionsFetch.js shows the fetched repos as JSON', async () => {
    const calls = [];
    const window = await openPage(new URL('./index.html', import.meta.url), {
        beforeParse(w) {
            w.fetch = async (url) => (calls.push(url), { json: async () => repos });
        },
    });
    click(window, window.document.getElementById('load'));
    await flush();
    assert.deepEqual(calls, ['https://api.github.com/users/testnakov/repos']);
    assert.deepEqual(JSON.parse(window.document.getElementById('res').textContent), repos);
});

test('functions.js (XMLHttpRequest) writes the response text on status 200', () => {
    const res = { textContent: '' };
    let button;
    let xhr;
    class FakeXHR {
        constructor() { xhr = this; this.listeners = {}; }
        addEventListener(type, fn) { this.listeners[type] = fn; }
        open(method, url) { this.method = method; this.url = url; }
        send() {}
    }
    const document = {
        querySelector: () => (button = { addEventListener: (_, fn) => (button.onClick = fn) }),
        getElementById: () => res,
    };
    loadScript(new URL('./functions.js', import.meta.url), { document, XMLHttpRequest: FakeXHR });
    button.onClick();
    assert.equal(xhr.method, 'GET');
    assert.equal(xhr.url, 'https://api.github.com/users/testnakov/repos');

    Object.assign(xhr, { readyState: 4, status: 404, responseText: 'nope' });
    xhr.listeners.readystatechange();
    assert.equal(res.textContent, '');

    Object.assign(xhr, { status: 200, responseText: '[1,2]' });
    xhr.listeners.readystatechange();
    assert.equal(res.textContent, '[1,2]');
});
