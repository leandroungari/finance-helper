import Wallet from '../../entities/Wallet'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import TickerMappingsRepository from '../../externals/repositories/TickerMappingsRepository'

export default class MergePositionsUseCase {
  constructor(
    private positionsRepository: PositionsRepository,
    private ordersRepository: OrdersRepository,
    private tickerMappingsRepository: TickerMappingsRepository
  ) {}

  async execute(walletId: string, from: string, to: string) {
    const [,positions] = await Promise.all([
      this.ordersRepository.replaceTickerFromOrders(walletId, from, to),
      this.positionsRepository.getAllPositionsFromWallet(walletId)
    ])
    const orders = await this.ordersRepository.getOrdersByTicker(walletId, to)
    const wallet = new Wallet(walletId)
    wallet.setPositions(positions)
    const newPosition = wallet.recalculatePosition(to, orders)
    if (wallet.contains(to)) {
      await this.positionsRepository.update(walletId, newPosition)
    } else if (newPosition.getQuantity() > 0) {
      await this.positionsRepository.save(walletId, newPosition)
    }
    const oldPositionIndex = wallet.getIndexFromTicker(from)
    if (oldPositionIndex !== -1) {
      const oldPosition = wallet.getPositionByIndex(oldPositionIndex)
      await this.positionsRepository.delete(walletId, from, oldPosition.getFirstInvestment())
    }
    await this.tickerMappingsRepository.createMapping(from, to)
    return newPosition
  }
}