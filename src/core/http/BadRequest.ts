import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class BadRequest extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.BAD_REQUEST, error instanceof Error ? error : new Error(error))
  }
}