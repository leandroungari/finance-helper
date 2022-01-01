import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class MethodNotAllowed extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.METHOD_NOT_ALLOWED, error instanceof Error ? error : new Error(error))
  }
}