// NEXT FEATURE COMING SOON!
const fs = require('fs');
const { JWT } = require('google-auth-library');
const path = require('path');

const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../config/service-account.json');
const SPREADSHEET_ID = "1_mkBw0Ws_z4lvQA-ZjzPvIaFc_ffUSNcbxmktyRdmLs"
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthToken() {
  const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH));
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });
  await client.authorize();
  return client;
}

async function readSheet(sheetName, range) {
  const authClient = await getAuthToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}`;
  const res = await authClient.request({ url });
  return res.data.values;
}

async function writeSheet(sheetName, range, values) {
  const authClient = await getAuthToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?valueInputOption=RAW`;
  const res = await authClient.request({
    url,
    method: 'PUT',
    data: { values },
  });
  return res.data;
}

module.exports = { readSheet, writeSheet };