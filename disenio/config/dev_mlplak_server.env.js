'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',
  BACKEND_BASE_URL: '"https://staging.mlplak.com:441/server"',
  CNC_BASE_URL: '"https://staging.mlplak.com:441/cnc/"',
  FRONT_URL: '"https://staging.mlplak.com:441/front"',
  FRONT_CLIENT_SEQUENCE_URL: '"https://staging.mlplak.com:441/front/#/clientView"',
})
