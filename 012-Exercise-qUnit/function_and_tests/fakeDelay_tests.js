const { fake_delay } = require("./async_test_functions.js")

QUnit.module("fakeDelay function tests", () => {
    QUnit.test("test with 1 sec", async function(assert) {
        const start = Date.now();
        await fake_delay(1000);
        const end = Date.now();

        const diff = end - start;
        assert.ok(diff >= 1000, "Delay is atleast 1000 ms");
    })
})