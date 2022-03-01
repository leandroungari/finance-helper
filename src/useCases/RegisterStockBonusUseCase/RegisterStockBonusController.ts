import OrdersRepository from '../../externals/repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../externals/repositories/OrdersRepositoryPostgres'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../externals/repositories/PositionsRepositoryPostgres'
import { StockBonusDTO } from './RegisterStockBonusDTO'
import RegisterStockBonusUseCase from './RegisterStockBonusUseCase'

export default class RegisterStockBonusController {
  
  private ordersRepository: OrdersRepository
  private positionsRepository: PositionsRepository

  constructor() {
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.positionsRepository = new PositionsRepositoryPostgres()
  }

  async handle(walletId: string, data: StockBonusDTO) {
    const useCase = new RegisterStockBonusUseCase(this.ordersRepository, this.positionsRepository)
    return await useCase.execute(walletId, data)
  }
}