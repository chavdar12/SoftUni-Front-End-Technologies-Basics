import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

async function search(text) {
    const window = await openPage(new URL('./list.html', import.meta.url));
    const { document } = window;
    document.getElementById('searchText').value = text;
    click(window, document.querySelector('button'));
    const bold = [...document.querySelectorAll('li')].filter((li) => li.style.fontWeight === 'bold').map((li) => li.textContent);
    return { result: document.getElementById('result').textContent, bold, window };
}

test('highlights case-insensitive matches and counts them', async () => {
    const { result, bold } = await search('bAnIa');
    assert.equal(result, '2 matches found');
    assert.deepEqual(bold, ['Dolna Bania', 'Gorna Bania']);
});

test('a new search clears the previous highlight', async () => {
    const { window } = await search('Sofia');
    const { document } = window;
    document.getElementById('searchText').value = 'Varna';
    click(window, document.querySelector('button'));
    const styled = [...document.querySelectorAll('li')].filter((li) => li.style.textDecoration === 'underline');
    assert.deepEqual(styled.map((li) => li.textContent), ['Varna']);
});

test('no matches', async () => {
    assert.equal((await search('xyz')).result, '0 matches found');
});
