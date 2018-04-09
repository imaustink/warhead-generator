const Generator = require('yeoman-generator')
const { kebabCase } = require('lodash')
const path = require('path')
const npm = require('enpeem')
const pkg = require('./configs/package.json')
const options = require('../../options')
const adapters = {
  lambda: 'warhead-lambda'
}

module.exports = class ServiceGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts)
    const pkg = require(path.join(process.cwd(), 'package.json'))
    this.options = pkg.warhead
    this.dependencies = [
      `${adapters[this.options.platform]}@latest`
    ]
  }
  prompting () {
    const prompts = [{
      name: 'name',
      message: 'Service name',
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
      message: 'Service description'
    }]
    return this.prompt(prompts).then(prompts => {
      Object.assign(this.options, prompts)
      return this.prompt(options[this.options.platform](this.options.defaults, 'service'))
    }).then(prompts => {
      this.options.settings = prompts
      this.pkg = pkg(this)
    })
  }

  writing () {
    console.log('Writing files...')
    this.fs.writeJSON(
      this.destinationPath('services', this.options.name, 'service', 'package.json'),
      this.pkg
    )
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('services', this.options.name, 'README.md'),
      this.options
    )
    this.fs.copyTpl(
      this.templatePath('service/*'),
      this.destinationPath('services', this.options.name, 'service'),
      this.options
    )
    this.fs.copyTpl(
      this.templatePath('test/*'),
      this.destinationPath('services', this.options.name, 'test'),
      this.options
    )
  }

  install () {
    console.log('Installing dependencies...')
    return new Promise((resolve, reject) => {
      npm.install({
        dir: this.destinationPath('services', this.options.name, 'service'),
        dependencies: this.dependencies,
        save: true,
        production: true,
        loglevel: 'silent'
      }, function (err, res) {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
