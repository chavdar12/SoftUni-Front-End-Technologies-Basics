import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

async function setup() {
    const window = await openPage(new URL('./template.html', import.meta.url));
    const profile = window.document.querySelectorAll('.profile')[0];
    return { window, profile, button: profile.querySelector('button'), hidden: profile.querySelector('div') };
}

test('a locked profile ignores Show more', async () => {
    const { window, button, hidden } = await setup();
    click(window, button);
    assert.equal(button.textContent, 'Show more');
    assert.equal(hidden.style.display, '');
});

test('an unlocked profile toggles its hidden fields', async () => {
    const { window, profile, button, hidden } = await setup();
    profile.querySelector('input[value=unlock]').checked = true;
    click(window, button);
    assert.equal(button.textContent, 'Hide it');
    assert.equal(hidden.style.display, 'inline');
    click(window, button);
    assert.equal(button.textContent, 'Show more');
    assert.equal(hidden.style.display, 'none');
});

test('listeners are attached exactly once', async () => {
    const { window, profile, button } = await setup();
    profile.querySelector('input[value=unlock]').checked = true;
    click(window, button);
    // a double registration would toggle twice and land back on Show more
    assert.equal(button.textContent, 'Hide it');
});
