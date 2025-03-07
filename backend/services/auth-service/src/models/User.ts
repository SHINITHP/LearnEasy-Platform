import mongoose from "mongoose";
import argon2 from 'argon2';

interface IUser {  // Define an interface for your User document
    userName: string;
    email: string;
    password: string;
    createdAt?: Date; // Optional createdAt
    comparePassword(candidatePassword: string): Promise<boolean>; // Method signature
}


const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
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
        default : Date.now
    }
},{ timestamps : true })


userSchema.methods.comparePassword = async function name(candidatePassword: string): Promise<boolean> {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        console.error('Error while comparing password:', error);
        return false;
    }
}

userSchema.index({ userName: 'text'});

const User = mongoose.model<IUser>('User', userSchema);


export default User;