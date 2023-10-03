import { cleanEnv, str, port } from "envalid";

/**
 * Validates the environment variables
 */
export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    PGHOST: str(),
    PGPORT: port(),
    PGUSER: str(),
    PGPASSWORD: str(),
    PGDATABASE: str()
  });
}
