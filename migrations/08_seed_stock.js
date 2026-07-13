const { connect, close } = require('./00_connect');

async function run() {
  let db;
  try {
    db = await connect();
    
    try {
      await db.command({ collMod: "performance_snapshots", validationLevel: "off" });
    } catch (e) {
      console.log("Could not turn off validation:", e);
    }

    const mockIds = [
      "sundance-corn-estate",
      "blue-ridge-orchard",
      "golden-wheat-coop",
      "emerald-vineyards",
      "dakota-soy-fields"
    ];

    const collection = db.collection('performance_snapshots');

    let insertedCount = 0;

    for (const plotId of mockIds) {
      await collection.deleteMany({ plot_id: plotId });

      let baseTemp = 20 + Math.random() * 10;
      let baseMoisture = 30 + Math.random() * 15;
      
      const snapshots = [];
      const now = new Date();
      
      for (let i = 60; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const tempFluctuation = (Math.random() - 0.5) * 4;
        const moistureFluctuation = (Math.random() - 0.5) * 6;
        
        baseTemp += tempFluctuation;
        baseMoisture += moistureFluctuation;
        
        baseTemp = Math.max(10, Math.min(45, baseTemp));
        baseMoisture = Math.max(10, Math.min(80, baseMoisture));

        snapshots.push({
          plot_id: plotId,
          date: date,
          metrics: {
            soil_score: 50 + Math.random() * 40,
            efficiency: 60 + Math.random() * 30,
            yield_pct: 80 + Math.random() * 20,
            soil_moisture_avg: baseMoisture,
            temperature_avg: baseTemp,
            humidity_avg: 40 + Math.random() * 40,
            rainfall_mm: Math.random() > 0.8 ? Math.random() * 20 : 0
          },
          weather: {
            source: "openweather",
            temp_avg: baseTemp,
            temp_min: baseTemp - 5,
            temp_max: baseTemp + 5,
            humidity: 40 + Math.random() * 40,
            description: Math.random() > 0.5 ? "clear sky" : "light rain"
          },
          anomalies: Math.random() > 0.9 ? [
            {
              type: "weather_alert",
              severity: Math.random() > 0.5 ? "medium" : "low",
              detail: "Minor weather fluctuation detected."
            }
          ] : []
        });
      }

      await collection.insertMany(snapshots);
      insertedCount += snapshots.length;
    }

    console.log(`✓ Seeded ${insertedCount} performance snapshots for mock plots.`);
  } catch (err) {
    console.error("✗ stock seed failed:", err);
    process.exit(1);
  } finally {
    await close();
  }
}

if (require.main === module) {
  run();
}
