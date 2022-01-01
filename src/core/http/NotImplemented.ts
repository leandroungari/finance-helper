import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class NotImplemented extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.NOT_IMPLEMENTED, error instanceof Error ? error : new Error(error))
  }
}