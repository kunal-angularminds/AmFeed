const Joi = require('joi');

let signupUserValidation = (data)=>{
    const schema = Joi.object({
        firstName:Joi.string().required().min(3),
        lastName:Joi.string().required().min(3),
        email:Joi.string().required().min(6).email(),
        password:Joi.string().required().min(6)
    });

    return schema.validate(data);
}

module.exports.signupUserValidation = signupUserValidation;