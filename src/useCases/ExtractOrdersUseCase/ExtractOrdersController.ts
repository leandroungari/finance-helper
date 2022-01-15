import BrokageNotesFileRepository from '../../repositories/BrokageNotesFileRepository'
import BrokageNotesFileRepositoryClear from '../../repositories/BrokageNotesFileRepositoryClear'
import OrdersRepository from '../../repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../repositories/OrdersRepositoryPostgres'
import PositionsRepository from '../../repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../repositories/PositionsRepositoryPostgres'
import ExtractOrdersUseCase from './ExtractOrdersUseCase'

export default class ExtractOrdersController {
  
  private brokageNotesFileRepository: BrokageNotesFileRepository
  private ordersRepository: OrdersRepository
  private positionsRepository: PositionsRepository

  constructor() {
    this.brokageNotesFileRepository = new BrokageNotesFileRepositoryClear()
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.positionsRepository = new PositionsRepositoryPostgres()
  }

  async handle(wallet: string, date: string) {
    const useCase = new ExtractOrdersUseCase(
      this.brokageNotesFileRepository, 
      this.ordersRepository, 
      this.positionsRepository
    )
    const orders = await useCase.execute(wallet, date)
    return orders
  }

}