// MONGODB_URI is forwarded into this process via run_all.js fork env option.
// When running a migration script directly, ensure MONGODB_URI is set in your shell.

// Set DNS servers programmatically to bypass loopback DNS issues in node environment
require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const { MongoClient } = require('mongodb');

const URI = process.env.MONGODB_URI;
if (!URI) {
  throw new Error('MONGODB_URI is not defined. Set it in .env or export it in your shell.');
}
const DB_NAME = 'agrivest_db';

let client = null;

async function connect() {
  if (!client) {
    client = new MongoClient(URI, { tlsAllowInvalidCertificates: true });
    await client.connect();
  }
  return client.db(DB_NAME);
}

async function close() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = {
  connect,
  close,
  URI,
  DB_NAME
};