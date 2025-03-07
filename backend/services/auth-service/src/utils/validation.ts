import Joi from "joi";
import User from "../models/User";

interface RegistrationData {
    userName: string;
    email: string;
    password: string,
    confirmPassword: string;
}
const validateRegister = async (data: RegistrationData) => {
    // Check if email already exists before validating schema
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const schema = Joi.object<RegistrationData>({
        userName: Joi.string().min(3).max(30).required().messages({
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot be longer than 30 characters',
            'any.required': 'Username is required',
        }),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match',
        }),
    });

    return schema.validateAsync(data);
};

export { validateRegister };