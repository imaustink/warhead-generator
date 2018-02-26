const { Response } = require('warhead-<%= platform %>')

module.exports = function (event) {
  // Checkout the docs for Response (https://github.com/imaustink/warhead-<%= platform %>#responsebody)
  return Promise.resolve(new Response(event.body))
}
