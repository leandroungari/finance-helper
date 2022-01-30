import SnapshotsRepository from '../../externals/repositories/SnapshotsRepository'

export default class GetAvailableSnapshotsUseCase {
  constructor(
    private snapshotsRepository: SnapshotsRepository
  ) {}

  async execute(walletId: string) {
    const items = await this.snapshotsRepository.getSnapshotsAvailable(walletId)
    return items.map((item) => item.toISOString().split('T')[0])
  }
}