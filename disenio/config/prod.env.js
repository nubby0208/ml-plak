'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  BACKEND_BASE_URL: '"https://mlplak.com/server/"',
  CNC_BASE_URL: '"https://mlplak.com/cnc/"',
  FRONT_URL: '"https://mlplak.com/front"',
  FRONT_CLIENT_SEQUENCE_URL: '"https://mlplak.com/front/#/clientView"',
})
