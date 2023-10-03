import { cleanEnv, str, port } from 'envalid';

/**
 * Validates the environment variables
 */
export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    JWT_EXPIRATION: str(),
    PGHOST: str(),
    PGPORT: port(),
    PGUSER: str(),
    PGPASSWORD: str(),
    PGDATABASE: str()
  });
}
