import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../../test-utils/index.mjs';

test('encode shifts every char up by one, decode shifts it back', async () => {
    const window = await openPage(new URL('./template.html', import.meta.url));
    const { document } = window;
    const [message, received] = document.querySelectorAll('textarea');
    const [encode, decode] = document.querySelectorAll('button');

    message.value = 'Hello, SoftUni!';
    click(window, encode);
    assert.equal(message.value, '');
    assert.equal(received.value, 'Ifmmp-!TpguVoj"');

    click(window, decode);
    assert.equal(received.value, 'Hello, SoftUni!');
});
