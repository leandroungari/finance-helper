import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class NotFound extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.NOT_FOUND, error instanceof Error ? error : new Error(error))
  }
}