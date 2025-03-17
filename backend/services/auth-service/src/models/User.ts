import mongoose from "mongoose";
import argon2 from 'argon2';

interface IUser {  // Define an interface for your User document
    googleId?: string;
    userName: string;
    email: string;
    password?: string;
    avatar?: string;
    createdAt?: Date; // Optional createdAt
    resetToken?: string;
    comparePassword(candidatePassword: string): Promise<boolean>; // Method signature
}


const userSchema = new mongoose.Schema({
    googleId : {
        type : String,
        unique: true,
        sparse: true, // to allow null values
    },
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
    },
    avatar: { 
        type: String 
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    resetToken: {
        type: String,
    }
},{ timestamps : true })


userSchema.pre('save', async function name(next) {
    if(this.isModified('password') && this.password){
        try {
            this.password = await argon2.hash(this.password);
        } catch (error: any) {
            return next(error)
        }
    }
    next();
});


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