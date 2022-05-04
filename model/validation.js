const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 6,
    max: 250,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

let signupUserValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(3),
        lastName: Joi.string().required().min(3),
        email: Joi.string().required().min(6).email(),
        password: passwordComplexity(complexityOptions)
    });

    return schema.validate(data);
}

let loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email().min(6),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data);
};

let updateValidation = (data) => {
    const schema = Joi.object({
        name:Joi.string().required().min(6).max(255),
        email:Joi.string().required().min(6).max(255),
        bio:Joi.string(),
        gender : Joi.string().required(),
        dob:Joi.date(),
        mobileNumber:Joi.string()
    })
    return schema.validate(data);
}

let createPostValidation = (data)=>{
    const schema = Joi.object({
        userId : Joi.string().required(),
        userName:Joi.string().required(),
        caption:Joi.string(),
        img:Joi.string()
    });
    return schema.validate(data);

};

module.exports.signupUserValidation = signupUserValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
module.exports.createPostValidation = createPostValidation;