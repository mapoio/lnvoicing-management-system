const path = require('path');

const constants = require('./constants');

// website domain
const INDEX_DOMAIN = 'https://starter.jackple.com';

// static resource domain（CDN）
const STATICDOMAIN = constants.APP_ENV === 'prod' ? '.' : '';

module.exports = {
  index: path.resolve(__dirname, `./../dist/${constants.APP_ENV}/index.html`),
  assetsRoot: path.resolve(__dirname, `./../dist/${constants.APP_ENV}`),
  assetsPublicPath: constants.APP_ENV === 'dev' ? '/' : `${STATICDOMAIN}/`,
  assetsSubDirectory: 'static',
  // domain for workbox
  indexDomain: INDEX_DOMAIN,
  // id you use CDN, change it!!!
  assetsDomain: `${INDEX_DOMAIN}/static`,
  // production sourceMap for monitoring
  sourceMap:
    constants.APP_ENV === 'dev' ? 'source-map' : constants.APP_ENV === 'prod' ? 'cheap-module-source-map' : false,
  extractCss: constants.APP_ENV !== 'dev',
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
};
