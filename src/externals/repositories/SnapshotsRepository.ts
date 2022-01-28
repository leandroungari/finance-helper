import Position from '../../entities/Position'

export default interface SnapshotsRepository {

  save(walletId: string, date: Date, positions: Position[]): Promise<boolean>

  getPositions(walletId: string, date: Date): Promise<Position[]>

  getSnapshotsAvailable(walletId: string): Promise<Date[]>
}