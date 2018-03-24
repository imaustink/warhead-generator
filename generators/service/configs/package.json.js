module.exports = function (generator) {
  const options = generator.options
  const pkg = {
    name: options.name,
    description: options.description,
    warhead: {
      settings: options.settings
    },
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
    dependencies: {}
  }

  return pkg
}
