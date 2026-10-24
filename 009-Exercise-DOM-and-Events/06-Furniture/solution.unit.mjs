import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

import { readFileSync } from 'node:fs';

const furniture = readFileSync(new URL('./furniture.json', import.meta.url), 'utf8');

async function setup() {
    const window = await openPage(new URL('./template.html', import.meta.url));
    const { document } = window;
    const [input, output] = document.querySelectorAll('textarea');
    const [generate, buy] = document.querySelectorAll('button');
    return { window, document, input, output, generate, buy };
}

test('Generate adds one row per JSON item', async () => {
    const { window, document, input, generate } = await setup();
    input.value = furniture;
    click(window, generate);
    const rows = document.querySelectorAll('tbody tr');
    const items = JSON.parse(furniture);
    assert.equal(rows.length, 1 + items.length);
    const last = rows[rows.length - 1].children;
    assert.equal(last[0].querySelector('img').src, items.at(-1).img);
    assert.equal(last[1].textContent, items.at(-1).name);
    assert.equal(last[2].textContent, items.at(-1).price);
    assert.equal(last[3].textContent, items.at(-1).decFactor);
    assert.equal(last[4].querySelector('input').type, 'checkbox');
});

test('Buy summarises only the checked rows', async () => {
    const { window, document, input, output, generate, buy } = await setup();
    input.value = JSON.stringify([
        { img: 'a.png', name: 'Sofa', price: '259', decFactor: '0.4' },
        { img: 'b.png', name: 'Chair', price: '100', decFactor: '0.8' },
        { img: 'c.png', name: 'Desk', price: '50', decFactor: '1.2' },
    ]);
    click(window, generate);
    const boxes = document.querySelectorAll('tbody input[type=checkbox]');
    boxes[1].checked = true; // Sofa
    boxes[3].checked = true; // Desk
    click(window, buy);
    assert.equal(output.value, 'Bought furniture: Sofa, Desk\nTotal price: 309\nAverage decoration factor: 0.8');
});

test('Buy with nothing checked reports zero instead of NaN', async () => {
    const { window, output, buy } = await setup();
    click(window, buy);
    assert.equal(output.value, 'Bought furniture: \nTotal price: 0\nAverage decoration factor: 0');
});
