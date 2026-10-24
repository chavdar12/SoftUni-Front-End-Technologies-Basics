const { pascalsTriangle } = require("./test_functions.js")

QUnit.module("pascalTriangle function tests", () => {

    QUnit.test("zero as input", function (assert) {
        assert.deepEqual(pascalsTriangle(0), [], "zero as input passed")
    });

    QUnit.test("one as input", function (assert) {
        assert.deepEqual(pascalsTriangle(1), [[1]], "one as input passed")
    });

    QUnit.test("five as input", function (assert) {
        assert.deepEqual(pascalsTriangle(5), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]], "five as input passed")
    });

    QUnit.test("eight as input", function (assert) {
        assert.deepEqual(pascalsTriangle(8), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1], [1, 6, 15, 20, 15, 6, 1], [1, 7, 21, 35, 35, 21, 7, 1]], "eight as input passed")
    });
})