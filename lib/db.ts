import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}


export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if(!cached.promise){
        const opts ={
            bufferCommands : true,
            maxPoolSize: 10, 
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);

    }
    try{
        cached.conn = await cached.promise
    } catch (error){
        cached.promise = null;
    }

    return cached.conn

}
