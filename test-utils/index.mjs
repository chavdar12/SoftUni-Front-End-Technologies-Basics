import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { setImmediate as nextMacrotask } from 'node:timers/promises';
import vm from 'node:vm';
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';

// Runs a plain browser script (no DOM needed) in a sandbox and records console.log calls.
// Timers go through globalThis so node:test's mock.timers can drive them.
export function loadScript(file, globals = {}) {
    if (file instanceof URL) file = fileURLToPath(file);
    const logs = [];
    const context = vm.createContext({
        console: { log: (...args) => logs.push(args) },
        setTimeout: (...a) => globalThis.setTimeout(...a),
        clearTimeout: (id) => globalThis.clearTimeout(id),
        setInterval: (...a) => globalThis.setInterval(...a),
        clearInterval: (id) => globalThis.clearInterval(id),
        Promise,
        Error,
        Math,
        ...globals,
    });
    vm.runInContext(readFileSync(file, 'utf8'), context, { filename: file });
    // top-level let/const are not context properties, so expose an evaluator for them
    return { context, logs, get: (expr) => vm.runInContext(expr, context) };
}

// Advances mocked timers in small steps so promise chains between timers settle.
export async function advance(mockTimers, ms, step = 50) {
    for (let t = 0; t < ms; t += step) {
        mockTimers.tick(step);
        await flush();
    }
}

export const flush = () => nextMacrotask();

class LocalOnlyLoader extends ResourceLoader {
    fetch(url, options) {
        // CDN scripts/styles are not needed for the tests and would make them network dependent
        return url.startsWith('file:') ? super.fetch(url, options) : Promise.resolve(Buffer.from(''));
    }
}

// Opens an HTML page in jsdom with its local scripts executed, and waits for window "load".
export async function openPage(file, { beforeParse } = {}) {
    if (file instanceof URL) file = fileURLToPath(file);
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', (e) => errors.push(e));
    const dom = await JSDOM.fromFile(file, {
        runScripts: 'dangerously',
        resources: new LocalOnlyLoader(),
        pretendToBeVisual: true,
        virtualConsole,
        beforeParse,
    });
    const { window } = dom;
    if (window.document.readyState !== 'complete') {
        await new Promise((resolve) => window.addEventListener('load', resolve));
    }
    window.pageErrors = errors;
    return window;
}

export const click = (window, el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
