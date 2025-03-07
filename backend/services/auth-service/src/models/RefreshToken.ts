import mongoose, { Schema, Types } from 'mongoose';

interface IRefreshToken {
    token: string;
    user: Types.ObjectId;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const refreshTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        require : true,
        unique : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true
    },
    expiresAt : {
        type : Date,
        require : true
    }
}, {timestamps : true});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);

export default RefreshToken;