const APP_ENV = process.env.APP_ENV || 'prod';
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const DEV_SERVER_PORT = 8083;

module.exports = {
  APP_ENV,
  FILE_EXTENSIONS,
  DEV_SERVER_PORT
};
