/* eslint-env mocha */
const path = require('path')
const helpers = require('yeoman-test')
const assert = require('yeoman-assert')
const cp = require('child_process')
const projectPrompts = {
  name: 'my-project',
  description: 'This is my awesome project!',
  platform: 'lambda'
}

// Start a process and wait either for it to exit
// or to display a certain text
function startAndWait (cmd, args, options, text) {
  return new Promise((resolve, reject) => {
    let buffer = ''

    const child = cp.spawn(cmd, args, options)
    const addToBuffer = data => {
      buffer += data

      if (text && buffer.indexOf(text) !== -1) {
        resolve({ buffer, child })
      }
    }

    child.stdout.on('data', addToBuffer)
    child.stderr.on('data', addToBuffer)

    child.on('exit', status => {
      if (status !== 0) {
        return reject(new Error(buffer))
      }

      resolve({ buffer, child })
    })
  })
}

describe('warhead-generator', function () {
  let appDir

  function runTest (expectedText) {
    return startAndWait('npm', ['test'], { cwd: appDir })
      .then(({ buffer }) => {
        assert.ok(buffer.indexOf(expectedText) !== -1,
          'Ran test with text: ' + expectedText)
      })
  }

  beforeEach(() => helpers.run(path.join(__dirname, '..', 'generators', 'project'))
    .inTmpDir(dir => (appDir = dir))
    .withPrompts(projectPrompts)
  )

  it('warhead:project', () => {
    console.log(appDir)
    assert.jsonFileContent(
      path.join(appDir, 'package.json'),
      {
        name: projectPrompts.name,
        description: projectPrompts.description,
        warhead: {
          platform: projectPrompts.platform
        }
      }
    )
  })

  it('warhead:service', () => {
    const servicePrompts = {
      name: 'my-service',
      description: 'This is my awesome service!'
    }
    return helpers.run(path.join(__dirname, '..', 'generators', 'service'))
      .inTmpDir(function () {
        process.chdir(appDir)
      })
      .withPrompts(servicePrompts)
      .then(() => {
        const pkgPath = path.join(appDir, 'services', 'my-service', 'package.json')
        const pkg = require(pkgPath)
        assert.jsonFileContent(
          pkgPath,
          servicePrompts
        )
        assert.ok(pkg.dependencies['warhead-lambda'])
        return runTest('1 passed')
      })
  })
})
