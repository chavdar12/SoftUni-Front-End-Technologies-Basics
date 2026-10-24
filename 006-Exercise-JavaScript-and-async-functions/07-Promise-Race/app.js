function racePromise() {
    let promise1 = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("Resolve 1");
        });
    });

    let promise2 = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("Resolve 2");
        });
    });

    let promise3 = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("Resolve 3");
        });
    });

    Promise.race([promise1, promise2, promise3])
        .then(function (result) {
            console.log(result);
        });
}