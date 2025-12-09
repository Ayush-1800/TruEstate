const Joi = require('joi');

const schema = Joi.object({
  search: Joi.string().allow('', null),
  region: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).allow('', null),
  gender: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).allow('', null),
  category: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).allow('', null),
  tags: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).allow('', null),
  payment: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).allow('', null),
  age_min: Joi.number().integer().min(0).allow('', null),
  age_max: Joi.number().integer().min(0).allow('', null),
  date_from: Joi.date().iso().allow('', null),
  date_to: Joi.date().iso().allow('', null),
  sort: Joi.string().valid('date_desc','date_asc','quantity_desc','quantity_asc','customer_asc','customer_desc').default('date_desc'),
  page: Joi.number().integer().min(1).default(1)
});

exports.validateQueryParams = (rawQuery) => {
  // Convert arrays to comma separated strings for our service
  const normalized = { ...rawQuery };
  // Joi validation
  const { error, value } = schema.validate(normalized, { convert: true, stripUnknown: true });
  if (error) {
    return { error: error.details.map(d => d.message).join(', ') };
  }
  return { value };
};
