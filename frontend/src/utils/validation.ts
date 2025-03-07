import Joi from "joi";

export const registerSchema = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(20)
        .required()
        .messages({
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username cannot exceed 20 characters",
            "any.required": "Username is required"
        }),
    
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 30 characters",
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
            "any.required": "Password is required"
        }),

    confirmPassword: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords must match",
            "any.required": "Confirm Password is required"
        }),
});


export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 30 characters",
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
            "any.required": "Password is required"
        }),
});
