import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

const fields = { employee: 'Ivan', category: 'Hardware', urgency: 'High', team: 'Hardware Support Division', description: 'Broken mouse' };

async function setup() {
    const window = await openPage(new URL('./index.html', import.meta.url));
    const { document } = window;
    const $ = (s) => document.querySelector(s);
    const fill = (values = fields) => Object.entries(values).forEach(([id, v]) => (document.getElementById(id).value = v));
    const values = () => Object.keys(fields).map((id) => document.getElementById(id).value);
    return { window, $, fill, values, add: () => click(window, document.getElementById('add-btn')) };
}

test('Add with an empty field does nothing', async () => {
    const { $, fill, add } = await setup();
    fill({ ...fields, urgency: '' });
    add();
    assert.equal($('.preview-list').children.length, 0);
});

test('Add shows the problem in preview and clears + disables the form', async () => {
    const { $, fill, values, add } = await setup();
    fill();
    add();
    const ps = [...$('.preview-list li.problem-content article').children].map((p) => p.textContent);
    assert.deepEqual(ps, ['From: Ivan', 'Category: Hardware', 'Urgency: High', 'Assigned to: Hardware Support Division', 'Description: Broken mouse']);
    assert.deepEqual(values(), ['', '', '', '', '']);
    assert.equal($('#add-btn').disabled, true);
});

test('Edit restores the form and removes the preview', async () => {
    const { window, $, fill, values, add } = await setup();
    fill();
    add();
    click(window, $('.edit-btn'));
    assert.deepEqual(values(), Object.values(fields));
    assert.equal($('.preview-list').children.length, 0);
    assert.equal($('#add-btn').disabled, false);
});

test('Continue -> Resolved -> Clear walks the problem through every list', async () => {
    const { window, $, fill, add } = await setup();
    fill();
    add();
    click(window, $('.continue-btn'));
    assert.equal($('.preview-list').children.length, 0);
    assert.equal($('#add-btn').disabled, false);
    assert.ok($('.pending-list li .resolve-btn'));

    click(window, $('.resolve-btn'));
    assert.equal($('.pending-list').children.length, 0);
    assert.equal($('.resolved-list li article p').textContent, 'From: Ivan');

    click(window, $('.clear-btn'));
    assert.equal($('.resolved-list').children.length, 0);
});
