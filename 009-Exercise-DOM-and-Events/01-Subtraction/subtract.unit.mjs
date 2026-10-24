import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

const page = new URL('./index.html', import.meta.url);

test('subtracts the default values on load', async () => {
    const window = await openPage(page);
    assert.equal(Number(window.document.getElementById('result').textContent).toFixed(2), '-8.85');
});

test('Calculate button recomputes from the inputs', async () => {
    const window = await openPage(page);
    const { document } = window;
    document.getElementById('firstNumber').value = '10';
    document.getElementById('secondNumber').value = '4';
    click(window, document.getElementById('triggerEvent'));
    assert.equal(document.getElementById('result').textContent, '6');
});
