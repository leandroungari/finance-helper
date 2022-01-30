import SnapshotsRepository from '../../externals/repositories/SnapshotsRepository'
import SnapshotsRepositoryPostgres from '../../externals/repositories/SnapshotsRepositoryPostgres'
import GetSnapshotUseCase from './GetSnapshotUseCase'

export default class GetSnapshotController {
  private snapshotsRepository: SnapshotsRepository
  constructor() {
    this.snapshotsRepository = new SnapshotsRepositoryPostgres()
  }

  async handle(walletId: string, date: Date) {
    const useCase = new GetSnapshotUseCase(this.snapshotsRepository)
    return await useCase.execute(walletId, date)
  }
}