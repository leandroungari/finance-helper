import Position from '../../entities/Position'

export default interface PositionsRepository {
  save(wallet: string, position: Position): Promise<boolean>
  update(wallet: string, position: Position): Promise<boolean>
  getPositionByTicker(wallet: string, ticker: string): Promise<Position | undefined>
  getAllPositionsFromWallet(wallet: string): Promise<Position[]>
  delete(walletId: string, ticker: string, firstInvestment: Date): Promise<boolean>
  updateCurrentPrice(walletId: string, ticker: string, price: number): Promise<boolean>
}