require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { connect, close } = require('./migrations/00_connect');

async function run() {
  try {
    const db = await connect();
    const lands = await db.collection("land_parcels").find({}).toArray();

    const dbLands = lands.map(land => {
      let lat = 39.5;
      let lng = -98.35;
      if (land.location && typeof land.location === 'object' && land.location.coordinates) {
        lng = land.location.coordinates[0];
        lat = land.location.coordinates[1];
      }
      
      return {
        _id: land._id.toString(),
        id: land.id || land._id.toString(),
        title: land.title || land.id || "Unknown Land",
        crop: land.crop || "Mixed",
        area: land.area || (land.area_ha ? `${land.area_ha} ha` : "N/A"),
        status: land.status || "active",
        location: land.address && land.address.state ? land.address.state : (typeof land.location === 'string' ? land.location : `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`),
        lat,
        lng
      };
    });

    console.log(JSON.stringify(dbLands.slice(0, 3), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await close();
  }
}

run();
