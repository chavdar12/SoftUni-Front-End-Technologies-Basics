import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

const fields = { 'snowman-name': 'Frosty', 'snowman-height': '120', location: 'Sofia', 'creator-name': 'Ivan', 'special-attribute': 'Carrot Nose' };

async function setup() {
    const window = await openPage(new URL('./index.html', import.meta.url));
    const { document } = window;
    const $ = (s) => document.querySelector(s);
    const fill = (values = fields) => Object.entries(values).forEach(([id, v]) => (document.getElementById(id).value = v));
    const values = () => Object.keys(fields).map((id) => document.getElementById(id).value);
    return { window, document, $, fill, values, add: () => click(window, $('.add-btn')) };
}

test('Add with an empty field does nothing', async () => {
    const { $, fill, add } = await setup();
    fill({ ...fields, location: '' });
    add();
    assert.equal($('.snowman-preview').children.length, 0);
});

test('Add moves the data into the preview, clears and disables the form', async () => {
    const { $, fill, values, add } = await setup();
    fill();
    add();
    const ps = [...$('.snowman-preview li.snowman-info article').children].map((p) => p.textContent);
    assert.deepEqual(ps, ['Name: Frosty', 'Height: 120', 'Location: Sofia', 'Creator: Ivan', 'Attribute: Carrot Nose']);
    assert.ok($('.snowman-preview .btn-container .edit-btn'));
    assert.ok($('.snowman-preview .btn-container .next-btn'));
    assert.deepEqual(values(), ['', '', '', '', '']);
    assert.equal($('.add-btn').disabled, true);
});

test('Edit puts every value, including height, back into the form', async () => {
    const { window, $, fill, values, add } = await setup();
    fill();
    add();
    click(window, $('.edit-btn'));
    assert.deepEqual(values(), Object.values(fields));
    assert.equal($('.snowman-preview').children.length, 0);
    assert.equal($('.add-btn').disabled, false);
});

test('Next moves the snowman to the list, Send shows the back screen', async () => {
    const { window, document, $, fill, add } = await setup();
    fill();
    add();
    click(window, $('.next-btn'));
    assert.equal($('.snowman-preview').children.length, 0);
    const li = $('.snow-list li.snowman-content');
    assert.equal(li.querySelector('article p').textContent, 'Name: Frosty');

    click(window, li.querySelector('.send-btn'));
    assert.equal(document.getElementById('hero'), null);
    assert.equal(document.getElementById('back-img').hidden, false);
    assert.equal($('body > .back-btn').textContent, 'Back');
});
