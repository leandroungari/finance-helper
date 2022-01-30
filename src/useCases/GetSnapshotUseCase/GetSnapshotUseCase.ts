import SnapshotsRepository from '../../externals/repositories/SnapshotsRepository'

export default class GetSnapshotUseCase {
  constructor(
    private snapshotsRepository: SnapshotsRepository
  ) {}

  async execute(walletId: string, date: Date) {
    const positions = await this.snapshotsRepository.getPositions(walletId, date)
    return positions
  }
}