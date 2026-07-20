const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
async function run() {
  const client = new MongoClient('mongodb+srv://medinexa:EazwdV6fU7rMzJq1@cluster0.te42vis.mongodb.net/?appName=Cluster0');
  await client.connect();
  const db = client.db();
  const r = await db.collection('users').updateMany(
    { role: { $exists: false } },
    { $set: { role: 'patient' } }
  );
  console.log('Updated', r.modifiedCount, 'users');
  const users = await db.collection('users').find().project({ name: 1, email: 1, role: 1 }).toArray();
  console.log('All users:', JSON.stringify(users, null, 2));
  await client.close();
}
run().catch(console.error);
