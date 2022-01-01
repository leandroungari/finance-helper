import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class BadGateway extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.BAD_GATEWAY, error instanceof Error ? error : new Error(error))
  }
}