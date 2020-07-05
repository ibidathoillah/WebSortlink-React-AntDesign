// next.config.js
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css')


module.exports = {
    ...withCSS(withSass({
        cssModules: false,
    })),
    env: {
        API_URL: 'http://localhost:8000',
        DEBUG: 'true',
    },
}