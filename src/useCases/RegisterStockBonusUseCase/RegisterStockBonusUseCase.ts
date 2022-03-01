import BonusOrder from '../../entities/Orders/BonusOrder'
import Wallet from '../../entities/Wallet'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import { StockBonusDTO } from './RegisterStockBonusDTO'

export default class RegisterStockBonusUseCase {

  constructor(
    private ordersRepository: OrdersRepository,
    private positionsRepository: PositionsRepository
  ) {}

  async execute(walletId: string, data: StockBonusDTO) {
    const wallet = new Wallet(walletId)
    const positions = await this.positionsRepository.getAllPositionsFromWallet(walletId)
    wallet.setPositions(positions)
    if (wallet.validate()) {
      const order = this.createBonusOrder(data)
      wallet.addNewInvestment(order)
      await this.ordersRepository.save(wallet, [order])
      const position = wallet.getPositionFromTicker(data.ticker)
      if (position === undefined) {
        throw new Error(`Fail to retrieve the position of ticker: ${data.ticker}`)
      }
      position.setBalance(position.getBalance() + data.quantity * data.averagePrice)
      await this.positionsRepository.save(walletId, position)
    }
  }

  private createBonusOrder(data: StockBonusDTO) {
    return new BonusOrder(data.ticker, data.date, data.quantity, data.averagePrice, data.currency)
  }
}