import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class InternalServerError extends HttpException {
  constructor(error: Error | string | any) {
    super(StatusCode.INTERNAL_SERVER_ERROR, error instanceof Error ? error : new Error(error))
  }
}