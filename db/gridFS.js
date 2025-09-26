const { MongoClient, GridFSBucket } = require('mongodb');

//GridFS  to store and retrieve large files such as images , files , vedios etc
const mongoURI = process.env.MONGO_URI;
const dbName = "travel_journal";

let bucket;

const connectGridFS = async () => {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
};

module.exports = { connectGridFS, getBucket: () => bucket };