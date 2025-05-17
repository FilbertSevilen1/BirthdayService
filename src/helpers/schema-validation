const Joi = require('joi')
const moment = require('moment-timezone');

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})$/;

const isoDateSchema = Joi.string().custom((value, helpers) => {
    const isValid = isoRegex.test(value);
    if(!isValid){
        return helpers.error('any.invalid');
    }
    return value;
}, 'ISO 8601 Format Validation')

const timezoneSchema = Joi.string().custom((value, helpers) => {
  if (!moment.tz.zone(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'IANA Timezone Validation');


module.exports.createUserSchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    birthday : isoDateSchema.required(),
    timezone :  timezoneSchema.required()
})

module.exports.updateUserSchema = Joi.object({
    id : Joi.string().required(),
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    birthday : isoDateSchema.required(),
    timezone :  timezoneSchema.required()
})