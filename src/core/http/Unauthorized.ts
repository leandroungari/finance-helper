import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class Unauthorized extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.UNAUTHORIZED, error instanceof Error ? error : new Error(error))
  }
}