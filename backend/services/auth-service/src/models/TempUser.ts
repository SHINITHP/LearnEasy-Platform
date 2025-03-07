import mongoose from "mongoose";
import argon2 from 'argon2';

interface IUser {  // Define an interface for your User document
    userName: string;
    email: string;
    password: string;
    createdAt?: Date; // Optional createdAt
    comparePassword(candidatePassword: string): Promise<boolean>; // Method signature
}


const tempUserSchema = new mongoose.Schema({
    userName : {
        type : String,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires: 300 // TTL (5 minutes = 300 seconds)
    }
},{ timestamps : true })

tempUserSchema.pre('save', async function name(next) {
    if(this.isModified('password')){
        try {
            this.password = await argon2.hash(this.password);
        } catch (error: any) {
            return next(error)
        }
    }
    next();
});

tempUserSchema.methods.comparePassword = async function name(candidatePassword: string): Promise<boolean> {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        console.error('Error while comparing password:', error);
        return false;
    }
}


const User = mongoose.model<IUser>('TempUser', tempUserSchema);


export default User;