export const FRONTEND_URL = 'http://localhost:3000';
export const BACKEND_PORT = 8000;

const environment = process.env.ENVIRONMENT;

export const database_name =
  environment === 'PRODUCTION' ? 'app_prod' : 'app_dev';
