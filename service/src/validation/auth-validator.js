const Joi = require('joi');

class AuthValidator {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    signUpSchema() {
        return Joi.object({
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.email': 'Enter a valid email address',
                    'any.required': 'Email is required',
                    'string.empty': 'Email cannot be empty',
                    'string.base': 'Email must be a valid text',
                }),
            fullName: Joi.string()
                .required()
                .messages({
                    'any.required': 'Full name is required',
                    'string.empty': 'Full name cannot be empty',
                    'string.base': 'Full name must be a valid text',
                }),
            password: Joi.string()
                .min(6)
                .required()
                .messages({
                    'string.min': 'Password must be at least 6 characters long',
                    'any.required': 'Password is required',
                    'string.empty': 'Password cannot be empty',
                    'string.base': 'Password must be a valid text',
                }),
            profilePic: Joi.string()
                .optional()
                .allow(null, '')
                .messages({
                    'string.base': 'Profile picture must be a valid text',
                }),
        });
    }

    loginSchema() {
        return Joi.object({
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.email': 'Enter a valid email address',
                    'any.required': 'Email is required',
                    'string.empty': 'Email cannot be empty',
                    'string.base': 'Email must be a valid text',
                }),
            password: Joi.string()
                .required()
                .messages({
                    'any.required': 'Password is required',
                    'string.empty': 'Password cannot be empty',
                    'string.base': 'Password must be a valid text',
                }),
        });
    }

    updateProfileSchema() {
        return Joi.object({
            profilePic: Joi.string()
                .required()
                .messages({
                    'any.required': 'Profile picture is required',
                    'string.empty': 'Profile picture cannot be empty',
                    'string.base': 'Profile picture must be a valid text',
                }),
            user: Joi.object({
                _id: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'User ID is required',
                        'string.empty': 'User ID cannot be empty',
                        'string.base': 'User ID must be a valid text',
                    }),
            }).required(),
        });
    }

    validate() {
        let schema;

        switch (this.type) {
            case 'sign-up':
                schema = this.signUpSchema();
                break;
            case 'login':
                schema = this.loginSchema();
                break;
            case 'update-profile':
                schema = this.updateProfileSchema();
                break;
            default:
                return { error: 'Invalid validation type' };
        }

        const { error } = schema.validate(this.data, { abortEarly: false });

        if (error) {
            return { error: error.details.map(err => err.message) };
        }

        return { error: null };
    }
}

module.exports = AuthValidator;
