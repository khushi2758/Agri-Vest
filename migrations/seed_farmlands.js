const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env' });
// Or .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const FARMLANDS = [
  { id: "sundance-corn-estate", name: "Sundance Corn Estate", location: "Nebraska, USA", image: "/farm.jpg", yield: "12.4%", risk: "Low", minInvestment: "$500", tech: ["AI Irrigation", "Autonomous Tractors"], cropType: "Corn", rotationDays: 120, trending: true, fundedPct: 82, totalGoal: "$2.3M", lat: 41.5, lng: -99.79 },
  { id: "blue-ridge-orchard", name: "Blue Ridge Apple Orchard", location: "Virginia, USA", image: "/farm.jpg", yield: "14.1%", risk: "Medium", minInvestment: "$1,000", tech: ["Drone Scouting", "Soil Sensors"], cropType: "Apples", rotationDays: 365, trending: true, fundedPct: 65, totalGoal: "$1.5M", lat: 37.43, lng: -78.65 },
  { id: "golden-wheat-coop", name: "Golden Wheat Co-operative", location: "Kansas, USA", image: "/farm.jpg", yield: "10.5%", risk: "Low", minInvestment: "$250", tech: ["Satellite Imaging", "Predictive Weather"], cropType: "Wheat", rotationDays: 90, trending: false, fundedPct: 95, totalGoal: "$4.0M", lat: 39.01, lng: -98.48 },
  { id: "emerald-vineyards", name: "Emerald Vineyards", location: "California, USA", image: "/farm.jpg", yield: "16.8%", risk: "High", minInvestment: "$5,000", tech: ["Smart Drip", "Robotic Harvesting"], cropType: "Grapes", rotationDays: 180, trending: true, fundedPct: 40, totalGoal: "$8.5M", lat: 36.77, lng: -119.41 },
  { id: "dakota-soy-fields", name: "Dakota Soy Fields", location: "South Dakota, USA", image: "/farm.jpg", yield: "11.2%", risk: "Medium", minInvestment: "$500", tech: ["Variable Rate Tech", "AI Irrigation"], cropType: "Soybeans", rotationDays: 110, trending: false, fundedPct: 15, totalGoal: "$3.2M", lat: 44.29, lng: -99.43 },
  { id: "cascade-hops-farm", name: "Cascade Hops Farm", location: "Washington, USA", image: "/farm.jpg", yield: "15.0%", risk: "High", minInvestment: "$2,500", tech: ["Vertical Trellis", "Smart Sensors"], cropType: "Hops", rotationDays: 150, trending: true, fundedPct: 55, totalGoal: "$1.8M", lat: 47.75, lng: -120.74 },
  { id: "delta-rice-co", name: "Delta Rice Co.", location: "Arkansas, USA", image: "/farm.jpg", yield: "9.8%", risk: "Low", minInvestment: "$1,000", tech: ["Water Management AI", "Drone Scouting"], cropType: "Rice", rotationDays: 140, trending: false, fundedPct: 20, totalGoal: "$5.0M", lat: 35.2, lng: -91.83 },
  { id: "peach-grove-ga", name: "Peach Grove", location: "Georgia, USA", image: "/farm.jpg", yield: "13.5%", risk: "Medium", minInvestment: "$750", tech: ["Climate Control", "Automated Sorting"], cropType: "Peaches", rotationDays: 120, trending: true, fundedPct: 88, totalGoal: "$2.1M", lat: 32.16, lng: -82.9 },
  { id: "montana-barley-fields", name: "Montana Barley Fields", location: "Montana, USA", image: "/farm.jpg", yield: "10.0%", risk: "Low", minInvestment: "$500", tech: ["Satellite Imaging", "Soil Sensors"], cropType: "Barley", rotationDays: 100, trending: false, fundedPct: 42, totalGoal: "$6.2M", lat: 46.87, lng: -110.36 },
  { id: "florida-citrus-orchard", name: "Sunshine Citrus Orchard", location: "Florida, USA", image: "/farm.jpg", yield: "14.5%", risk: "Medium", minInvestment: "$1,500", tech: ["Disease Prediction AI", "Smart Drip"], cropType: "Oranges", rotationDays: 365, trending: true, fundedPct: 70, totalGoal: "$3.5M", lat: 27.66, lng: -81.51 },
  { id: "pampas-soy-fields", name: "Pampas Soy Fields", location: "Argentina", image: "/farm.jpg", yield: "14.2%", risk: "Medium", minInvestment: "$2,000", tech: ["Satellite Imaging", "Predictive Weather"], cropType: "Soybeans", rotationDays: 130, trending: true, fundedPct: 60, totalGoal: "$5.5M", lat: -34.6, lng: -58.38 },
  { id: "bordeaux-vineyards", name: "Château Bordeaux", location: "France", image: "/farm.jpg", yield: "9.5%", risk: "Low", minInvestment: "$10,000", tech: ["Smart Drip", "Soil Sensors"], cropType: "Grapes", rotationDays: 365, trending: false, fundedPct: 85, totalGoal: "$12.0M", lat: 44.83, lng: -0.57 },
  { id: "mekong-delta-rice", name: "Mekong Delta Rice", location: "Vietnam", image: "/farm.jpg", yield: "11.8%", risk: "Medium", minInvestment: "$500", tech: ["Drone Scouting", "Water Management AI"], cropType: "Rice", rotationDays: 110, trending: true, fundedPct: 92, totalGoal: "$1.2M", lat: 10.04, lng: 105.74 },
  { id: "rift-valley-coffee", name: "Rift Valley Coffee", location: "Kenya", image: "/farm.jpg", yield: "18.5%", risk: "High", minInvestment: "$1,500", tech: ["Climate Control", "Disease Prediction AI"], cropType: "Coffee", rotationDays: 300, trending: true, fundedPct: 45, totalGoal: "$2.8M", lat: -0.02, lng: 37.9 },
  { id: "punjab-wheat-coop", name: "Punjab Wheat Co-op", location: "India", image: "/farm.jpg", yield: "10.2%", risk: "Low", minInvestment: "$250", tech: ["AI Irrigation", "Predictive Weather"], cropType: "Wheat", rotationDays: 120, trending: false, fundedPct: 98, totalGoal: "$4.5M", lat: 31.14, lng: 75.34 },
  { id: "cerrado-coffee-estate", name: "Cerrado Coffee Estate", location: "Brazil", image: "/farm.jpg", yield: "15.4%", risk: "Medium", minInvestment: "$3,000", tech: ["Automated Sorting", "Soil Sensors"], cropType: "Coffee", rotationDays: 280, trending: true, fundedPct: 30, totalGoal: "$8.0M", lat: -14.23, lng: -51.92 },
  { id: "andalusia-olive-groves", name: "Andalusia Olive Groves", location: "Spain", image: "/farm.jpg", yield: "12.0%", risk: "Low", minInvestment: "$5,000", tech: ["Smart Sensors", "Drone Scouting"], cropType: "Olives", rotationDays: 365, trending: false, fundedPct: 77, totalGoal: "$6.0M", lat: 37.54, lng: -4.72 },
  { id: "queensland-sugarcane", name: "Queensland Sugarcane", location: "Australia", image: "/farm.jpg", yield: "13.8%", risk: "High", minInvestment: "$1,000", tech: ["Robotic Harvesting", "Water Management AI"], cropType: "Sugarcane", rotationDays: 365, trending: true, fundedPct: 50, totalGoal: "$3.8M", lat: -20.91, lng: 142.7 }
];

