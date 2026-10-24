const { fibonacci } = require("./test_functions.js")

QUnit.module("fibonacci function tests", () => {

    QUnit.test("zero as input", function (assert) {
        assert.deepEqual(fibonacci(0), [], "zero as input passed")
    });

    QUnit.test("1 as input", function (assert) {
        assert.deepEqual(fibonacci(1), [0], "1 as input passed")
    });

    QUnit.test("5 as input", function (assert) {
        assert.deepEqual(fibonacci(5), [0, 1, 1, 2, 3], "5 as input passed")
    });

    QUnit.test("10 as input", function (assert) {
        assert.deepEqual(fibonacci(10), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "10 as input passed")
    });
})