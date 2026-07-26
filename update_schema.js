require('dotenv').config();
const { MongoClient } = require("mongodb");

async function run() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri, { tlsAllowInvalidCertificates: true });

  try {
    await client.connect();
    const db = client.db("agrivest_db");

    // Fetch the existing collections and their validation rules
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length > 0 && collections[0].options && collections[0].options.validator) {
      const validator = collections[0].options.validator;

      // Update the enum for the 'role' field
      if (validator.$jsonSchema && validator.$jsonSchema.properties && validator.$jsonSchema.properties.role) {
        validator.$jsonSchema.properties.role.enum = [
          "landowner", 
          "investor", 
          "agronomist", 
          "agri_tech", 
          "admin",
          "farmer" // Add "farmer" to the allowed enum
        ];

        // Apply the updated validator to the collection
        await db.command({
          collMod: "users",
          validator: validator,
          validationLevel: "strict",
          validationAction: "error"
        });

        console.log("Successfully updated the schema validation for the 'users' collection to include 'farmer'.");
      } else {
        console.log("Could not find the role property in the schema.");
      }
    } else {
      console.log("No validator found on the users collection.");
    }
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await client.close();
  }
}

run();
