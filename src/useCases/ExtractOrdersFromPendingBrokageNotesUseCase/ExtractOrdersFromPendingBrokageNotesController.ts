import BrokageNotesFileRepository from '../../externals/repositories/BrokageNotesFileRepository'
import BrokageNotesFileRepositoryClear from '../../externals/repositories/BrokageNotesFileRepositoryClear'
import BrokageNotesRepository from '../../externals/repositories/BrokageNotesRepository'
import BrokageNotesRepositoryPostgres from '../../externals/repositories/BrokageNotesRepositoryPostgres'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../externals/repositories/OrdersRepositoryPostgres'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../externals/repositories/PositionsRepositoryPostgres'
import ProcessPendingBrokageNotesUseCase from './ExtractOrdersFromPendingBrokageNotesUseCase'

export default class ExtractOrdersFromPendingBrokageNotesController {
  private brokageNotesRepository: BrokageNotesRepository
  private brokageNotesFileRepository: BrokageNotesFileRepository
  private ordersRepository: OrdersRepository
  private positionsRepository: PositionsRepository

  constructor() {
    this.brokageNotesFileRepository = new BrokageNotesFileRepositoryClear()
    this.brokageNotesRepository = new BrokageNotesRepositoryPostgres()
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.positionsRepository = new PositionsRepositoryPostgres()
  }

  async handle(walletId: string) {
    const useCase = new ProcessPendingBrokageNotesUseCase(
      this.brokageNotesFileRepository,
      this.ordersRepository,
      this.positionsRepository,
      this.brokageNotesRepository
    )
    return await useCase.execute(walletId)
  }

}