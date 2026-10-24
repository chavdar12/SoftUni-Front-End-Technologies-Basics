// Initialize the sum of even numbers
let evenSum = 0;

// Function to calculate the sum of even numbers
function calculateEvenSum() {
    // 2 + 4 + ... + 2k = k(k + 1); BigInt because the total is past Number.MAX_SAFE_INTEGER
    const k = 500000000n;
    evenSum = k * (k + 1n);
}

// Function to handle user commands
function handleCommand(command) {
    switch (command) {
        case 'show':
            console.log(`Current sum of even numbers: ${evenSum}`);
            break;
        case 'exit':
            console.log('Calculation stopped.');
            break;
        default:
            console.log('Invalid command. Use "show" or "exit".');
    }
}

// Start the calculation when the button is clicked
function startCalculation() {
    calculateEvenSum();
    console.log('Calculation started. Use "show" to display the sum or "exit" to stop.');

    // Read user input using prompt
    let userInput;
    do {
        userInput = (prompt('Enter command ("show" or "exit"):') ?? 'exit').trim().toLowerCase();
        handleCommand(userInput);
    } while (userInput !== 'exit');
}