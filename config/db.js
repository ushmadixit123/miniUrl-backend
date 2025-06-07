import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        console.log('🔗 Connection string check:', process.env.MONGO_DB_URI ? 'Found' : 'Missing');
        
        // Add connection event listeners for debugging
        mongoose.connection.on('connecting', () => {
            console.log('🔄 Mongoose connecting...');
        });
        
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected');
        });

        const conn = await mongoose.connect(process.env.MONGO_DB_URI, {
            serverSelectionTimeoutMS: 60000, // Increase to 60 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 60000,
            family: 4, // Force IPv4
            maxPoolSize: 10,
            retryWrites: true,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
    } catch (err) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        
        // More specific error details
        if (err.reason) {
            console.error('Reason:', err.reason);
        }
        
        process.exit(1);
    }
};

export default connectDB;