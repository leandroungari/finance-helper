import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class ServiceUnavailable extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.SERVICE_UNAVAILABLE, error instanceof Error ? error : new Error(error))
  }
}