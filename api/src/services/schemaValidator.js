import Ajv from "ajv";
import fs from "fs";
import path from "path";

const ajv = new Ajv({ allErrors: true });

const schemaPath = path.resolve("src/schemas/matchSchema.json");
const matchSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

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
