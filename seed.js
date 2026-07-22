const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const uri = 'mongodb+srv://royrishita744_db_user:Ma92kXURJKmab7Za@cluster0.kzfs2rf.mongodb.net/?appName=Cluster0';
  const client = new MongoClient(uri, { tlsAllowInvalidCertificates: true });
  await client.connect();
  const db = client.db('agrivest_db');
  
  const ownerId = new ObjectId(); // Dummy owner ID
  const now = new Date();
  
  const mockLands = [
    { id: 'sundance-corn-estate', title: 'Sundance Corn Estate', location: { type: 'Point', coordinates: [-98.5795, 39.8283] }, crop: 'Corn', area: '150.5 ha', area_ha: 150.5, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'blue-ridge-orchard', title: 'Blue Ridge Orchard', location: { type: 'Point', coordinates: [-78.6569, 38.0293] }, crop: 'Apples', area: '85.2 ha', area_ha: 85.2, status: 'listed', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'golden-wheat-coop', title: 'Golden Wheat Co-op', location: { type: 'Point', coordinates: [-98.4842, 39.0119] }, crop: 'Wheat', area: '320.0 ha', area_ha: 320.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'emerald-vineyards', title: 'Emerald Vineyards', location: { type: 'Point', coordinates: [-122.2594, 38.2919] }, crop: 'Grapes', area: '45.0 ha', area_ha: 45.0, status: 'inactive', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'dakota-soy-fields', title: 'Dakota Soy Fields', location: { type: 'Point', coordinates: [-100.2263, 44.3668] }, crop: 'Soybeans', area: '210.8 ha', area_ha: 210.8, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'cascade-hops-farm', title: 'Cascade Hops Farm', location: { type: 'Point', coordinates: [-120.5059, 46.5653] }, crop: 'Hops', area: '78.3 ha', area_ha: 78.3, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'delta-rice-co', title: 'Delta Rice Co.', location: { type: 'Point', coordinates: [-92.4421, 34.7465] }, crop: 'Rice', area: '195.0 ha', area_ha: 195.0, status: 'listed', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'peach-grove-ga', title: 'Peach Grove', location: { type: 'Point', coordinates: [-83.6496, 32.8407] }, crop: 'Peaches', area: '62.5 ha', area_ha: 62.5, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'montana-barley-fields', title: 'Montana Barley Fields', location: { type: 'Point', coordinates: [-109.5337, 46.8797] }, crop: 'Barley', area: '450.0 ha', area_ha: 450.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now },
    { id: 'florida-citrus-orchard', title: 'Sunshine Citrus Orchard', location: { type: 'Point', coordinates: [-81.5158, 27.6648] }, crop: 'Oranges', area: '120.0 ha', area_ha: 120.0, status: 'active', owner_id: ownerId, created_at: now, updated_at: now }
  ];

  const existingLands = await db.collection('land_parcels').find({ id: { $in: mockLands.map(l => l.id) } }).toArray();
  const existingIds = existingLands.map(l => l.id);
  const landsToInsert = mockLands.filter(l => !existingIds.includes(l.id));

  if (landsToInsert.length > 0) {
    await db.collection('land_parcels').insertMany(landsToInsert);
    console.log('Successfully inserted ' + landsToInsert.length + ' schema-compliant mock lands!');
  } else {
    console.log('No new lands to insert (they already exist).');
  }
  
  await client.close();
}

run().catch(console.error);
