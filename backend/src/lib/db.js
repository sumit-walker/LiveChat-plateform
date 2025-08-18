import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`mongoDB connected : ${conn.connection.host}`);
    }catch(error){
        console.log("mongoDB connection error:",error)
    }
}