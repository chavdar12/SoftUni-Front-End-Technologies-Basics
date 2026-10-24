const { fetchData } = require("./async_test_functions.js")

const url = "https://www.zippopotam.us/bg/8000";

const invalidPostalCode = "https://www.zippopotam.us/bg/12345697";

const invalidUrl = "https://www.zippopppotam.us/bg/8000"



QUnit.module("fetchData function tests", () => {
    QUnit.test("fetchData from correct URL", async function(assert) {
        const data = await fetchData(url);

        assert.ok(data.hasOwnProperty("post code"), "Check for specific prop");
        assert.equal(data["post code"], 8000, "Checking prop value");

        assert.ok(data.hasOwnProperty("country"), "Check for specific prop");
        assert.equal(data["country"], "Bulgaria", "Checking prop value");

        assert.ok(data.hasOwnProperty("country abbreviation"), "Check for specific prop");
        assert.equal(data["country abbreviation"], "BG", "Checking prop value");

        assert.ok(Array.isArray(data.places));
        assert.equal(data.places.length, 1);

        const place = data.places[0];

        assert.ok(place.hasOwnProperty("place name"), "Check for specific prop");
        assert.equal(place["place name"], "Бургас / Burgas", "Checking prop value");

        assert.ok(place.hasOwnProperty("longitude"), "Check for specific prop");
        assert.equal(place["longitude"], "27.4667", "Checking prop value");

        assert.ok(place.hasOwnProperty("state"), "Check for specific prop");
        assert.equal(place["state"], "Бургас / Burgas", "Checking prop value");

        assert.ok(place.hasOwnProperty("state abbreviation"), "Check for specific prop");
        assert.equal(place["state abbreviation"], "BGS", "Checking prop value");

        assert.ok(place.hasOwnProperty("latitude"), "Check for specific prop");
        assert.equal(place["latitude"], "42.5", "Checking prop value");
    })

    QUnit.test("fetchData from invalid postal code", async function(assert){
        const data = await fetchData(invalidPostalCode);

        assert.notOk(data);
    })

    QUnit.test("fetchData from invalid URL", async function(assert){
        const data = await fetchData(invalidUrl);

        assert.equal(data, "fetch failed");
    })
})