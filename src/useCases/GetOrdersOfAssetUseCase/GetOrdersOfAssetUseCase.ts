import OrdersRepository from '../../externals/repositories/OrdersRepository'

export default class GetOrdersOfAssetUseCase {
  constructor(
    private ordersRepository: OrdersRepository
  ) {}

  async execute(walletId: string, ticker: string, from?: Date, to?: Date) {
    const orders = await this.ordersRepository.getOrdersByTickerInInterval(walletId, ticker, from, to)
    return orders
  }
}