// Removes 'key' from validation table
function createValidation(validation) {
  if (validation == null) return undefined;
  let newValidation = {};
  for (let key in validation) {
    let value = validation[key];
    if (value.value) {
      newValidation[key] = value.value;
    } else {
      newValidation[key] = value;
    }
  }
  return newValidation;
}

// 'Injects' validation schema to Sequelize database.
export default function injectSequelize(schema, validation) {
  // Return original if validation table is null
  if (validation == null) return schema;
  let newSchema = {};
  for (let key in schema) {
    let value = schema[key];
    let validate = createValidation(validation[key]);
    if (!validate) {
      newSchema[key] = value;
      continue;
    }
    if (value && value.type) {
      newSchema[key] = Object.assign({}, value, {
        validate
      });
    } else {
      // If value itself is a type, Simply swap it
      newSchema[key] = { type: value, validate };
    }
  }
  return newSchema;
}
