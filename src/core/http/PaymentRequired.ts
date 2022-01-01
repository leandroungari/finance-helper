import HttpException from './HttpException'
import StatusCode from './StatusCode'

export default class PaymentRequired extends HttpException {
  constructor(error: Error | string) {
    super(StatusCode.PAYMENT_REQUIRED, error instanceof Error ? error : new Error(error))
  }
}