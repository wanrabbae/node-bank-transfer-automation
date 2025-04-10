const { execSync } = require('child_process');

function adbCommand(command) {
  try {
    console.log(`[ADB] ${command}`); // Logging
    return execSync(`adb ${command}`, { stdio: 'pipe' }).toString();
  } catch (error) {
    console.error(`ADB Error (${command}):`, error.message);
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function takeScreenshot(filename = 'debug.png') {
  adbCommand(`exec-out screencap -p > screenshots/${filename}`);
}

module.exports = { adbCommand, delay, takeScreenshot };