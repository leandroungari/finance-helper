import OrdersRepository from '../../externals/repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../externals/repositories/OrdersRepositoryPostgres'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../externals/repositories/PositionsRepositoryPostgres'
import TickerMappingsRepository from '../../externals/repositories/TickerMappingsRepository'
import TickerMappingsRepositoryPostgres from '../../externals/repositories/TickerMappingsRepositoryPostgres'
import MergePositionsUseCase from './MergePositionsUseCase'

export default class MergePositionsController {
  private positionsRepository: PositionsRepository
  private ordersRepository: OrdersRepository
  private tickerMappingsRepository: TickerMappingsRepository

  constructor() {
    this.positionsRepository = new PositionsRepositoryPostgres()
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.tickerMappingsRepository = new TickerMappingsRepositoryPostgres()
  }

  async handle(walletId: string, from: string, to: string) {
    const useCase = new MergePositionsUseCase(
      this.positionsRepository,
      this.ordersRepository,
      this.tickerMappingsRepository
    )
    return await useCase.execute(walletId, from, to)
  }
}