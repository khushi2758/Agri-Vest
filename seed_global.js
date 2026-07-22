const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const uri = 'mongodb+srv://royrishita744_db_user:Ma92kXURJKmab7Za@cluster0.kzfs2rf.mongodb.net/?appName=Cluster0';
  const client = new MongoClient(uri, { tlsAllowInvalidCertificates: true });
  await client.connect();
  const db = client.db('agrivest_db');
  
  const ownerId = new ObjectId();
  const now = new Date();
  
  const globalLands = [
    { id: 'pampas-soy-fields', title: 'Pampas Soy Fields', location: { type: 'Point', coordinates: [-64.2936, -34.6145] }, crop: 'Soybeans', area: '1200.0 ha', area_ha: 1200.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'bordeaux-vineyards', title: 'Château Bordeaux', location: { type: 'Point', coordinates: [-0.5800, 44.8378] }, crop: 'Grapes', area: '25.5 ha', area_ha: 25.5, status: 'listed', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'mekong-delta-rice', title: 'Mekong Delta Rice', location: { type: 'Point', coordinates: [105.5956, 10.0267] }, crop: 'Rice', area: '450.0 ha', area_ha: 450.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'rift-valley-coffee', title: 'Rift Valley Coffee', location: { type: 'Point', coordinates: [36.8172, -1.2864] }, crop: 'Coffee', area: '110.0 ha', area_ha: 110.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'punjab-wheat-coop', title: 'Punjab Wheat Co-op', location: { type: 'Point', coordinates: [75.3412, 31.1471] }, crop: 'Wheat', area: '600.0 ha', area_ha: 600.0, status: 'listed', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'cerrado-coffee-estate', title: 'Cerrado Coffee Estate', location: { type: 'Point', coordinates: [-47.9292, -15.7801] }, crop: 'Coffee', area: '850.0 ha', area_ha: 850.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'andalusia-olive-groves', title: 'Andalusia Olive Groves', location: { type: 'Point', coordinates: [-4.4214, 36.7213] }, crop: 'Olives', area: '140.0 ha', area_ha: 140.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'queensland-sugarcane', title: 'Queensland Sugarcane', location: { type: 'Point', coordinates: [142.7028, -20.9176] }, crop: 'Sugarcane', area: '310.0 ha', area_ha: 310.0, status: 'inactive', owner_id: ownerId, created_at: now, updated_at: now }
  ];

  const existingLands = await db.collection('land_parcels').find({ id: { $in: globalLands.map(l => l.id) } }).toArray();
  const existingIds = existingLands.map(l => l.id);
  const landsToInsert = globalLands.filter(l => !existingIds.includes(l.id));

  if (landsToInsert.length > 0) {
    await db.collection('land_parcels').insertMany(landsToInsert);
    console.log('Successfully inserted ' + landsToInsert.length + ' global mock lands!');
  } else {
    console.log('No new lands to insert (they already exist).');
  }
  
  await client.close();
}

run().catch(console.error);
