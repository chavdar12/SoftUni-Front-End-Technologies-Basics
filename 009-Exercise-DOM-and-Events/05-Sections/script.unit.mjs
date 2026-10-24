import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

test('creates hidden sections that are revealed on click', async () => {
    const window = await openPage(new URL('./index.html', import.meta.url));
    const sections = window.document.querySelectorAll('#content > div');
    assert.equal(sections.length, 4);
    const paragraphs = [...sections].map((d) => d.querySelector('p'));
    assert.deepEqual(paragraphs.map((p) => p.textContent), ['Section 1', 'Section 2', 'Section 3', 'Section 4']);
    assert.ok(paragraphs.every((p) => p.style.display === 'none'));

    click(window, sections[2]);
    assert.equal(paragraphs[2].style.display, '');
    assert.equal(paragraphs[0].style.display, 'none');
});
