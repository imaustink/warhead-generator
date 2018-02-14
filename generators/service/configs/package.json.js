module.exports = function (generator) {
  const { options } = generator
  const adapters = {
    lambda: {
      name: 'warhead-lambda',
      version: '0.0.0-alpha.0'
    }
  }
  const dependencies = {
    [adapters[options.platform].name]: adapters[options.platform].version
  }
  const pkg = {
    name: options.name,
    description: options.description,
    version: '0.0.0',
    main: `service/index.js`,
    author: {
      name: generator.user.git.name(),
      email: generator.user.git.email()
    },
    directories: {
      lib: 'service/',
      test: 'test/'
    },
    devDependencies: {},
    dependencies
  }

  return pkg
}
