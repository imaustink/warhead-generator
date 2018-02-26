const Generator = require('yeoman-generator')
const { kebabCase } = require('lodash')
const mkdirp = require('mkdirp')
const npm = require('enpeem')
const pkg = require('./configs/package.json')
const options = require('../../options')

module.exports = class ProjectGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts)
    this.devDependencies = [
      'ava',
      'babel-core',
      'babel-plugin-transform-runtime',
      'babel-preset-es2015',
      'babel-runtime',
      'coveralls',
      'lodash',
      'nyc',
      'sinon',
      'standard',
      'warhead-lambda@0.0.0-alpha.0'
    ]
  }
  prompting () {
    const prompts = [{
      name: 'name',
      message: 'Project name',
      filter: kebabCase,
      validate (input) {
        if (!input) {
          return 'Please enter a name!'
        }
        return true
      }
    },
    {
      name: 'description',
      message: 'Project description'
    },
    {
      name: 'platform',
      message: 'What platform would you like to use?',
      type: 'list',
      default: 0,
      choices: [
        {
          name: 'AWS Lambda',
          value: 'lambda'
        },
        {
          name: 'GCP Function',
          value: 'google',
          disabled: 'Not yet implemented'
        },
        {
          name: 'Azure Function',
          value: 'azure',
          disabled: 'Not yet implemented'
        },
        {
          name: 'Firebase Function',
          value: 'firebase',
          disabled: 'Not yet implemented'
        }
      ]
    }]

    return this.prompt(prompts).then(prompts => {
      this.options = prompts
      return this.prompt(options[prompts.platform]())
    }).then(prompts => {
      this.platformDefaults = prompts
      this.pkg = pkg(this)
    })
  }

  writing () {
    // This hack is necessary because NPM does not publish `.gitignore` files
    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath(this.options.name, '.gitignore')
    )
    this.fs.writeJSON(
      this.destinationPath(this.options.name, 'package.json'),
      this.pkg
    )
    mkdirp(this.destinationPath(this.options.name, 'services'))
  }

  install () {
    return new Promise((resolve, reject) => {
      npm.install({
        dir: this.destinationPath(this.options.name),
        dependencies: this.devDependencies,
        saveDev: true,
        production: false
      }, function (err, res) {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
