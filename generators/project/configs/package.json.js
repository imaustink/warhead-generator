module.exports = function (generator) {
  const { options, platformDefaults } = generator

  const pkg = {
    name: options.name,
    version: '0.0.0',
    description: options.description,
    scripts: {
      ava: 'nyc ava **/*.test.js',
      'cover:html': 'nyc report --reporter=html',
      'cover:text': 'nyc report --reporter=text-lcov',
      'test:watch': 'nyc ava **/*.test.js --watch',
      test: 'standard --fix && npm run ava',
      linter: 'standard --fix',
      ci: 'npm run test && npm run cover:text | coveralls'
    },
    author: {
      name: generator.user.git.name(),
      email: generator.user.git.email()
    },
    warhead: {
      platform: options.platform,
      defaults: platformDefaults
    },
    ava: {
      require: [
        'babel-core/register'
      ]
    },
    babel: {
      presets: [
        'es2015'
      ],
      plugins: [
        'transform-runtime'
      ],
      ignore: '**/*.test.js',
      env: {
        development: {
          sourceMaps: 'inline'
        }
      }
    },
    license: 'MIT',
    devDependencies: {},
    dependencies: {}
  }

  return pkg
}
