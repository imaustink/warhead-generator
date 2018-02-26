const MEM_MAX = 3008
const MEM_MIN = 128
const MEM_MULTIPLIER = 64
const MESSAGES = {
  handler: {
    service: 'Enter the name of the handler for this service',
    project: 'Enter the default name of the service handlers for this project'
  },
  memorySize: {
    service: 'Enter the amount of memory, in MB, for this function to use',
    project: 'Enter the default amount of memory, in MB, for functions in this project'
  },
  publish: {
    service: 'Enable versioning for this service',
    project: 'Enable versioning by default for services in the project'
  },
  role: {
    service: 'Enter an execution role arn for this service',
    project: 'Enter a default execution role for services in this project'
  },
  runtime: {
    service: 'Choose a runtime for this service',
    project: 'Choose a default runtime for services in this project'
  },
  timeout: {
    service: 'Enter a timeout for this service',
    project: 'Enter a default timeout for services in this project'
  }
}

module.exports = function ({
  Handler = 'index.handler',
  MemorySize = 128,
  Publish = true,
  Role = undefined,
  Runtime = 'nodejs6.10',
  Timeout = 3
} = {}, type = 'project') {
  return [
    {
      name: 'Handler',
      message: MESSAGES.handler[type],
      default: Handler
    },
    {
      name: 'MemorySize',
      message: MESSAGES.memorySize[type],
      default: MemorySize,
      filter: parseInt,
      validate (input) {
        if (!(input % MEM_MIN === 0)) {
          return `Memory must be a multiple of ${MEM_MULTIPLIER}MB`
        }
        if (input < MEM_MIN) {
          return `Memory must be at least ${MEM_MIN}MB`
        }
        if (input > MEM_MAX) {
          return `Memory cannot exceed ${MEM_MAX}MB`
        }
        return true
      }
    },
    {
      type: 'confirm',
      name: 'Publish',
      message: MESSAGES.publish[type],
      default: Publish
    },
    {
      name: 'Role',
      message: MESSAGES.role[type],
      default: Role,
      validate (input) {
        if (input.indexOf('arn:aws:') === 0) {
          return true
        } else {
          return 'Please enter a valid ARN'
        }
      }
    },
    {
      type: 'list',
      name: 'Runtime',
      message: MESSAGES.runtime[type],
      default: Runtime,
      choices: [
        'nodejs6.10',
        'nodejs4.3',
        'nodejs4.3-edge',
        'nodejs'
      ]
    },
    {
      name: 'Timeout',
      message: MESSAGES.timeout[type],
      default: Timeout
    }
  ]
}
