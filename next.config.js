// next.config.js
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css')


module.exports = {
    ...withCSS(withSass({
        cssModules: false,
    })),
    env: {
        apiUrl: 'http://localhost:8000',
        debug: 'true',
    },
}