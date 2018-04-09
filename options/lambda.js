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
  },
  region: {
    service: 'Choose a region to deploy this service to',
    project: 'Choose a default region to deploy services in this project to'
  }
}

module.exports = function ({
  Handler = 'index.handler',
  MemorySize = 128,
  Publish = true,
  Role = undefined,
  Runtime = 'nodejs6.10',
  Timeout = 3,
  region = 'us-east-1'
} = {}, type = 'project') {
  return [
    {
      type: 'list',
      name: 'region',
      message: MESSAGES.region[type],
      default: region,
      choices: [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-south-1',
        'ap-southeast-1',
        'ap-southeast-2',
        'ca-central-1',
        'cn-north-1',
        'eu-central-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'sa-east-1',
        'us-gov-west-1'
      ]
    },
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
        'nodejs8.10',
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