const { connect, close } = require('./00_connect');

async function run() {
  try {
    const db = await connect();

    
    // Find an owner
    let owner = await db.collection('users').findOne({ role: 'landowner' });
    if (!owner) {
        owner = await db.collection('users').findOne({});
    }
    const owner_id = owner ? owner._id : new ObjectId();

    const soilTypes = ["alluvial", "black", "red", "laterite", "sandy", "loamy"];
    const waterSources = ["canal", "borewell", "rainfed", "river", "mixed"];
    
    // Check which ones already exist
    for (const farm of FARMLANDS) {
      const exists = await db.collection('land_parcels').findOne({ id: farm.id });
      if (exists) {
        console.log(`Skipping ${farm.id}, already exists.`);
        continue;
      }
      
      const newLand = {
        id: farm.id,
        owner_id: owner_id,
        title: farm.name,
        area_ha: Math.floor(Math.random() * 200) + 20, // Random realistic area
        soil_type: soilTypes[Math.floor(Math.random() * soilTypes.length)],
        water_source: waterSources[Math.floor(Math.random() * waterSources.length)],
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
        location: {
          type: "Point",
          coordinates: [farm.lng, farm.lat]
        },
        address: {
          state: farm.location.split(',')[0].trim()
        },
        docs: [],
        
        // Add extra fields so they match what Explore expects
        crop: farm.cropType,
        telemetry: {
          moisturePct: Math.floor(Math.random() * 40) + 30,
          tempCelsius: Math.floor(Math.random() * 15) + 15,
          npkIndex: (Math.random() * 0.3 + 0.1).toFixed(2)
        },
        yield: farm.yield,
        risk: farm.risk,
        minInvestment: farm.minInvestment,
        tech: farm.tech,
        rotationDays: farm.rotationDays,
        trending: farm.trending,
        fundedPct: farm.fundedPct,
        totalGoal: farm.totalGoal,
        image: farm.image
      };

      await db.collection('land_parcels').insertOne(newLand);
      console.log(`Inserted ${farm.id}`);
    }
    console.log("Seeding complete.");
  } catch (err) {
    console.error(err);
  } finally {
    await close();
  }
}

run();
