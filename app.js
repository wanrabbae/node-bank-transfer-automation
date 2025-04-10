const cron = require('node-cron');
const fs = require('fs');
const { automateBCATransfer } = require('./scripts/bca');
const { automateBNITransfer } = require('./scripts/bni');
const { automateMandiriTransfer } = require('./scripts/mandiri');

const accounts = JSON.parse(fs.readFileSync('./config/accounts.json', 'utf-8'));
const transfers = JSON.parse(fs.readFileSync('./config/transfers.json', 'utf-8'));

// Jadwalkan otomatisasi setiap 1 menit
cron.schedule('*/1 * * * *', () => {
  console.log('Memeriksa transfer terjadwal...');
  const pendingTransfers = transfers.filter(t => t.Action === 'transfer');

  pendingTransfers.forEach(transfer => {
    const account = accounts.find(acc =>
      acc.Bank === transfer['Bank Tujuan'] && acc.Status === 'ON'
    );

    if (account) {
      switch (account.Bank) {
        case 'BCA':
          automateBCATransfer(account, transfer);
          break;
        case 'BNI':
          automateBNITransfer(account, transfer);
          break;
        case 'MANDIRI':
          automateMandiriTransfer(account, transfer);
          break;
      }
      transfer.Action = 'processed';
    }
  });

  fs.writeFileSync('./config/transfers.json', JSON.stringify(transfers, null, 2));
});