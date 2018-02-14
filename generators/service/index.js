const Generator = require('yeoman-generator')
const { kebabCase } = require('lodash')
const path = require('path')
const npm = require('enpeem')
const pkg = require('./configs/package.json')

module.exports = class ServiceGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts)
    const pkg = require(path.join(process.cwd(), 'package.json'))
    this.options = pkg.warhead
    this.dependencies = [
      'warhead-lambda'
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
    }]
    return this.prompt(prompts).then(prompts => {
      Object.assign(this.options, prompts)
      this.pkg = pkg(this)
    })
  }

  writing () {
    this.fs.writeJSON(
      this.destinationPath('services', this.options.name, 'package.json'),
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
    return new Promise((resolve, reject) => {
      npm.install({
        dir: this.destinationPath(''),
        dependencies: this.dependencies,
        save: true,
        production: true,
        logLevel: 'silent'
      }, function (err, res) {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
