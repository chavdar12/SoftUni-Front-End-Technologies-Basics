import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, advance } from '../../test-utils/index.mjs';

const file = new URL('./app.js', import.meta.url);
test.beforeEach(() => mock.timers.enable({ apis: ['setTimeout', 'setInterval'] }));
test.afterEach(() => mock.timers.reset());

async function play(choices) {
    const queue = [...choices];
    const { context, logs } = loadScript(file, { prompt: () => queue.shift() });
    await context.startAdventure();
    return logs.map((l) => l[0]);
}

test('left + fight wins the fight', async () => {
    const lines = await play(['left', 'fight', 'no']);
    assert.ok(lines.includes('You bravely fight the animal and win!'));
    assert.equal(lines.at(-1), 'Thank you for playing!');
});

test('right + open finds the treasure (input is case-insensitive)', async () => {
    const lines = await play(['RIGHT', 'Open', 'no']);
    assert.ok(lines.includes('You open the chest and find a treasure! You win!'));
});

test('answering yes replays the whole adventure', async () => {
    const lines = await play(['left', 'run', 'yes', 'right', 'leave', 'no']);
    assert.ok(lines.includes('You run away safely.'));
    assert.ok(lines.includes('You leave the chest and go back to the start.'));
    assert.equal(lines.filter((l) => l.startsWith('You find yourself')).length, 2);
});

test('cancelling a prompt ends the game instead of crashing', async () => {
    const lines = await play([null, null]);
    assert.equal(lines.at(-1), 'Thank you for playing!');
});
