import OrdersRepository from '../../externals/repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../externals/repositories/OrdersRepositoryPostgres'
import SnapshotsRepository from '../../externals/repositories/SnapshotsRepository'
import SnapshotsRepositoryPostgres from '../../externals/repositories/SnapshotsRepositoryPostgres'
import CreateSnapshotUseCase from './CreateSnapshotUseCase'

export default class CreateSnapshotController {
  private snapshotRepository: SnapshotsRepository
  private ordersRepository: OrdersRepository
  
  constructor() {
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.snapshotRepository = new SnapshotsRepositoryPostgres()
  }

  async handle(walletId: string, date: string) {
    const useCase = new CreateSnapshotUseCase(
      this.snapshotRepository,
      this.ordersRepository
    )
    return await useCase.execute(walletId, new Date(date))
  }
}