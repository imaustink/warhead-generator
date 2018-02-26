const { Response } = require('warhead-<%= platform %>')

module.exports = function (event) {
  // Checkout the docs for Response
  return Promise.resolve(new Response(event.body))
}
