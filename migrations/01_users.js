const { connect, close } = require('./00_connect');

async function run() {
  let db;
  try {
    db = await connect();
    
    await db.collection('users').drop().catch(() => {});

    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "name", "role", "created_at", "updated_at", "wallet", "password_hash"],
          properties: {
            email: {
              bsonType: "string"
            },
            name: {
              bsonType: "string",
              maxLength: 100
            },
            phone: {
              bsonType: "string",
              pattern: "^\\+?[0-9]{10,14}$"
            },
            preferred_language: {
              bsonType: "string",
              enum: ["en", "es", "fr", "hi"]
            },
            password_hash: {
              bsonType: "string"
            },
            role: {
              bsonType: "string",
              enum: ["landowner", "investor", "agronomist", "agri_tech", "admin"]
            },
            is_active: {
              bsonType: "bool"
            },
            last_login: {
              bsonType: "date"
            },
            created_at: {
              bsonType: "date"
            },
            updated_at: {
              bsonType: "date"
            },
            kyc: {
              bsonType: "object",
              required: ["verified"],
              properties: {
                verified: {
                  bsonType: "bool"
                },
                doc_type: {
                  bsonType: "string",
                  enum: ["PAN", "AADHAAR", "PASSPORT"]
                },
                doc_ref: {
                  bsonType: "string"
                },
                verified_at: {
                  bsonType: "date"
                }
              }
            },
            wallet: {
              bsonType: "object",
              required: ["balance", "currency"],
              properties: {
                balance: {
                  bsonType: ["string", "decimal"]
                },
                currency: {
                  bsonType: "string"
                }
              }
            }
          }
        }
      },
      validationAction: "error",
      validationLevel: "strict"
    });

    const collection = db.collection('users');
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ role: 1 });

  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await close();
  }
}

if (require.main === module) {
  run();
}
