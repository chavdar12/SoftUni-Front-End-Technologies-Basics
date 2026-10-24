import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

test('More shows the extra text, Less hides it again', async () => {
    const window = await openPage(new URL('./accordion.html', import.meta.url));
    const { document } = window;
    const button = document.querySelector('.button');
    const extra = document.getElementById('extra');

    click(window, button);
    assert.equal(button.textContent, 'Less');
    assert.equal(extra.style.display, 'block');

    click(window, button);
    assert.equal(button.textContent, 'More');
    assert.equal(extra.style.display, 'none');
});
