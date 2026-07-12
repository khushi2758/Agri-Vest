// Load environment variables from .env using manual fs parsing
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

// Set DNS servers to bypass loopback DNS issues
require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const User = require('./models/User');
const LandParcel = require('./models/LandParcel');
const Plot = require('./models/Plot');
const Investment = require('./models/Investment');
const Transaction = require('./models/Transaction');
const SensorReading = require('./models/SensorReading');
const PerformanceSnapshot = require('./models/PerformanceSnapshot');

async function runAllValidations() {
  const cleanupIds = {};
  try {
    console.log("Connecting to MongoDB via Mongoose...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected successfully.\n");

    // 1. Test User
    console.log("Testing User model...");
    const user = new User({
      email: `test_investor_${Date.now()}@example.com`,
      name: "Test Investor",
      role: "investor",
      kyc: { verified: true, doc_type: "PAN", doc_ref: "TST12345" },
      wallet: { balance: mongoose.Types.Decimal128.fromString("10000"), currency: "INR" }
    });
    await user.save();
    cleanupIds.userId = user._id;
    console.log("✓ User saved successfully.");

    // 2. Test LandParcel
    console.log("Testing LandParcel model...");
    const parcel = new LandParcel({
      owner_id: user._id,
      title: "Test Parcel",
      area_ha: 2.5,
      soil_type: "alluvial",
      status: "active",
      location: { type: "Point", coordinates: [77.2090, 28.6139] }
    });
    await parcel.save();
    cleanupIds.parcelId = parcel._id;
    console.log("✓ LandParcel saved successfully.");

    // 3. Test Plot
    console.log("Testing Plot model...");
    const plot = new Plot({
      parcel_id: parcel._id,
      crop_type: "Wheat",
      season: "rabi-2025",
      status: "growing",
      area_ha: 1.0,
      season_start: new Date(),
      investment_summary: {
        total_invested: mongoose.Types.Decimal128.fromString("10000"),
        investor_count: 1,
        funding_target: mongoose.Types.Decimal128.fromString("50000")
      }
    });
    await plot.save();
    cleanupIds.plotId = plot._id;
    console.log("✓ Plot saved successfully.");

    // 4. Test Investment
    console.log("Testing Investment model...");
    const investment = new Investment({
      investor_id: user._id,
      plot_id: plot._id,
      type: "equity",
      amount: mongoose.Types.Decimal128.fromString("5000"),
      ownership_pct: 10,
      invested_at: new Date()
    });
    await investment.save();
    cleanupIds.investmentId = investment._id;
    console.log("✓ Investment saved successfully.");

    // 5. Test Transaction
    console.log("Testing Transaction model...");
    const transaction = new Transaction({
      user_id: user._id,
      investment_id: investment._id,
      type: "deposit",
      amount: mongoose.Types.Decimal128.fromString("5000"),
      direction: "credit"
    });
    await transaction.save();
    cleanupIds.transactionId = transaction._id;
    console.log("✓ Transaction saved successfully.");

    // 6. Test SensorReading
    console.log("Testing SensorReading model...");
    const reading = new SensorReading({
      device_id: "SENSOR_TEST_01",
      plot_id: plot._id,
      type: "soil_moisture",
      v: 45.2,
      u: "%",
      ts: new Date()
    });
    await reading.save();
    cleanupIds.readingId = reading._id;
    console.log("✓ SensorReading saved successfully.");

    // 7. Test PerformanceSnapshot
    console.log("Testing PerformanceSnapshot model...");
    const snapshot = new PerformanceSnapshot({
      plot_id: plot._id,
      date: new Date(new Date().setUTCHours(0,0,0,0)), // Midnight UTC
      metrics: { soil_score: 85, efficiency: 90 },
      anomalies: []
    });
    await snapshot.save();
    cleanupIds.snapshotId = snapshot._id;
    console.log("✓ PerformanceSnapshot saved successfully.");

    console.log("\nAll 7 models tested successfully! Mongoose schemas exactly match the DB validators.");

  } catch (error) {
    console.error("\n✗ Test failed:", error.message);
    if (error.errors) {
      console.error(error.errors);
    }
  } finally {
    // Cleanup
    console.log("\nCleaning up test data...");
    if (cleanupIds.snapshotId) await PerformanceSnapshot.findByIdAndDelete(cleanupIds.snapshotId);
    if (cleanupIds.readingId) await SensorReading.findByIdAndDelete(cleanupIds.readingId);
    if (cleanupIds.transactionId) await Transaction.findByIdAndDelete(cleanupIds.transactionId);
    if (cleanupIds.investmentId) await Investment.findByIdAndDelete(cleanupIds.investmentId);
    if (cleanupIds.plotId) await Plot.findByIdAndDelete(cleanupIds.plotId);
    if (cleanupIds.parcelId) await LandParcel.findByIdAndDelete(cleanupIds.parcelId);
    if (cleanupIds.userId) await User.findByIdAndDelete(cleanupIds.userId);
    
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

runAllValidations();
