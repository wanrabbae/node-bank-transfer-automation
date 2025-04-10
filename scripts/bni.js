const { execSync } = require('child_process');
const fs = require('fs');
const { adbCommand, delay } = require('../utils/adb');

const PACKAGE_NAME = 'com.bni.mobilebanking';
const DELAY = 3000;

function automateBNITransfer(account, transferData) {
  console.log(`Memulai transfer BNI ke ${transferData['Bank Tujuan']}...`);

  adbCommand(`shell am start -n ${PACKAGE_NAME}/.MainActivity`);
  delay(DELAY * 2);

  adbCommand(`shell input text "${account.Username}"`);
  adbCommand('shell input keyevent 61'); // Tab
  adbCommand(`shell input text "${account.Password}"`);
  adbCommand('shell input keyevent 66'); // Enter
  delay(DELAY);

  const pinCoordinates = {
    '1': '200 600', '2': '500 600', '3': '800 600',
    '4': '200 900', '5': '500 900', '6': '800 900',
    '7': '200 1200', '8': '500 1200', '9': '800 1200',
    '0': '500 1500'
  };
  for (const digit of account.Pin.split('')) {
    adbCommand(`shell input tap ${pinCoordinates[digit]}`);
    delay(500);
  }

  adbCommand('shell input tap 700 1300');
  delay(DELAY);

  adbCommand(`shell input text "${transferData.Norek}"`);
  adbCommand('shell input keyevent 61'); // Tab
  adbCommand(`shell input text "${transferData.Amount.toString().replace(/\./g, '')}"`);

  console.log('Transfer BNI selesai!');
}

module.exports = { automateBNITransfer };