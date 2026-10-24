const { nthPrime } = require("./test_functions.js")

QUnit.module("nthPrime functions tests", () => {

    QUnit.test("1th prime number", function(assert) {
        assert.equal(nthPrime(1), 2, "1th prime number passed")
    });

    QUnit.test("5th prime number", function(assert) {
        assert.equal(nthPrime(5), 11, "5th prime number passed")
    });

    QUnit.test("11th prime number", function(assert) {
        assert.equal(nthPrime(11), 31, "11th prime number passed")
    });
})
const { isPrime } = require("./test_functions.js")

QUnit.module("isPrime function tests", () => {

    QUnit.test("primes", function(assert) {
        [2, 3, 5, 7, 11, 13, 29, 97].forEach(n => assert.true(isPrime(n), `${n} is prime`));
    });

    QUnit.test("non-primes", function(assert) {
        [-7, 0, 1, 4, 9, 25, 49, 91].forEach(n => assert.false(isPrime(n), `${n} is not prime`));
    });
})
