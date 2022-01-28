import Order from '../../entities/Order'
import Wallet from '../../entities/Wallet'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import SnapshotsRepository from '../../externals/repositories/SnapshotsRepository'

export default class CreateSnapshotUseCase {
  constructor(
    private snapshotRepository: SnapshotsRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute(walletId: string, date: Date) {
    let snapshotWallet = new Wallet('snapshot')
    const existingSnapshotsDates = await this.snapshotRepository.getSnapshotsAvailable(walletId)
    const previousSnapshot = this.identityPreviousSnapshot(snapshotWallet, existingSnapshotsDates, date)
    snapshotWallet = await this.loadBasePositionsInWallet(snapshotWallet, previousSnapshot)
    const nextOrders = await this.ordersRepository.getOrdersInInterval(
      walletId, 
      previousSnapshot ?? new Date('1900-01-01'),
      date
    )
    snapshotWallet = this.addOrdersToWallet(snapshotWallet, nextOrders)
    await this.snapshotRepository.save(walletId, date, snapshotWallet.getPositions() ?? [])
    return snapshotWallet.getPositions()
  }

  addOrdersToWallet(wallet: Wallet, orders: Order[]) {
    orders.forEach((order) => {
      wallet.addNewInvestment(
        order.getDescription(), 
        order.getQuantity(),
        order.getUnitaryPrice(),
        order.getType(),
        new Date(order.getDate())
      )
    })
    return wallet
  }

  async loadBasePositionsInWallet(wallet: Wallet, previousSnapshot: Date | undefined) {
    if (previousSnapshot) {
      const previousPositions = await this.snapshotRepository.getPositions(wallet.getId(), previousSnapshot)
      wallet.setPositions(previousPositions)
    } else {
      wallet.setPositions([])
    }
    return wallet
  }

  identityPreviousSnapshot(wallet: Wallet, existingSnapshotsDates: Date[], date: Date) {
    let previousSnapshot: Date | undefined = undefined
    for (let i = 0; i < existingSnapshotsDates.length; i++) {
      if (existingSnapshotsDates[i] > date) {
        previousSnapshot = existingSnapshotsDates[i-1]
      }
    }
    return previousSnapshot
  }
}