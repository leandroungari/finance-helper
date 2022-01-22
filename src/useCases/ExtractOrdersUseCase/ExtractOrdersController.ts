import BrokageNotesFileRepository from '../../externals/repositories/BrokageNotesFileRepository'
import BrokageNotesFileRepositoryClear from '../../externals/repositories/BrokageNotesFileRepositoryClear'
import BrokageNotesRepository from '../../externals/repositories/BrokageNotesRepository'
import BrokageNotesRepositoryPostgres from '../../externals/repositories/BrokageNotesRepositoryPostgres'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../externals/repositories/OrdersRepositoryPostgres'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../externals/repositories/PositionsRepositoryPostgres'
import ExtractOrdersUseCase from './ExtractOrdersUseCase'

export default class ExtractOrdersController {
  
  private brokageNotesFileRepository: BrokageNotesFileRepository
  private ordersRepository: OrdersRepository
  private positionsRepository: PositionsRepository
  private brokageNotesRepository: BrokageNotesRepository

  constructor() {
    this.brokageNotesFileRepository = new BrokageNotesFileRepositoryClear()
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.positionsRepository = new PositionsRepositoryPostgres()
    this.brokageNotesRepository = new BrokageNotesRepositoryPostgres()
  }

  async handle(wallet: string, date: string) {
    const useCase = new ExtractOrdersUseCase(
      this.brokageNotesFileRepository, 
      this.ordersRepository, 
      this.positionsRepository,
      this.brokageNotesRepository
    )
    const orders = await useCase.execute(wallet, date)
    return orders
  }

}