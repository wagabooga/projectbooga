const { exec } = require('child_process');

function runPythonScript() {
  exec('python scraper.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(`Python script output: ${stdout}`);
  });
}

runPythonScript();