require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }
  
  const client = new MongoClient(uri, { tlsAllowInvalidCertificates: true });
  await client.connect();
  const db = client.db('agrivest_db');
  const users = await db.collection('users').find({}).toArray();
  for (const u of users) {
    if (u.email && u.email !== u.email.toLowerCase().trim()) {
      await db.collection('users').updateOne(
        { _id: u._id },
        { $set: { email: u.email.toLowerCase().trim() } }
      );
    }
  }
  
  console.log('Successfully normalized all existing user emails!');
  await client.close();
}
run().catch(console.error);
