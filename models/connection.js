const mongoose = require("mongoose");
const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString, { connectTimeoutMS: 22000 })
  .then(async () => {
    console.log("✅ Database connected");

    const db = mongoose.connection.db;

    // Récupération de toutes les collections
    const collections = await db.listCollections().toArray();

    console.log("📦 Collections dans la base :");

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name} : ${count} documents`);
    }
  })
  .catch((error) => console.error("❌ Erreur de connexion :", error));
