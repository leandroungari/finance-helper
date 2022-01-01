import StatusCode from './StatusCode'

export default class HttpException extends Error {
  public statusCode: StatusCode

  constructor(statusCode: StatusCode, error: Error) {
    super(error.message)
    this.stack = error.stack
    this.statusCode = statusCode
  }
}