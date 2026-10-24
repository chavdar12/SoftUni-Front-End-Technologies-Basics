import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click } from '../test-utils/index.mjs';

async function setup(...tasks) {
    const window = await openPage(new URL('./index.html', import.meta.url));
    const { document } = window;
    for (const text of tasks) {
        document.getElementById('task-input').value = text;
        click(window, document.getElementById('add-task'));
    }
    const filter = (value) => {
        document.getElementById('filter').value = value;
        document.getElementById('filter').dispatchEvent(new window.Event('change'));
    };
    const visible = () => [...document.querySelectorAll('.task')].filter((li) => li.style.display !== 'none').map((li) => li.firstChild.textContent);
    return { window, document, filter, visible };
}

test('adding tasks creates numbered list items and clears the input', async () => {
    const { document } = await setup('A', 'B');
    const tasks = document.querySelectorAll('.task');
    assert.deepEqual([...tasks].map((t) => t.id), ['task-0', 'task-1']);
    assert.equal(document.getElementById('task-input').value, '');
});

test('blank input is ignored', async () => {
    const { document } = await setup('   ');
    assert.equal(document.querySelectorAll('.task').length, 0);
});

test('Delete removes the task, Complete marks it', async () => {
    const { window, document } = await setup('A', 'B');
    click(window, document.querySelector('#task-0 .delete-task'));
    click(window, document.querySelector('#task-1 .task-complete'));
    assert.equal(document.getElementById('task-0'), null);
    assert.ok(document.getElementById('task-1').classList.contains('completed'));
});

test('filter shows all / active / completed', async () => {
    const { window, document, filter, visible } = await setup('A', 'B', 'C');
    click(window, document.querySelector('#task-1 .task-complete'));
    filter('completed');
    assert.deepEqual(visible(), ['B']);
    filter('active');
    assert.deepEqual(visible(), ['A', 'C']);
    filter('all');
    assert.deepEqual(visible(), ['A', 'B', 'C']);
});
