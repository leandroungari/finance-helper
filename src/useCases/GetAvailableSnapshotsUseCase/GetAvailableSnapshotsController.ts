import SnapshotsRepository from '../../externals/repositories/SnapshotsRepository'
import SnapshotsRepositoryPostgres from '../../externals/repositories/SnapshotsRepositoryPostgres'
import GetAvailableSnapshotsUseCase from './GetAvailableSnapshotsUseCase'

export default class GetAvailableSnapshotsController {
  private snapshotsRepository: SnapshotsRepository
  constructor() {
    this.snapshotsRepository = new SnapshotsRepositoryPostgres()
  }

  async handle(walletId: string) {
    const useCase = new GetAvailableSnapshotsUseCase(this.snapshotsRepository)
    return await useCase.execute(walletId)
  }
}