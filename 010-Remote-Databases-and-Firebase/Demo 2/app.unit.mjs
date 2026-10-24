import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, click, flush } from '../../test-utils/index.mjs';

// in-memory stand-in for the firebase compat SDK loaded from the CDN
function fakeFirebase(docs, { failWrites = false } = {}) {
    return {
        initializeApp() {},
        firestore: () => ({
            collection: () => ({
                doc: () => ({ set: async (d) => { if (failWrites) throw new Error('denied'); docs.push(d); } }),
                get: async () => ({ forEach: (fn) => docs.forEach((d) => fn({ data: () => d })) }),
            }),
        }),
    };
}

async function setup(docs, options) {
    const alerts = [];
    const window = await openPage(new URL('./index.html', import.meta.url), {
        beforeParse(w) {
            w.firebase = fakeFirebase(docs, options);
            w.alert = (m) => alerts.push(m);
        },
    });
    return { window, document: window.document, alerts };
}

test('submit saves the form values and alerts after the write', async () => {
    const docs = [];
    const { window, document, alerts } = await setup(docs);
    document.getElementById('fname').value = 'Ivan';
    document.getElementById('lname').value = 'Petrov';
    document.getElementById('email').value = 'ivan@abv.bg';
    document.getElementById('country-input').value = 'Bulgaria';
    click(window, document.getElementById('submit'));
    await flush();
    assert.deepEqual(docs.map((d) => ({ ...d })), [{ fname: 'Ivan', lname: 'Petrov', email: 'ivan@abv.bg', country: 'Bulgaria' }]);
    assert.deepEqual(alerts, ['Form is submitted successfully']);
});

test('a failed write does not claim success', async () => {
    const { window, document, alerts } = await setup([], { failWrites: true });
    click(window, document.getElementById('submit'));
    await flush();
    assert.deepEqual(alerts, []);
});

test('Get Saved Users lists every record, replacing the old list', async () => {
    const docs = [
        { fname: 'A', lname: 'B', email: 'a@b.c', country: 'BG' },
        { fname: 'C', lname: 'D', email: 'c@d.e', country: 'DE' },
    ];
    const { window, document } = await setup(docs);
    const button = document.getElementById('getRecords');
    click(window, button);
    await flush();
    click(window, button);
    await flush();
    const items = [...document.querySelectorAll('#records-list li')].map((li) => li.textContent);
    assert.deepEqual(items, [
        'First name: A, Last Name: B, Email: a@b.c, Country: BG',
        'First name: C, Last Name: D, Email: c@d.e, Country: DE',
    ]);
});
