const { isPalindrome } = require("./test_functions.js")

QUnit.module("isPalindrome function test", () => {

    QUnit.test("single palindrome word", function(assert) {
        assert.ok(isPalindrome("racecar"), "single palindrome word passed")
    });

    QUnit.test("multi palindrome words", function(assert) {
        assert.ok(isPalindrome("A man, a plan, a canal, Panama!"), "multi palindrome words passed")
    });

    QUnit.test("single non-palindrome word", function(assert) {
        assert.notOk(isPalindrome("hello"), "single non-palindrome word passed")
    });

    QUnit.test("empty string as input", function(assert) {
        assert.notOk(isPalindrome(""), "empty string as input passed")
    });
})