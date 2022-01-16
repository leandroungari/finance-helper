import Position from '../../entities/Position'

export default interface PositionsRepository {
  save(wallet: string, position: Position, investmentDate: Date): Promise<boolean>;
  update(wallet: string, position: Position, investmentDate: Date): Promise<boolean>;
  getPositionByTicker(wallet: string, ticker: string): Promise<Position | undefined>;
  getAllPositionsFromWallet(wallet: string): Promise<Position[]>;
}