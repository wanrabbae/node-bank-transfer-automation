const { execSync } = require('child_process');
const fs = require('fs');

const ADB_PATH = 'adb';
const PACKAGE_NAME = 'com.bca.mybca.omni.android';
const DELAY = 2000;

const accounts = JSON.parse(fs.readFileSync('./config/accounts.json', 'utf-8'));
const transfers = JSON.parse(fs.readFileSync('./config/transfers.json', 'utf-8'));

function adbCommand(command) {
  try {
    execSync(`${ADB_PATH} ${command}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('ADB Error:', error.message);
  }
}

async function automateBCATransfer(account, transferData) {
  console.log(`Memulai transfer ke ${transferData.Bank_Tujuan}...`);

  adbCommand(`shell am start - n ${PACKAGE_NAME}/.MainActivity`);
  await new Promise(resolve => setTimeout(resolve, DELAY * 3));

  adbCommand(`shell input text "${account.Username}"`);
  adbCommand('shell input keyevent 61');
  adbCommand(`shell input text "${account.Password}"`);
  adbCommand('shell input keyevent 66');
  await new Promise(resolve => setTimeout(resolve, DELAY * 2));

  for (const digit of account.Pin.split('')) {
    adbCommand(`shell input tap ${getPinCoordinates(digit)}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  adbCommand('shell input tap 500 1000');
  await new Promise(resolve => setTimeout(resolve, DELAY));

  adbCommand(`shell input text "${transferData.Norek}"`);
  adbCommand('shell input keyevent 61'); // Tab
  adbCommand(`shell input text "${transferData.Amount}"`);

  console.log('Transfer selesai!');
}

function getPinCoordinates(digit) {
  const keypad = {
    '5': '540 1200',
    '7': '300 900'
  };
  return keypad[digit] || '540 1200';
}

if (transfers.length > 0) {
  const activeAccount = accounts.find(acc => acc.Bank === 'BCA' && acc.Status === 'ON');
  if (activeAccount) automateBCATransfer(activeAccount, transfers[0]);
} else {
  console.log('Tidak ada transfer yang terjadwal.');
}