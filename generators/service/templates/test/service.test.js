import test from 'ava'
import { harness } from 'warhead-<%= platform %>/test-helpers'
import { handler } from '../service'

test(t => {
  const request = {
    body: {
      message: 'Hello World!'
    }
  }
  return harness(handler, request)
    .then(response => {
      const body = JSON.parse(response.body)

      t.deepEqual(request.body, body)
      t.deepEqual('application/json', response.header('content-type'))
      t.is(200, response.status())
    })
})
