import { add, subtract } from "../functions.js";

QUnit.module("Math operations", {
    beforeEach: function () {
        // Execute code before each test
    },
    afterEach: function () {
        // Execute code after each test
    }
}, function () {
    QUnit.test("add test", function (assert) {
        assert.equal(add(1, 2), 3, "1 + 2 should be equal to 3");
    });
    QUnit.test("subtract test", function (assert) {
        assert.equal(subtract(2, 2), 0, "2 - 2 should be equal to 0");
    });
});

// Async testing
QUnit.test("asynchronous test example", function (assert) {
    var done = assert.async();
    setTimeout(function () {
        assert.ok(true, "asynchronous test passed");
        done();
    }, 2000);
});