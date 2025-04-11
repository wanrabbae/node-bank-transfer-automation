const { adbCommand, delay } = require('../utils/adb');

const PACKAGE_NAME = 'id.bmri.livin';
const DELAY = 2500;

function automateMandiriTransfer(account, transferData) {
  console.log(`Memulai transfer Mandiri ke ${transferData['Bank Tujuan']}...`);

  adbCommand(`shell monkey -p ${PACKAGE_NAME} -c android.intent.category.LAUNCHER 1`);
  delay(DELAY * 3);

  adbCommand(`shell input text "${account.Username}"`);
  adbCommand('shell input keyevent 61'); // Tab
  adbCommand(`shell input text "${account.Password}"`);
  adbCommand('shell input keyevent 66'); // Enter
  delay(DELAY);

  const mandiriPinPositions = {
    '1': '150 1000', '2': '450 1000', '3': '750 1000',
    '4': '150 1200', '5': '450 1200', '6': '750 1200',
    '7': '150 1400', '8': '450 1400', '9': '750 1400',
    '0': '450 1600'
  };
  for (const digit of account.Pin.split('')) {
    adbCommand(`shell input tap ${mandiriPinPositions[digit]}`);
    delay(600);
  }

  adbCommand('shell input swipe 500 1800 500 800 500');
  adbCommand('shell input tap 550 950');
  delay(DELAY);

  adbCommand(`shell input text "${transferData.Norek}"`);
  adbCommand('shell input keyevent 61'); // Tab
  adbCommand(`shell input text "${transferData['AN']}"`);

  console.log('Transfer Mandiri selesai!');
}

module.exports = { automateMandiriTransfer };