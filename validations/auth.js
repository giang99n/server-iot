//Validation
const Joi = require('joi');

const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(6).max(30).required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,128}$')),
		email: Joi.string().min(6).email(),
		role: Joi.string().valid(
			'admin',
			'customer',
		),
		location: Joi.string().min(6).max(255).required(),
		address: Joi.string().min(6).max(255).required(),
		phone:Joi.string()
	});
	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,128}$')),
		email: Joi.string().min(6).email(),
	});
	return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
