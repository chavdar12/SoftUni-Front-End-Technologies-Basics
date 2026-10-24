import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

const page = new URL('./template.html', import.meta.url);

async function transform(text, convention) {
    const window = await openPage(page);
    const { document } = window;
    document.getElementById('text').value = text;
    document.getElementById('naming-convention').value = convention;
    click(window, document.querySelector('input[type=button]'));
    return document.getElementById('result').textContent;
}

test('Camel Case', async () => assert.equal(await transform('this is an example', 'Camel Case'), 'thisIsAnExample'));
test('Pascal Case', async () => assert.equal(await transform('secOND eXamPLE', 'Pascal Case'), 'SecondExample'));
test('unknown convention gives Error!', async () => assert.equal(await transform('Invalid Input', 'Another Case'), 'Error!'));
test('extra spaces are ignored', async () => assert.equal(await transform('  a  b ', 'Camel Case'), 'aB'));
test('empty text gives empty result', async () => assert.equal(await transform('', 'Pascal Case'), ''));
