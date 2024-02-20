import mongoose, { Mongoose } from 'mongoose';

// Set the url to the database
const MONGODB_URL = process.env.MONGODB_URL;

// Create an interface for mongoose connection
interface MongooseConnection {
    conn: Mongoose|null;
    promise: Promise<Mongoose>|null;
}

// Set up cache for mongoose connection
let cached: MongooseConnection = (global as any).mongoose;

// If there is no cached connection, create a new one
if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    // 1) we check if we already have a cached connection, if we do, we return it
    if (cached.conn) return cached.conn;
    
    // 2) We check if we provided the MONGODB_URL environment variable
    if(!MONGODB_URL) {
        throw new Error('Please define the MONGODB_URL environment variable inside .env.local');
    }

    // 3) If we don't have a connection, we create a new one and cache it
    cached.promise = 
        cached.promise || 
        mongoose.connect(
            MONGODB_URL, 
            {
                dbName: 'SAAS Template',
                bufferCommands: false,
            }
        );

    // 4) We call and save the connection to the cache
    cached.conn = await cached.promise;

    // 5) We return the connection
    return cached.conn;
};

