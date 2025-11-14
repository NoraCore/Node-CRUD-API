import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 4000;

function resolvePort(rawPort: string | undefined): number {
  if (!rawPort) {
    return DEFAULT_PORT;
  }

  const parsed = Number(rawPort);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error('Invalid PORT value provided. Expected an integer between 1 and 65535.');
  }

  return parsed;
}

export const config = {
  port: resolvePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isClusterMode: process.env.CLUSTER_MODE === 'true'
}