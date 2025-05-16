const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

// Generate timestamp for the test run
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const csvFile = path.join(resultsDir, `performance-test-${timestamp}.csv`);

// Run k6 test and output results to CSV
const command = `k6 run --out csv=${csvFile} loadTest.js`;

console.log('Starting performance test...');
console.log(`Results will be saved to: ${csvFile}`);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing test: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`Test stderr: ${stderr}`);
    }
    console.log(`Test stdout: ${stdout}`);
    console.log('Test completed. Check the results directory for the CSV file.');
}); 