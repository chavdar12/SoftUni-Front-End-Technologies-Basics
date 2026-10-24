// Function to display remaining time
function displayRemainingTime(seconds) {
    console.log(`Remaining time: ${seconds} seconds`);
}

// Function to start the countdown
async function startCountdown() {
    const n = 10; // Change this to your desired countdown time

    for (let i = n; i >= 0; i--) {
        displayRemainingTime(i);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }

    console.log('Countdown finished!');
    // Simulate saving remaining time asynchronously (e.g., make an API call)
    // Replace the following line with your actual saving logic
    await saveRemainingTime();
}

// Simulate saving remaining time (replace with your actual logic)
async function saveRemainingTime() {
    // Simulate an asynchronous operation (e.g., API call)
    console.log('Saving remaining time...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds
    console.log('Remaining time saved successfully!');
}
