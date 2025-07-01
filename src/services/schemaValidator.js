import Ajv from "ajv";
import matchSchema from "../schemas/matchSchema.json" assert { type: "json" };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(matchSchema);

export function validateMatchData(matchData) {
  const isValid = validate(matchData);

  if (!isValid) {
    return {
      isValid: false,
      errors: validate.errors.map((error) => ({
        message: error.message,
        instancePath: error.instancePath,
        schemaPath: error.schemaPath,
      })),
    };
  }

  return { isValid: true, errors: [] };
}
