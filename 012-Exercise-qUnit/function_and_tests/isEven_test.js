const { isEven } = require("./test_functions.js")

QUnit.module("isEven function tests", () => {

    QUnit.test("Even numbers", function (assert) {
        assert.ok(isEven(2), "Even number passed")
        assert.ok(isEven(10), "Even number passed")
        assert.ok(isEven(100), "Even number passed")
    });

    QUnit.test("Odd numbers", function (assert) {
        assert.notOk(isEven(3), "Odd number passed")
        assert.notOk(isEven(7), "Odd number passed")
        assert.notOk(isEven(27), "Odd number passed")
    });

    QUnit.test("Zero input", function (assert) {
        assert.ok(isEven(0), "Zero number passed")
    });

    QUnit.test("Negative number", function (assert) {
        assert.ok(isEven(-2), "Negative number passed")
    });
})