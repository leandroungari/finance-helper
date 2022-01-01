import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class Forbidden extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.FORBIDDEN, error instanceof Error ? error : new Error(error))
  }
}