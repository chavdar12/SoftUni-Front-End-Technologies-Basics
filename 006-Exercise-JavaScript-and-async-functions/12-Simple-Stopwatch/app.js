let stopWatchSec = 0;
let stopWatchInterval;
let savedTimeInterval;

function startStopWatch() {
    if (stopWatchInterval) return;

    stopWatchInterval = setInterval(function () {
        stopWatchSec++;
        console.log("Elapsed time: " + stopWatchSec + " s")
    }, 1000);

    savedTimeInterval = setInterval(async function() {
        await saveTime(stopWatchSec);
    }, 5000);
}

function stopStopWatch() {
    clearInterval(stopWatchInterval);
    clearInterval(savedTimeInterval);
    stopWatchInterval = undefined;
    stopWatchSec = 0;
}

function saveTime(saveTime) {
    return new Promise(function (resolve, reject) {
        console.log("Saved time: " + saveTime + " s");
        resolve();
    })
}