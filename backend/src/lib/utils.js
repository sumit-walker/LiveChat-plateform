import jwt from "jsonwebtoken";


export const generateToken= (userId,res)=>{
    // const token=jwt.sign({userId},process.env.JWT_SECRET,{
    const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === "development" ? "dev_secret_key_change_me" : null);
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not set. Configure it in environment variables.");
    }

    const token=jwt.sign({userId}, jwtSecret,{
        expiresIn:"7d",
    });
    

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })
}