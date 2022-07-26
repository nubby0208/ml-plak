'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development-stage"',
  // BACKEND_BASE_URL: '//staging.mlplak.com/server"'
  BACKEND_BASE_URL: '"http://staging.mlplak.com/server/"',
  CNC_BASE_URL: '"http://localhost:8081/"',
})
