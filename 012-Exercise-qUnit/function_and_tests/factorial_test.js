const { factorial } = require("./test_functions.js")

QUnit.module("factorial function test", () => {

    QUnit.test("Positive number", function(assert) {
        assert.equal(factorial(5), 120, "Positive number passed")
    });

    QUnit.test("Zero number", function(assert) {
        assert.equal(factorial(0), 1, "Zero number passed")
    });

    QUnit.test("Negative number", function(assert) {
        assert.equal(factorial(-1), 1, "Negative number passed")
    });
})