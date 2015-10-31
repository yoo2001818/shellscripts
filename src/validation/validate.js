import validator from 'validator';

function normalizeValidation(validation) {
  if (validation.value) return validation;
  return {
    key: true,
    value: validation
  };
}

function runValidation(key, validation, value) {
  if (validation == null) return null;
  // currently only supports:
  // is, isURL, isEmail, len, notEmpty
  let args = normalizeValidation(validation);
  switch (key) {
  case 'is':
    if (!validator.matches(value, args.value)) return args.key;
    break;
  case 'isURL':
    if (!validator.isURL(value)) return args.key;
    break;
  case 'isEmail':
    if (!validator.isEmail(value)) return args.key;
    break;
  case 'len':
    const [min, max] = args.value;
    if (!validator.isLength(value, min, max)) return args.key;
    break;
  case 'notEmpty':
    if (validator.isNull(value)) return args.key;
    break;
  }
  return null;
}

// Run validations from the data
export default function validate(data, schema) {
  if (schema == null) return {};
  let errors = {};
  for (let key in schema) {
    let validation = schema[key];
    let value = data[key];
    for (let check in validation) {
      const result = runValidation(check, validation[check], value);
      if (result !== null) {
        errors[key] = result;
      }
    }
  }
  return errors;
}

// Run validation, return only one error.
export function validateSingle(data, schema) {
  let result = validate(data, schema);
  for (let key in result) {
    if (result[key] !== false) return result[key];
  }
  return null;
}
