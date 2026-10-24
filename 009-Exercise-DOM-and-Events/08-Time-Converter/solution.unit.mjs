import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

async function convert(unit, value) {
    const window = await openPage(new URL('./index.html', import.meta.url));
    const { document } = window;
    document.getElementById(unit).value = value;
    click(window, document.getElementById(unit + 'Btn'));
    return ['days', 'hours', 'minutes', 'seconds'].map((id) => document.getElementById(id).value);
}

test('days', async () => assert.deepEqual(await convert('days', '1'), ['1', '24', '1440', '86400']));
test('hours', async () => assert.deepEqual(await convert('hours', '48'), ['2', '48', '2880', '172800']));
test('minutes', async () => assert.deepEqual(await convert('minutes', '1440'), ['1', '24', '1440', '86400']));
test('seconds', async () => assert.deepEqual(await convert('seconds', '43200'), ['0.5', '12', '720', '43200']));

test('clicking outside a button does nothing and throws nothing', async () => {
    const window = await openPage(new URL('./index.html', import.meta.url));
    click(window, window.document.querySelector('h1'));
    assert.equal(window.document.getElementById('days').value, '');
    assert.deepEqual(window.pageErrors, []);
});
