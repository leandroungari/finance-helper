import OrdersRepository from '../../externals/repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../externals/repositories/OrdersRepositoryPostgres'
import GetOrdersOfAssetUseCase from './GetOrdersOfAssetUseCase'

export default class GetOrdersOfAssetController {
  private ordersRepository: OrdersRepository
  constructor() {
    this.ordersRepository = new OrdersRepositoryPostgres()
  }

  async handle(walletId: string, ticker: string, from?: Date, to?: Date) {
    const useCase = new GetOrdersOfAssetUseCase(this.ordersRepository)
    return await useCase.execute(walletId, ticker, from, to)
  }
}