const { ObjectId, Decimal128 } = require('mongodb');
const { connect, close } = require('./00_connect');

async function run() {
  let db;
  try {
    db = await connect();

    const landownerId = new ObjectId("60d5ec423d538e1b1078d461");
    const investorId = new ObjectId("60d5ec423d538e1b1078d462");
    const parcelId = new ObjectId("60d5ec423d538e1b1078d463");
    const plotId = new ObjectId("60d5ec423d538e1b1078d464");
    const investmentId = new ObjectId("60d5ec423d538e1b1078d465");
    const transactionId = new ObjectId("60d5ec423d538e1b1078d466");
    const sensorReadingId = new ObjectId("60d5ec423d538e1b1078d467");
    const snapshotId = new ObjectId("60d5ec423d538e1b1078d468");

    await db.collection('users').deleteMany({});
    await db.collection('land_parcels').deleteMany({});
    await db.collection('plots').deleteMany({});
    await db.collection('investments').deleteMany({});
    await db.collection('transactions').deleteMany({});
    await db.collection('sensor_readings').deleteMany({});
    await db.collection('performance_snapshots').deleteMany({});

    // 1. Seed Users (Landowner Ramesh Patel & Investor Priya Sharma)
    const users = [
      {
        _id: landownerId,
        email: "ramesh.patel@gmail.com",
        name: "Ramesh Patel",
        phone: "+919876543210",
        role: "landowner",
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        kyc: {
          verified: true,
          doc_type: "AADHAAR",
          doc_ref: "123456789012",
          verified_at: new Date()
        },
        wallet: {
          balance: Decimal128.fromString("0"),
          currency: "INR"
        }
      },
      {
        _id: investorId,
        email: "priya.sharma@gmail.com",
        name: "Priya Sharma",
        phone: "+919876543222",
        role: "investor",
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        kyc: {
          verified: true,
          doc_type: "PAN",
          doc_ref: "ABCDE1234F",
          verified_at: new Date()
        },
        wallet: {
          balance: Decimal128.fromString("15000"),
          currency: "INR"
        }
      }
    ];
    await db.collection('users').insertMany(users);

    // 2. Seed Land Parcels (Anand, Gujarat)
    const landParcel = {
      _id: parcelId,
      owner_id: landownerId,
      title: "Ramesh Patel Farm, Anand District, Gujarat",
      area_ha: 2.5,
      soil_type: "alluvial",
      water_source: "canal",
      status: "active",
      location: {
        type: "Point",
        coordinates: [72.9634, 22.5645] // [longitude, latitude]
      },
      address: {
        village: "Vasad",
        district: "Anand",
        state: "Gujarat",
        pincode: "388306"
      },
      docs: [
        {
          doc_type: "land_ownership_certificate",
          file_ref: "s3://agrivest-docs/gujarat/ramesh_patel_712.pdf",
          uploaded_at: new Date()
        }
      ],
      created_at: new Date(),
      updated_at: new Date()
    };
    await db.collection('land_parcels').insertOne(landParcel);

    // 3. Seed Plots (Rice crop, kharif-2025)
    const plot = {
      _id: plotId,
      parcel_id: parcelId,
      crop_type: "Rice",
      season: "kharif-2025",
      status: "growing",
      area_ha: 1.2,
      season_start: new Date("2025-06-15T00:00:00Z"),
      yield: {
        target_tonnes: 6.5,
        actual_tonnes: null // Null until harvest
      },
      investment_summary: {
        total_invested: "15000",
        investor_count: 1,
        funding_target: "50000"
      },
      latest_snapshot: {
        soil_score: 85,
        efficiency: 92,
        yield_pct: 100,
        updated_at: new Date()
      },
      sensors: [
        {
          device_id: "SM-RICE-01",
          sensor_type: "soil_moisture",
          active: true,
          installed_at: new Date("2025-06-16T00:00:00Z")
        }
      ],
      created_at: new Date(),
      updated_at: new Date()
    };
    await db.collection('plots').insertOne(plot);

    // 4. Seed Investments (Priya Sharma equity investment of ₹15000)
    const investment = {
      _id: investmentId,
      investor_id: investorId,
      plot_id: plotId,
      type: "equity",
      amount: "15000",
      ownership_pct: 30.0,
      expected_return_pct: 15.5,
      status: "active",
      invested_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };
    await db.collection('investments').insertOne(investment);

    // 5. Seed Transactions (Deposit of ₹15000)
    const transaction = {
      _id: transactionId,
      user_id: investorId,
      investment_id: investmentId,
      type: "deposit",
      amount: "15000",
      currency: "INR",
      direction: "credit",
      status: "completed",
      note: "Deposit for Rice plot investment (kharif-2025)",
      gateway: {
        provider: "Razorpay",
        ref_id: "pay_G83hK89sn102",
        raw_response: { status: "captured", method: "upi" }
      },
      created_at: new Date()
    };
    await db.collection('transactions').insertOne(transaction);

    // 6. Seed Sensor Readings (Soil Moisture reading, short fields v, u, ts)
    const sensorReading = {
      _id: sensorReadingId,
      device_id: "SM-RICE-01",
      plot_id: plotId,
      type: "soil_moisture",
      v: 42.5,
      u: "%",
      ts: new Date()
    };
    await db.collection('sensor_readings').insertOne(sensorReading);

    // 7. Seed Performance Snapshots (All metrics fields populated)
    const snapshot = {
      _id: snapshotId,
      plot_id: plotId,
      date: new Date("2026-07-08T00:00:00Z"), // Midnight UTC of the current date
      metrics: {
        soil_score: 88,
        efficiency: 90,
        yield_pct: 98.5,
        soil_moisture_avg: 41.2,
        temperature_avg: 28.4,
        humidity_avg: 78.1,
        rainfall_mm: 12.5
      },
      weather: {
        source: "openweather",
        temp_avg: 28.5,
        temp_min: 25.0,
        temp_max: 32.0,
        humidity: 80,
        description: "scattered clouds"
      },
      anomalies: [
        {
          type: "low_moisture_alert",
          severity: "low",
          detail: "Soil moisture dropped below threshold in Sector B"
        }
      ]
    };
    await db.collection('performance_snapshots').insertOne(snapshot);

    console.log("✓ seed data inserted");
  } catch (err) {
    console.error("✗ seed failed:", err);
    process.exit(1);
  } finally {
    await close();
  }
}

if (require.main === module) {
  run();
}
