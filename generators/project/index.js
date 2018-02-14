const Generator = require('yeoman-generator')
const { kebabCase } = require('lodash')
const mkdirp = require('mkdirp')
const npm = require('enpeem')

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
      'standard'
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
      this.prompts = prompts
    })
  }

  writing () {
    // This hack is necessary because NPM does not publish `.gitignore` files
    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath('', '.gitignore')
    )
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('', 'package.json'),
      this.prompts
    )
    mkdirp(this.destinationPath('', 'services/'))
  }

  install () {
    return new Promise((resolve, reject) => {
      npm.install({
        dir: this.destinationPath(''),
        dependencies: this.devDependencies,
        saveDev: true,
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
