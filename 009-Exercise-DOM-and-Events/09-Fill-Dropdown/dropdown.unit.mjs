import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

test('adds an option with the given text and value, then clears the inputs', async () => {
    const window = await openPage(new URL('./filldropdown.html', import.meta.url));
    const { document } = window;
    document.getElementById('newItemText').value = 'Sofia';
    document.getElementById('newItemValue').value = 'SOF';
    click(window, document.querySelector('input[type=button]'));
    const option = document.querySelector('#menu option');
    assert.equal(option.textContent, 'Sofia');
    assert.equal(option.value, 'SOF');
    assert.equal(document.getElementById('newItemText').value, '');
    assert.equal(document.getElementById('newItemValue').value, '');
});
