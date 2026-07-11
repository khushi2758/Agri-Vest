// Load environment variables from .env using manual fs parsing (as we did in migrations)
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

async function runValidationTest() {
  try {
    console.log("Connecting to MongoDB via Mongoose...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected successfully.");

    // Create a mock user that satisfies both Mongoose and the database $jsonSchema
    const testUser = new User({
      email: `test_mongoose_${Date.now()}@example.com`,
      name: "Mongoose Test User",
      role: "investor",
      kyc: {
        verified: true,
        doc_type: "PAN",
        doc_ref: "ABCDE1234F"
      },
      wallet: {
        balance: mongoose.Types.Decimal128.fromString("5000.50"),
        currency: "INR"
      }
    });

    console.log("Attempting to save user to the database...");
    const savedUser = await testUser.save();
    console.log("✓ Success! User saved perfectly.");
    console.log(savedUser);

    console.log("\nAttempting to save an INVALID user (should be caught by validation)...");
    const invalidUser = new User({
      email: `fail_${Date.now()}@example.com`,
      name: "Invalid User",
      role: "invalid_role", // This should fail Mongoose validation
      wallet: {
        balance: mongoose.Types.Decimal128.fromString("100"),
        currency: "INR"
      }
    });

    try {
      await invalidUser.save();
      console.log("✗ Wait, the invalid user was saved? This shouldn't happen!");
    } catch (validationErr) {
      console.log("✓ Invalid user was correctly rejected by validation:");
      console.log("  Error:", validationErr.message);
    }

  } catch (error) {
    console.error("✗ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected.");
  }
}

runValidationTest();
