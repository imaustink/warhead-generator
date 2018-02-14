const { adapter } = require('warhead-<%= platform %>')
const handler = require('./handler')

exports.handler = adapter(handler)
