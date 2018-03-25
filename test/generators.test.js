'use strict'
/* eslint-env mocha */
const path = require('path')
const helpers = require('yeoman-test')
const assert = require('yeoman-assert')
const cp = require('child_process')
const projectName = 'my-project'
const projectPrompts = {
  name: projectName,
  description: 'This is my awesome project!',
  platform: 'lambda'
}
const platformDefaults = {
  Handler: 'index.handler',
  MemorySize: 128,
  Publish: true,
  Role: 'arn:aws:some-role',
  Runtime: 'nodejs6.10',
  Timeout: 3,
  region: 'us-east-1'
}

// Start a process and wait either for it to exit
// or to display a certain text
function startAndWait (cmd, args, options) {
  return new Promise((resolve, reject) => {
    let buffer = ''

    const child = cp.spawn(cmd, args, options)
    function addToBuffer (data) {
      buffer += data
    }

    child.stdout.on('data', addToBuffer)
    child.stderr.on('data', addToBuffer)

    child.on('exit', function (status) {
      if (status !== 0) {
        return reject(new Error(buffer))
      }
      resolve(buffer)
    })
  })
}

describe('warhead-generator', function () {
  let appDir

  function runTest (expectedText) {
    return startAndWait('warhead', ['test'], { cwd: appDir })
      .then(function (buffer) {
        console.log(buffer, expectedText)
        assert.ok(buffer.indexOf(expectedText) !== -1,
          'Ran test with text: ' + expectedText)
      })
  }

  beforeEach(function () {
    return helpers.run(path.join(__dirname, '..', 'generators', 'project'))
      .inTmpDir(function (dir) {
        appDir = dir
      })
      .withPrompts(Object.assign({}, projectPrompts, platformDefaults))
  })

  it('warhead:project', function () {
    assert.jsonFileContent(
      path.join(appDir, projectName, 'package.json'),
      {
        name: projectPrompts.name,
        description: projectPrompts.description,
        warhead: {
          platform: projectPrompts.platform,
          defaults: platformDefaults
        }
      }
    )
  })

  it('warhead:service', function () {
    const servicePrompts = {
      name: 'my-service',
      description: 'This is my awesome service!'
    }
    return helpers.run(path.join(__dirname, '..', 'generators', 'service'))
      .inTmpDir(function () {
        process.chdir(path.join(appDir, projectName))
        appDir = path.join(appDir, projectName)
      })
      .withPrompts(Object.assign({}, servicePrompts, platformDefaults))
      .then(function () {
        const pkgPath = path.join(appDir, 'services', 'my-service', 'service', 'package.json')
        const pkg = require(pkgPath)
        assert.jsonFileContent(
          pkgPath,
          Object.assign({
            warhead: {
              settings: platformDefaults
            }
          }, servicePrompts)
        )
        assert.ok(pkg.dependencies['warhead-lambda'])
        return runTest('passed')
      })
  })
})
