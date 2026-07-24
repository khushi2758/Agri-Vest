require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { connect, close } = require('./migrations/00_connect');

async function fixLocationName() {
  try {
    const db = await connect();
    const lands = await db.collection("land_parcels").find({}).toArray();
    for (const land of lands) {
      let locName = "Global Farm Network";
      if (land.address && land.address.state && land.address.state !== "Unknown") {
        locName = land.address.state;
        if (land.id === "sundance-corn-estate") locName = "Nebraska, USA";
        if (land.id === "blue-ridge-orchard") locName = "Virginia, USA";
        if (land.id === "golden-wheat-coop") locName = "Kansas, USA";
        if (land.id === "emerald-vineyards") locName = "California, USA";
        if (land.id === "dakota-soy-fields") locName = "South Dakota, USA";
        if (land.id === "cascade-hops-farm") locName = "Washington, USA";
        if (land.id === "delta-rice-co") locName = "Arkansas, USA";
        if (land.id === "peach-grove-ga") locName = "Georgia, USA";
        if (land.id === "montana-barley-fields") locName = "Montana, USA";
        if (land.id === "florida-citrus-orchard") locName = "Florida, USA";
        if (land.id === "pampas-soy-fields") locName = "Argentina";
        if (land.id === "bordeaux-vineyards") locName = "France";
        if (land.id === "mekong-delta-rice") locName = "Vietnam";
        if (land.id === "rift-valley-coffee") locName = "Kenya";
        if (land.id === "punjab-wheat-coop") locName = "India";
        if (land.id === "cerrado-coffee-estate") locName = "Brazil";
        if (land.id === "andalusia-olive-groves") locName = "Spain";
        if (land.id === "queensland-sugarcane") locName = "Australia";
      } else if (land.address && land.address.state) {
        locName = land.address.state;
      }
      
      await db.collection("land_parcels").updateOne(
        { _id: land._id },
        { $set: { location_name: locName } }
      );
    }
    console.log("Updated location_name for all lands.");
  } catch (e) {
    console.error(e);
  } finally {
    await close();
  }
}

fixLocationName();
